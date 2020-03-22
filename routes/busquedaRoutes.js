var express = require('express');

var app = express();

var hospitalModel = require('../models/hospitalModel');
var medicoModel = require('../models/medicoModel');
var usuarioModel = require('../models/usuario');

//Busqueda por tabla
app.get('/coleccion/:table/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;

    var promesa;
    var regex = new RegExp(busqueda, i); //para ser case sencitives

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedico(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospital(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                status: false,
                mensaje: 'Los tipo de busqueda solo son: usuarios, medicos y hospitales',
                errors: 'Tipo de Coleccion/tabla no valido'
            });
    }

    promesa.then(data => {
        res.status(200).json({
            status: true,
            [tabla]: data
        });
    });

});

// rutas
// busqueda General en todas las colecciones
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, i); //para ser case sencitives

    Promise.all([
        buscarHospital(busqueda, regex),
        buscarMedico(busqueda, regex),
        buscarUsuario(busqueda, regex)
    ]).then(respuestas => {
        res.status(200).json({
            status: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]

        });
    });
});


function buscarHospital(busqueda, regex) {
    return new Promise((resolve, reject) => {
        hospitalModel.find({ nombre: regex }, (err, hospitales) => {
            if (err) {
                reject('Error al cargar hospitales', err);
            } else {
                resolve(hospitales);
            }
        });
    });
}

function buscarMedico(busqueda, regex) {
    return new Promise((resolve, reject) => {
        medicoModel.find({ nombre: regex }, (err, medicos) => {
            if (err) {
                reject('Error al cargar medicos', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuario(busqueda, regex) {
    return new Promise((resolve, reject) => {
        usuarioModel.find({}, 'nombre email, role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}


module.exports = app;