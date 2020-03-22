var express = require('express');

var app = express();

var medicoModel = require('../models/medicoModel');

var mdAutenticacion = require('../middlewares/autenticacion');

// obtiene todos los medicos -  metodo GET
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    medicoModel.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    mensaje: 'Error cargando medicos',
                    erros: err
                });
            }

            medicoModel.count({}, (err, conteo) => {
                res.status(200).json({
                    status: true,
                    medicos: medicos,
                    total: conteo
                });
            });


        });
});

// crea un medico - metodo POST
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new medicoModel({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoSave) => {
        if (err) {
            return res.status(400).json({
                status: false,
                mensaje: 'Error al guardar medico',
                errors: err
            });
        }

        res.status(201).json({
            status: true,
            medico: medicoSave
        });
    });
});

// crea un medico - metodo POST
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    medicoModel.findById(id, (err, medicoFind) => {
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medicoFind) {
            return res.status(400).json({
                status: false,
                mensaje: 'medico con el id ' + id + ' no existe',
                errors: { message: 'medico con el id ' + id + ' no existe' }
            });
        }

        medicoFind.nombre = body.nombre;
        medicoFind.img = body.img;
        medicoFind.usuario = req.usuario._id;
        medicoFind.hospital = body.hospital;

        medicoFind.save((err, medicoSave) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(201).json({
                status: true,
                medico: medicoSave
            });
        });
    });
});

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    medicoModel.findByIdAndRemove(id, (err, medicoRemove) => {
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: 'Error al eliminar usuario',
                errors: err
            });
        }

        if (!medicoRemove) {
            return res.status(400), json({
                status: false,
                mensaje: 'No existe medico con id',
                errors: { message: 'No existe medico con id' }
            });
        }

        res.status(200).json({
            status: true,
            medico: medicoRemove
        });
    });
});



module.exports = app;