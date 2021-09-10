const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } }

const pedidoSchema = new Schema({
    numero: Number,
    data: Date,
    status: String,
    entrega: {
        type: String,
        enum: ['delivery', 'balcão','ifood'],
        required: true
    },
    cliente: {
        _id: { type: String, required: false },
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
        _id: false,
        metodo: { type: String, default: 'pendente' },
        trocopara: { type: Number, required: false },
    }
}, opts);

pedidoSchema.virtual('pagamento.subtotal').get(function () {
    return this.itens.map(i => i.valor * i.qty).reduce((total, num) => total + num, 0)

});
pedidoSchema.virtual('pagamento.total').get(function () {
    return this.pagamento.subtotal + this.cliente.frete

});
pedidoSchema.virtual('pagamento.troco').get(function () {
    return this.pagamento.trocopara - this.pagamento.total

});

module.exports = mongoose.model('Pedido', pedidoSchema);