/*jshint esversion: 6 */
// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// inicializar variable
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse application/json

// server index config
// var serverIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serverIndex(__dirname + '/uploads'));

// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospitalRoutes');
var medicoRoutes = require('./routes/medicoRoutes');
var busquedaRoutes = require('./routes/busquedaRoutes');
var loginRoutes = require('./routes/login');
var uploadRoutes = require('./routes/uploadRoutes');
var imagenesRoutes = require('./routes/imagenesRoutes');

// conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB2', (err, resp) => {
    if (err) throw err;

    console.log('Base de Datos: \x1b[32m%s\x1b[0m', ' online');
});


// rutas
app.use('/hospital', hospitalRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/login', loginRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);



// escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', ' online');
});