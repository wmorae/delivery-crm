const Cliente = require('../models/clientes')
const Pedido = require('../models/pedidos')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


const index = async (req, res) => {
    const clientes = await Cliente.find({});

    res.render("clientes/all", { clientes });
}
const newForm = (req, res) => {
    res.render("clientes/novo");
}
const create = async (req, res) => {
    const cliente = new Cliente(req.body.cliente);
    cliente.telefone = cliente.telefone.replace(/\s/g, "").replace("+", "").replace("(", "").replace(")", "").replace("-", "");

    if (cliente.telefone.indexOf('55') == 0)
        cliente.telefone = cliente.telefone.slice(2)
    cliente.nome = cliente.nome.toLowerCase();
    await cliente.save();

    req.flash('success', 'Cliente Criado com sucesso!')
    res.redirect(`/clientes/${cliente._id}`);
}
const read = async (req, res) => {
    const { id } = req.params
    const cliente = await Cliente.findById(id);
    const pedidos = await Pedido.find({ 'cliente.telefone': cliente.telefone });

    if (cliente.geometry.coordinates == false) {
        const geoData = await geocoder.forwardGeocode({
            query: cliente.endereco + " curitiba",
            limit: 1
        }).send()

        cliente.geometry = geoData.body.features[0].geometry
        req.flash('info', 'Por favor, confirme a localização do endereço')
    }


    pedidos.sort((a, b) => b.data - a.data)
    res.render("clientes/cliente", { cliente, pedidos, info: req.flash('info') });
}
const update = async (req, res) => {
    const { id } = req.params;
    const { cliente } = req.body;

    if (req.body.confirmlocation) {
        const geoData = await geocoder.forwardGeocode({
            query: cliente.endereco + " curitiba",
            limit: 1
        }).send()

        cliente.geometry = geoData.body.features[0].geometry
    } else {
        cliente.telefone = cliente.telefone.replace(/\s/g, "").replace("+", "").replace("(", "").replace(")", "").replace("-", "");
        cliente.nome = cliente.nome.toLowerCase();
        cliente.geometry = {};
        if (cliente.telefone.indexOf('55') == 0)
            cliente.telefone = cliente.telefone.slice(2)
    }

    const doc = await Cliente.findByIdAndUpdate(id, cliente)
    req.flash('success', 'Cliente atualizado com sucesso!')
    res.redirect(`/clientes/${id}`);
}
const destroy = async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findByIdAndDelete(id)
    req.flash('success', 'Cliente Deletado com sucesso!')
    res.redirect('/clientes');
}

module.exports = {
    create,
    read,
    update,
    destroy,
    newForm,
    index
}