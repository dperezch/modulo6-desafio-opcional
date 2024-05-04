const express = require('express');
const app = express();
const exphds = require('express-handlebars');
const fs = require('fs');
/* se utiliza moment para generar las fechas más fácilmente y se configura con formato local (español)*/
const moment = require('moment');
moment.locale('es');

app.listen(3000, ()=>{
    console.log('Escuchando puerto 3000');
})

/* Handlebars */
app.set("view engine", "handlebars");
app.engine("handlebars", exphds.engine());

/* Bootstrap */
app.use('/bootstrap', express.static(__dirname+'/node_modules/bootstrap/dist'));

/* Ruta principal */
app.get('/', (req,res)=>{
    res.render("home")
});

/* Ruta para crear archivo */
app.get('/crear', (req,res)=>{
    const { archivo, contenido } = req.query;
    const dia = moment().format('L');
    fs.writeFile('./archivos/' + archivo + '.txt', dia + '  ' + contenido, (err,data)=>{
        if(err){
            res.render("mensaje",{
                mensaje: "Surgió un error al crear el archivo"
            })
            console.log(err);
        } else {
            res.render("mensaje",{
                mensaje: "Archivo creado con éxito."
            })
        }
    })
});

/* Ruta para leer archivo */
app.get('/leer', (req,res)=>{
    const { archivo } = req.query;
    fs.readFile('./archivos/' + archivo + '.txt', (err, data)=>{
        if(err){
            res.render("mensaje", {
                mensaje:"Archivo no existe o está corrupto"
            })
            console.log(err);
        } else {
            //res.send(data)
            res.render("mensaje",{
                archivo: `${archivo}`,
                mensaje: "Archivo leído con éxito",
                data: `${data}`
            })
        }
    })
})

/* Ruta para renombrar archivo */
app.get('/renombrar', (req,res)=>{
    const { nombre, nuevoNombre } = req.query;
    fs.rename('./archivos/' + nombre + '.txt', './archivos/'+ nuevoNombre + '.txt', (err, data)=>{
        if(err){
            res.render("mensaje", {
                mensaje: "El archivo no existe"
            })
        } else {
            res.render("mensaje",{
                mensaje: `El archivo ${nombre}.txt se ha renombrado con éxito como ${nuevoNombre}.txt`
            })
        }
    })
})

/* Ruta para eliminar archivo */
app.get('/eliminar', (req,res)=>{
    const { archivo } = req.query;
    fs.rm('./archivos/' + archivo + '.txt', (err, data)=>{
        if(err){
            res.render("mensaje",{
                mensaje: "Error al tratar de borrar el archivo"
            })
        } else {
            res.render("mensaje",{
                mensaje: `El archivo ${archivo}.txt se eliminó con éxito`
            })
        }
    })
})