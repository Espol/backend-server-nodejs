var express = require('express');

var app = express();

var hospitalModel = require('../models/hospitalModel');

var mdAutenticacion = require('../middlewares/autenticacion');

// obtiene todos los hospitales -  metodo GET
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    hospitalModel.find({})
        .skip(desde)
        .limit(desde)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    mensaje: 'Error cargando hospitales',
                    erros: err
                });
            }

            hospitalModel.count({}, (err, conteo) => {
                res.status(200).json({
                    status: true,
                    hospitales: hospitales,
                    total: conteo
                });
            });
        });
});

// crea un hospital - metodo POST
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new hospitalModel({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario
    });

    hospital.save((err, hospitalSave) => {
        if (err) {
            return res.status(400).json({
                status: false,
                mensaje: 'Error al guardar hospital',
                errors: err
            });
        }

        res.status(201).json({
            status: true,
            hospital: hospitalSave
        });
    });
});

// crea un hospital - metodo POST
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    hospitalModel.findById(id, (err, hospitalFind) => {
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospitalFind) {
            return res.status(400).json({
                status: false,
                mensaje: 'Hospital con el id ' + id + ' no existe',
                errors: { message: 'Hospital con el id ' + id + ' no existe' }
            });
        }

        hospitalFind.nombre = body.nombre;
        hospitalFind.img = body.img;
        hospitalFind.usuario = body.usuario;

        hospitalFind.save((err, hospitalSave) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(201).json({
                status: true,
                hospital: hospitalSave
            });
        });
    });
});

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    hospitalModel.findByIdAndRemove(id, (err, hospitalRemove) => {
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: 'Error al eliminar usuario',
                errors: err
            });
        }

        if (!hospitalRemove) {
            return res.status(400), json({
                status: false,
                mensaje: 'No existe Hospital con id',
                errors: { message: 'No existe Hospital con id' }
            });
        }

        res.status(200).json({
            status: true,
            hospital: hospitalRemove
        });
    });
});



module.exports = app;