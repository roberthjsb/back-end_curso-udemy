const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var app = express();
const routesApp = require('./routes/app');
const routesUsuario = require('./routes/usuario');
const routesLogin = require('./routes/login');
const routesHospitales = require('./routes/hospitales');
const routesMedico = require('./routes/medico');
const routesBusqueda = require('./routes/busqueda');
const routeUpload = require('./routes/upload');
const routeimagenes = require('./routes/imagenes');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// Rutas
app.use('/login',routesLogin)
app.use('/usuarios', routesUsuario);
app.use('/hospitales',routesHospitales);
app.use('/medicos',routesMedico);
app.use('/busqueda',routesBusqueda);
app.use('/upload',routeUpload);
app.use('/imagenes',routeimagenes);
app.use('/', routesApp);


app.listen(8000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});