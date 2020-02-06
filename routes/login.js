var express = require('express');
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


var app = express();

app.post('/', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json(
                {
                    ok: false,
                    message: 'Error al buscar el usuario',
                    error: err
                }
            )
        }
        if (!usuario) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'Credenciales incorectas - email',
                }
            )
        }
        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json(
                {
                    ok: false,
                    message: 'Credenciales incorectas - password',
                }
            )
        }
        usuario.password = '??????';
        let token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 });
        res.status(200).json(
            {
                ok: true,
                usuario: usuario,
                id: usuario._id,
                token: token
            }
        )
    });
});

module.exports = app;