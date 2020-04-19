const express = require('express');
const Hospital = require('../models/Hopitales');
const medico = require('../models/medico');
const usuario = require('../models/usuario');
const app = express();

app.get('/todo/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, i);
    Promise.all([
        BuscarHospital(busqueda, regex),
        BuscarMedico(busqueda, regex),
        BuscarUsuario(busqueda, regex)
    ]).then((respuestas) => {

        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    })


});

app.get('/colecciones/:tabla/:busqueda', (req, resp) => {
    let busqueda = req.params.busqueda;
    let tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    let promesa;
    switch (tabla) {
        case 'usuarios':
            promesa = BuscarUsuario(busqueda, regex);
            break;
        case 'medicos':
            promesa = BuscarMedico(busqueda, regex);
            break;
        case 'hospitales':
            promesa = BuscarHospital(busqueda, regex);
            break;
        default:
            return resp.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busquedas medico, usuario y hospitales',
                error: { mensaje: 'tipo de tabla/colección no es valida' }
            })
    }

    promesa.then((data) => {
        return resp.status(200).json({
            ok: true,
            [tabla]: data,
        });
    });
})

function BuscarHospital(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex }, (err, hospitales) => {
            if (err) {
                reject('Error al cargar hospitales')
            } else {
                resolve(hospitales);
            }
        });
    });
}

function BuscarMedico(busqueda, regex) {
    return new Promise((resolve, reject) => {
        medico.find({ nombre: regex }, (err, medicos) => {
            if (err) {
                reject('Error al cargar hospitales')
            } else {
                resolve(medicos);
            }
        });
    });
}
function BuscarUsuario(busqueda, regex) {
    return new Promise((resolve, reject) => {
        usuario.find({}, 'id nombre email').or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar hospitales')
                } else {
                    resolve(usuarios);
                }
            });
    });
}


module.exports = app;