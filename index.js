if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Cliente = require('./models/clientes')
const Pedido = require('./models/pedidos')
const helper = require('./utils/helper.js')
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')
const { listeners } = require('./models/clientes')


//const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/adalto';
const dbUrl = "mongodb+srv:\/\/restbarao1:Q4wh7PKcJH4y1VcF@clusteradalto.3bnro.mongodb.net/adalto?retryWrites=true&w=majority"
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

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));





app.get('/', (req, res) => {
    res.render('home');
})
app.get('/comanda', (req, res) => {
    const pedido = req.body
    console.log(pedido)
    res.render('comanda', { ...pedido })
})

//CRUD Pedidos
{
    app.get('/pedidos/novo', (req, res) => {
        res.render('pedidos/novo');
    })

    app.get('/pedidos', async (req, res) => {

        console.log()
        let now = new Date();
        let { data = helper.formatDate2(now) } = req.query

        let dataFiltro = new Date(data);
        let pedidos = await Pedido.find({ $and: [{ data: { $gte: dataFiltro } }, { data: { $lt: dataFiltro.addDays(1) } }] })
        pedidos.sort((a, b) => b.numero - a.numero)

        if (req.headers['content-type'] == 'application/json')
            res.send(pedidos)
        else
            res.render("pedidos/all", { pedidos, helper, data });
    })
    app.get('/pedidos/:id', async (req, res) => {
        let { id } = req.params;
        let pedido = await Pedido.findById(id)
        res.render('comanda', { pedido })

    })


    app.post('/pedidos', async (req, res) => {
        const pedido = new Pedido(req.body)
        const cliente = req.body.cliente
        if (pedido.entrega == "delivery") {
            let doc = await Cliente.findOneAndUpdate({ telefone: cliente.telefone }, cliente)
            if (doc == null) {
                let client = new Cliente(cliente)
                doc = await client.save()
            }
        }
        let now = new Date();
        let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let npedidos = await Pedido.find({ data: { $gte: today } })
        npedidos = npedidos.map(x => x.numero).reduce(function (p, v) {
            return (p > v ? p : v);
        })
        pedido.data = now
        pedido.numero = npedidos + 1
        pedido.status = "pendente"
        pedido.pagamento.subtotal = pedido.itens.map(i => i.valor * i.qty).reduce((total, num) => total + num)
        pedido.pagamento.total = pedido.pagamento.subtotal + pedido.cliente.frete
        await pedido.save()
        pedido.imprimir = true;
        res.render('comanda', { pedido })
    })

    app.delete('/pedidos/:id', async (req, res) => {
        let { id } = req.params
        let doc = await Pedido.findByIdAndDelete(id)
        res.redirect('/pedidos')

    })

    app.patch('/pedidos/:id', (req, res) => {

    })

}

//CRUD CLientes//
{
    app.get('/clientes', async (req, res) => {
        const clientes = await Cliente.find({});

        res.render("clientes/all", { clientes });
    })
    app.get('/clientes/novo', (req, res) => {
        res.render("clientes/novo");
    })
    app.post('/clientes', async (req, res) => {
        const cliente = new Cliente(req.body.cliente);
        cliente.telefone = cliente.telefone.replace(/\s/g, "").replace("+", "").replace("(", "").replace(")", "").replace("-", "");

        if (cliente.telefone.indexOf('55') == 0)
            cliente.telefone = cliente.telefone.slice(2)
        cliente.nome = cliente.nome.toLowerCase();
        await cliente.save();
        res.redirect(`/clientes/${cliente._id}`);
    })
    app.get('/clientes/:id', async (req, res) => {
        const { id } = req.params
        const cliente = await Cliente.findById(id);
        const pedidos = await Pedido.find({ 'cliente.telefone': cliente.telefone });
        pedidos.sort((a, b) => b.data - a.data)
        res.render("clientes/cliente", { cliente, pedidos, helper });
    })
    app.patch('/clientes/:id', async (req, res) => {
        const { id } = req.params;
        const { cliente } = req.body;
        cliente.telefone = cliente.telefone.replace(/\s/g, "").replace("+", "").replace("(", "").replace(")", "").replace("-", "");
        cliente.nome = cliente.nome.toLowerCase();
        if (cliente.telefone.indexOf('55') == 0)
            cliente.telefone = cliente.telefone.slice(2)
        const doc = await Cliente.findByIdAndUpdate(id, cliente)
        res.redirect(`/clientes/${id}`);
    })
    app.delete('/clientes/:id', async (req, res) => {
        const { id } = req.params;
        const cliente = await Cliente.findByIdAndDelete(id)
        res.redirect('/clientes');
    })
}
app.get('/search', async (req, res) => {
    const { q } = req.query;
    const result = await Cliente.find({ $or: [{ 'nome': { $regex: new RegExp(q, "i") } }, { 'telefone': { $regex: new RegExp(q, "i") } }] })
    res.send(result);
})

app.all('*', (req, res) => {
    res.render('erro404');
})
app.use((erro, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = erro
    if (!erro.message) erro.message = 'Something went wrong'
    res.status(statusCode).render('erro500', { erro })

})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})