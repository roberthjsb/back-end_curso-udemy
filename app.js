const express =  require('express');
const mongoose = require('mongoose');


var app = express();
const URI = 'mongodb://localhost:2701/hospitalDB';
mongoose.connect(URI, (err,res)=>{
    if(err) {
        throw err;
    }
    else{
        console.log('online');
    }
});


app.get('/',(req,resp,next) =>{
    resp.status(404).json({
        ok: true,
        mensaje: 'server iniciado'
    });
})

app.listen(8000, () => {
    console.log('Servidor iniciado...');
});