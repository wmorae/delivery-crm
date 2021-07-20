const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    nome: String,
    frete: Number,
    telefone: String,
    endereco: String
});

module.exports = mongoose.model('Client', clientSchema);