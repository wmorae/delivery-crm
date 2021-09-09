const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Cliente = require('./clientes')

const opts = { toJSON: { virtuals: true } }

const pedidoSchema = new Schema({
    numero: Number,
    data: Date,
    entrega: {
        type: String,
        enum: ['delivery', 'balcão'],
        required: true
    },
    cliente: {
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'client'
        },
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
        metodo: String,
        trocopara: { type: Number, required: false }
        // , total: { type: Number, required: false },
        // subtotal: { type: Number, required: false }
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
pedidoSchema.post('findOneAndDelete', async function (doc) {
    if (doc && doc.cliente._id)
        await Cliente.findByIdAndUpdate(doc.cliente._id, { $pull: { pedidos: doc._id } });

})
pedidoSchema.post('save', async function (doc) {
    if (doc && doc.cliente._id)
        await Cliente.findByIdAndUpdate(doc.cliente._id, { $push: { pedidos: doc._id } });



})

module.exports = mongoose.model('Pedido', pedidoSchema);