const express = require('express');
const fileUpload = require('express-fileupload');
const Hospital = require('../models/Hopitales');
const Medico = require('../models/medico');
const usuario = require('../models/usuario');
const fs = require('fs');

app.use(fileUpload());

const app = express();
app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    var tiposValidos = ['medicos', 'hospitales', 'usuarios'];
    if (tiposValidos.indexOf(() => extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'colección invalida',
            error: { mensaje: 'colección invalida' }
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no selecciono nada',
            error: { mensaje: 'Debe seleccionar una imgen' }
        });
    }
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1];
    var extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(() => extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension invalida',
            error: { mensaje: 'Extension invalida' }
        });
    }

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    var path = `./upload/${tipo}/${nombreArchivo}`;
    archivo.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Extension invalida',
                error: { mensaje: 'Extension invalida' }
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
    })

});
function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usurio') {
        usuario.findById(id, (err, usuario) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'usuario no existe',
                    error: { mensaje: 'usuario no existe' }
                });

            }
            var oldPath = '/upload/usuarios/' + usuario.img
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usurioActualizado) => {

                return res.status(200).json({
                    ok: false,
                    mensaje: 'usuario actualizado',
                    usuario: usurioActualizado
                });
            })
        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hopital) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'hospital no existe',
                    error: { mensaje: 'hospital no existe' }
                });

            }
            var oldPath = '/upload/hopitales/' + hopital.img
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }
            hopital.img = nombreArchivo;
            hopital.save((err, hopitalActualizado) => {

                return res.status(200).json({
                    ok: false,
                    mensaje: 'hopital actualizado',
                    hopital: hopitalActualizado
                });
            })
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'medico no existe',
                    error: { mensaje: 'medico no existe' }
                });

            }
            var oldPath = '/upload/medicos/' + medico.img
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: false,
                    mensaje: 'medico actualizado',
                    medico: medicoActualizado
                });
            })
        });
    }
}
module.exports = app;