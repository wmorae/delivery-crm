
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
    numero: Number,
    data: Date,
    status: String,
    entrega: String,
    cliente: {
        _id: false,
        nome: String,
        telefone: String,
        endereco: String,
        frete: { type: Number, default: 0 }
    },
    itens: [{
        _id: false,
        qty: Number,
        desc: String,
        prot: String,
        obs: String,
        valor: Number
    }],
    pagamento: {
        metodo: String,
        trocopara: Number,
        subtotal: Number,
        total: Number
    }
});

module.exports = mongoose.model('Pedido', pedidoSchema);