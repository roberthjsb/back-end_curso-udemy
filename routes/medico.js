const express = require('express');
const SEED = require('../config/config').SEED;
const jwt = require('jsonwebtoken');
const mAutenticacion = require('../middleware/autenticacion');
const Medico = require('../models/medico');
const app = express();


app.get('/', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Medico.find({})
    // .skip(desde)
    // .limit(5)
        .populate('usuario', 'nombre email').populate('hospital', 'nombre')
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando médico.'
                    , error: err
                });
            }
            Medico.count({}).exec((error,conteo)=>{
                return res.status(200).json({
                    ok: true,
                    medicos: medico,
                    total: conteo
                });
            })

        });
});
app.get('/:id',  (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Medico.findById(id, (err, medicoEncotrado) => {
        if (err) {
            console.log('\x1b[32m%s\x1b[0m Express server error:');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscar medico.'
                , error: err
            });
        }
        if (!medicoEncotrado) {
            return res.status(400).json({
                ok: false,
                mensaje: `Médico con id ${id} no existe`
                , error: { message: 'No existe médic con este ID' }
            });
        }
        else{
            return res.status(200).json({
                ok: true,
                medico: medicoEncotrado
            });
        }}
        )
})
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



app.post('/', mAutenticacion.verify, (req, res) => {
    let body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario,
        hospital: body.hospital,
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospitales.'
                , error: err
            });
        }
        return res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });

    })
});

app.put('/:id', mAutenticacion.verify, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Medico.findById(id, (err, medicoActualizado) => {
        if (err) {
            console.log('\x1b[32m%s\x1b[0m Express server error:');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscar hospital.'
                , error: err
            });
        }
        if (!medicoActualizado) {
            return res.status(400).json({
                ok: false,
                mensaje: `Médico con id ${id} no existe`
                , error: { message: 'No existe médic con este ID' }
            });
        }

        medicoActualizado.nombre = body.nombre;
        medicoActualizado.img = body.img;
        medicoActualizado.usuario = body.usuario;
        medicoActualizado.hospital = body.hospital;

        medicoActualizado.save((err, medicoGuardado) => {
            if (err) {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error buscar médico.'
                        , error: err
                    });
                }
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error actualizando médico.'
                    , error: err
                });
            }
            return res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        })
    });
});

app.delete('/:id', mAutenticacion.verify, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Medico.findByIdAndDelete(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando  medico.'
                , error: err
            });
        }
        return res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    })
});

module.exports = app;