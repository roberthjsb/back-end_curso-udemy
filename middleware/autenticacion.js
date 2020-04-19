var jwt = require('jsonwebtoken');
var SEED= require('../config/config').SEED;

module.exports.verify=function( req, res, next){
    let token = req.query.token;
    console.log('\x1b[32m%s\x1b[0m verificando token:');
    jwt.verify(token,SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorrecto.'
                , error: err
            });
        }
        req.usuario = decoded.usuario;
        next();
    })
}
