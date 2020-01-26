const express = require('express');
const app = express();

app.get('/',(req,resp,next) =>{
    resp.status(404).json({
        ok: true,
        mensaje: 'server iniciado'
    });
})

module.exports = app;