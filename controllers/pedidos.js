const Cliente = require('../models/clientes')
const Pedido = require('../models/pedidos')
const helper = require('../utils/helper.js')

const newForm = (req, res) => {
    res.render('pedidos/novo');
}

const index = async (req, res) => {
    let now = new Date();
    let { data = helper.formatDate2(now) } = req.query

    let dataFiltro = new Date(data);
    let pedidos = await Pedido.find({ $and: [{ data: { $gte: dataFiltro } }, { data: { $lt: dataFiltro.addDays(1) } }] })
    pedidos.sort((a, b) => b.numero - a.numero)
    let pedidosIndex = helper.indexPedidos(pedidos)


    if (req.headers['content-type'] == 'application/json')
        res.send(pedidos)
    else
        res.render("pedidos/all", { pedidos, data, pedidosIndex });
}

const read = async (req, res) => {
    let { id } = req.params;
    let pedido = await Pedido.findById(id)
    res.render('comanda', { pedido })

}


const create = async (req, res) => {
    const pedido = new Pedido(req.body)
    const cliente = req.body.cliente
   
    if (pedido.entrega == "delivery"){
         if (cliente._id) {
            let doc = await Cliente.findOneAndUpdate({ _id: cliente._id }, cliente)
        }
     else {
        let client = new Cliente(cliente)
        doc = await client.save()
        cliente._id = client._id
    }
}
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let npedidos = await Pedido.find({ data: { $gte: today } })
    try {
        npedidos = npedidos.map(x => x.numero).reduce(function (p, v) {
            return (p > v ? p : v);
        })
    }
    catch (e) {
        npedidos = 0;
    }

    pedido.data = now
    pedido.numero = npedidos + 1
    pedido.status = "pendente"
    const { id } = await pedido.save()

    req.flash('success', 'Pedido criado com sucesso!')
    res.redirect(`/pedidos/${id}`)
    // res.render('comanda', { pedido ,success:req.flash('success'),})
}

const destroy = async (req, res) => {
    const { id } = req.params
    const doc = await Pedido.findByIdAndDelete(id)

    req.flash('success', 'Pedido deletado com sucesso!')
    res.redirect('/pedidos')

}

module.exports = {
    index,
    destroy,
    read,
    create,
    newForm

}
