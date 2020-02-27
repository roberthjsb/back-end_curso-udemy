const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const bcrypt = require('bcryptjs');
// const Usuario = require('./models/usuario');

var app = express();
const routesApp = require('./routes/app');
const routesUsuario = require('./routes/usuario');
const routesLogin = require('./routes/login');
const routesHospitales = require('./routes/hospitales');
const routesMedico = require('./routes/medico');
const routesBusqueda = require('./routes/busqueda');
const routeUpload = require('./routes/upload');
const routeimagenes = require('./routes/imagenes');


app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*')
   res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.header('Accept', 'application/json, text/plain, */*');
   next();
});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.post('/ping',(req,resp)=>{
    console.log("ENtro POST.......");
return resp.json({saludo:'hola',ok:true})
});

// Rutas
// app.post('/usuarios',usuarioPostHandler)
app.use('/login',routesLogin)
app.use('/usuarios', routesUsuario);
app.use('/hospitales',routesHospitales);
app.use('/medicos',routesMedico);
app.use('/busqueda',routesBusqueda);
app.use('/upload',routeUpload);
app.use('/imagenes',routeimagenes);
app.use('/', routesApp);
console.log('Routes: ',app.routes)
const URI = 'mongodb://localhost:27017/hospitalDB';
mongoose.connection.openUri(URI, (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});


app.listen(8000, () => {
    console.log('Express server puerto 8000: \x1b[32m%s\x1b[0m', 'online');
});

function usuarioPostHandler(req,resp){
    
    let body = req.body;
    console.log('Entro post usuario....')
    console.log(body)
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role: body.role,
    });
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error cargando usuario.'
                , error: err
            });

        }
        return resp.status(201).json({
            ok: true,
            usuarios: usuarioGuardado
        });
    })
}