const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
}, { collection: 'Hospitales' });

module.exports = mongoose.model("Hospitales", hospitalSchema);