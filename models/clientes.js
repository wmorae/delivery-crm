const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } }

const clientSchema = new Schema({
    nome: String,
    frete: Number,
    telefone: String,
    endereco: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false
        }
    },
}, opts);

clientSchema.virtual('properties.htmlDescr').get(function () {
    return `<b><a href="/clientes/${this._id}">${this.nome}</a></b><p>${this.endereco}</p><b>R$${this.frete},00</b>`
    // return '<h1>im client</h1>'
});

module.exports = mongoose.model('Client', clientSchema);