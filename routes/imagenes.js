const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.get('/:tipo/:img',(req,resp,next) =>{

    var tipo = req.params.tipo;
    var img = req.params.img;
    var pathImage = path.resolve(__dirname,`../upload/${tipo}/${img}`);
    console.log('HOLA.............');
    console.log({tipo,img,pathImage});
   

    if(fs.existsSync(pathImage)){
        console.log(pathImage);
        resp.sendfile(pathImage)
    }else{
        var noImage = path.resolve(__dirname,'../assets/no-img.jpg');
        console.log(noImage)
        resp.sendfile(noImage);
    }

})

module.exports = app;