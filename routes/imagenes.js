const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.get('/:tipo/:img',(req,resp,next) =>{

    var tipo = req.params.tipo;
    var img = req.params.img;
    var pathImage = path.resolve(__dirname,`../upload/${tipo}/${img}`);

    if(fs.existsSync(pathImage)){
        resp.sendfile(pathImage)
    }else{
        var noImage = path.resolve(__dirname,'../assets/no-img.jpg');
        resp.sendfile(noImage);
    }

})

module.exports = app;