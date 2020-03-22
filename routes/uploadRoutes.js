var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

// default options
app.use(fileUpload());

//Modelos
var UsuarioModels = require('../models/usuario');
var MedicoModels = require('../models/medicoModel');
var HospitalModels = require('../models/hospitalModel');

// rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            status: false,
            mensaje: 'Tipo de coleccion no es valido',
            errors: { message: 'las Colecciones deben ser de ' + tiposValidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            status: false,
            mensaje: 'No existe Archivos',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    //obtener el nombre del archivo
    var fileImagen = req.files.imagen;
    var nameSplit = fileImagen.name.split('.');
    var extencion = nameSplit[nameSplit.length - 1];

    //solo estas extensines son validas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            status: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las Extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    // nombre de archivo personalizado
    // id-randon.png
    var nameArchivo = `${ id }-${ new Date().getMilliseconds() }.${extencion}`;

    // mover el archivo del temporal a un 
    var path = `./uploads/${ tipo }/${ nameArchivo }`;

    fileImagen.mv(path, err => {
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: 'Error al mover Archivo',
                errors: err
            });
        }

        subirByTipo(tipo, id, nameArchivo, res);
    });

});

function subirByTipo(tipo, id, nameArchivo, res) {
    if (tipo === 'usuarios') {
        UsuarioModels.findById(id, (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    mensaje: 'Error al buscar El usuario',
                    errors: err
                });
            }
            if (!usuario) {
                return res.status(400).json({
                    status: false,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }
            var pathOld = './upload/usuarios/' + usuario.imagen;
            // Si existe, elimina al imagen anterior
            if (fs.exists(pathOld)) {
                fs.unlink(pathOld);
            }
            usuario.img = nameArchivo;
            usuario.save((err, usuarioActualizado) => {
                return res.status(200).json({
                    status: true,
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if (tipo === 'medicos') {
        MedicoModels.findById(id, (err, medico) => {

            if (err) {
                return res.status(500).json({
                    status: false,
                    mensaje: 'Error al buscar El medico',
                    errors: err
                });
            }
            if (!medico) {
                return res.status(400).json({
                    status: false,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                });
            }
            var pathOld = './upload/medicos/' + medico.imagen;
            // Si existe, elimina al imagen anterior
            if (fs.exists(pathOld)) {
                fs.unlink(pathOld);
            }
            medico.img = nameArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    status: true,
                    medico: medicoActualizado
                });
            });
        });
    }
    if (tipo === 'hospitales') {
        HospitalModels.findById(id, (err, hospital) => {

            if (err) {
                return res.status(500).json({
                    status: false,
                    mensaje: 'Error al buscar El hospital',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    status: false,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }
            var pathOld = './upload/hospitales/' + hospital.imagen;
            // Si existe, elimina al imagen anterior
            if (fs.exists(pathOld)) {
                fs.unlink(pathOld);
            }
            hospital.img = nameArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    status: true,
                    hospital: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;