const express = require('express');
const SEED = require('../config/config').SEED;
const jwt = require('jsonwebtoken');
const mAutenticacion = require('../middleware/autenticacion');
const Hospitales = require('../models/Hopitales');
const app = express();

app.get('/', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Hospitales.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
    .exec( (err, hospitales) => {
        if (err) { 
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospitales.'
                , error: err
            });
        }
        Medico.count({}).exec((error,conteo)=>{
            return res.status(200).json({
                ok: true,
                hospitales: hospitales,
                total: conteo
            });
        })
    });
});

app.use('/', (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorrecto.',
                error: err
            });
        }
        next();
    })
})


app.post('/',mAutenticacion.verify,(req, res) => {
let body =req.body;
let hospital= new Hospitales({
    nombre: body.nombre,
    img: body.img,
    usuario: body.usuario
});
hospital.save((err,hospitalGuardado)=>{
    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando hospitales.'
            , error: err
        });
    }
    return res.status(201).json({
        ok: true,
        hospital: hospitalGuardado
    });

})
});

app.put('/:id',mAutenticacion.verify, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Hospitales.findById(id, (err, hospital) => {
        if (err) {
            console.log('\x1b[32m%s\x1b[0m Express server error:');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscar hospital.'
                , error: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: `Hospital con id ${id} no existe`
                , error: { message: 'No existe hospital con este ID' }
            });
        }
        hospital.nombre = body.nombre;
        hospital.img= body.img;
        hospital.usuario= body.usuario;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error buscar hospital.'
                        , error: err
                    });
                }
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error actualizando hospital.'
                    , error: err
                });
            }
            return res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        })
    });
});

app.delete('/:id',mAutenticacion.verify, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Hospitales.findByIdAndDelete(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando  hospital.'
                , error: err
            });
        }
        return res.status(200).json({
            ok: true,
            hospital: hospital
        });
    })
});

module.exports = app;