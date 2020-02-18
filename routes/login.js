var express = require('express');
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;
var jwt = require('jsonwebtoken');

var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


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
        return res.status(200).json(
            {
                ok: true,
                usuario: usuario,
                id: usuario._id,
                token: token
            }
        )
    });
});

async function verifyGoogleAuthentication() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}

app.post('/google', async (req, res) => {
    var googleUser = await verifyGoogleAuthentication(token)
        .catch(e => {
            return res.status(403).json(
                {
                    ok: false,
                    mensaje: 'token inválido'
                }
            )
        });
    Usuario.findOne({ email: googleUser.email }, (err, UsuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            })
        }
        if (UsuarioDB === false) {
            if (UsuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su autenticacion normal',
                    errors: err
                })
            }else{
                var token = jwt.sign({usuario:UsuarioDB},SEED,{expiresIn:14400});
               return res.status(200).json({
                    ok:true,
                    token: token,
                    usuario:UsuarioDB,
                    id:UsuarioDB._id

                })
            }
        }else{
            var usuario = new Usuario();
            usuario.nombre=googleUser.nombre;
            usuario.email=googleUser.email;
            usuario.img= googleUser.img;
            usuario.google= true;
            usuario.password= ':)';

            usuario.save((err,UsuarioDB)=>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al guardar usuario',
                        errors: err
                    })
                }

                var token = jwt.sign({usuario:UsuarioDB},SEED,{expiresIn:14400});
                return res.status(200).json({
                     ok:true,
                     token: token,
                     usuario:UsuarioDB,
                     id:UsuarioDB._id
 
                 })
            })
        }

    })





    return res.status(200).json(
        {
            ok: true,
            googleUser: googleUser
        }
    );
})

module.exports = app;