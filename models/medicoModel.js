var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre del medico es obligatorio'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'HospitalModels', required: [true, 'El id Hospital es obligatorio'] }
});

module.exports = mongoose.model('MedicoModel', medicoSchema);