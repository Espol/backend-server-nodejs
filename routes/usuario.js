var express = require('express');
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middlewares/autenticacion');



var app = express();

var UsuarioModel = require('../models/usuario');

// Obtener todos los usuarios - motodo GET
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    UsuarioModel.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                UsuarioModel.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                });




            });


});

// Crear Metodo PUT PARA ACTUALIZAR USUARIO
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    UsuarioModel.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe usuario con el ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });


    });

});

// Crear Metodo DELETE PARA ELIMINAR USUARIO USUARIO
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    UsuarioModel.findByIdAndRemove(id, (err, usuarioRemove) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Eliminar usuario',
                errors: err
            });
        }

        if (!usuarioRemove) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con el id',
                errors: { message: 'No existe usuario con el ID' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioRemove
        });

    });

});


// Crear Metodo POST para insertar un nuevo usuario
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new UsuarioModel({
        nombre: body.nombre,
        email: body.email,
        img: body.img,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    });



});

module.exports = app;