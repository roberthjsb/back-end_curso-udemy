const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const mAutenticacion = require('../middleware/autenticacion');


const app = express();

const Usuario = require('../models/usuario');

app.get('/', (req, res, next) => {
let desde =req.query.desde||0;
desde=Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec((err, usuarios) => {
            console.log('buscando usuarios...')
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario.'
                    , error: err
                });
            }
            Usuario.count({}).exec((error,conteo)=>{
                return res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });
            })
        })
});



app.post('/', (req, res) => {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role: body.role,
    });
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando usuario.'
                , error: err
            });

        }
        return res.status(201).json({
            ok: true,
            usuarios: usuarioGuardado
        });
    })
    // return res.status(200).json({
    //     ok: true,
    //     usuarios:usuario
    // });
});
// app.use('/', (req, res, next) => {
//     let token = req.query.token;
//     jwt.verify(token, SEED, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({
//                 ok: false,
//                 mensaje: 'token incorrecto.',
//                 error: err
//             });
//         }
//         next();
//     })
// })

app.put('/:id', mAutenticacion.verify, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            console.log('\x1b[32m%s\x1b[0m Express server error:');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscar usuario.'
                , error: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `Usuario con id ${id} no existe`
                , error: { message: 'No existe usuario con este ID' }
            });
        }
        console.log(body);
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.img=body.img;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error buscar usuario usuario.'
                        , error: err
                    });
                }
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error actualizando usuario.'
                    , error: err
                });
            }
            usuarioGuardado.password = '********'
            return res.status(200).json({
                ok: true,
                usuarios: usuarioGuardado
            });
        })


    });

});

app.delete('/:id', mAutenticacion.verify, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Usuario.findByIdAndDelete(id, (err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando  usuario.'
                , error: err
            });
        }
        usuarios.password = '********'
        return res.status(200).json({
            ok: true,
            usuarios: usuarios
        });
    })
})


module.exports = app;