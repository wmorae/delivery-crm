if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose')
const Pedido = require('../models/pedidos');
const Cliente = require('../models/clientes');

const dbUrl = process.env.DB_URL || "'mongodb://localhost:27017/adalto'";

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected", dbUrl);
});

const doStuff = async () => {

    //para todos pedidos que tenha pagamento.total, deletar total e subtotal
    let pedidos = await Pedido.updateMany({ "pagamento.total": { $ne: null } }, { "$unset": { "pagamento.total": 1, "pagamento.subtotal": 1 } })

    //para todos os pedidos que tenham status $ne:null, unset
    let pedidos = await Pedido.updateMany({ status: { $ne: null } }, { "$unset": { status: 1 } })

    //para todos os clientes, procurar pedidos que tenham o seu numero
    //e adicionar cliente._id em pedido.cliente._id, e pedido._id em cliente.pedidos[]
    pedidos = await Pedido.find({ $and: [{ "cliente._id": null }, { entrega: 'delivery' }] })
    let clientes = await Cliente.find({})
    for (let cliente of clientes) {
        let listaPedidos = pedidos.filter(x => x.cliente.telefone == cliente.telefone).map(x => x._id)
        cliente.pedidos = listaPedidos.concat(cliente.pedidos.filter(x => !listaPedidos.includes(x)))

        let doc = await Cliente.findOneAndUpdate({ _id: cliente._id }, { ...cliente })
        let doc2 = await Pedido.updateMany({ "cliente.telefone": cliente.telefone }, { "cliente._id": cliente._id })
        console.log(doc)
        console.log(doc2)

    }
}

doStuff()
    .then(() => {
        mongoose.connection.close();
    });