if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override');

const Cliente = require('./models/clientes');
const Pedido = require('./models/pedidos');
const Usuario = require('./models/usuarios');

const helper = require('./utils/helper.js');
const ExpressError = require('./utils/ExpressError');
const clientesRoutes = require('./routes/clientes');
const pedidosRoutes = require('./routes/pedidos');
const usuariosRoutes = require('./routes/usuarios');
const { estaLogado } = require('./middleware')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const localStrategy = require('passport-local');

const MongoStore = require('connect-mongo')

const dbUrl = process.env.DB_URL || "'mongodb://localhost:27017/adalto'";
// const dbUrl = "mongodb+srv:\/\/restbarao1:Q4wh7PKcJH4y1VcF@clusteradalto.3bnro.mongodb.net/adalto?retryWrites=true&w=majority"
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
app.use(express.static(path.join(__dirname, 'public')))

const store = new MongoStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
})
store.on('error', function (e) {
    console.log("Session store error", e)
})

const sessionConfig = {
    store,
    name: 'session',//name of the cookie stored in browser
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true, // Only https connection cookie allowed, localhost is not Secured
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}


app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(Usuario.authenticate()))

passport.serializeUser(Usuario.serializeUser());
passport.deserializeUser(Usuario.deserializeUser());

app.use((req, res, next) => {
    res.locals.user = req.user;
    // console.log(req.user)
    res.locals.helper = helper
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.info = req.flash('info')
    next();
}, estaLogado)

app.get('/', (req, res) => {
    res.render('home');
})
app.get('/erro', (req, res) => {
    res.render('erro500');
})
app.get('/comanda', (req, res) => {
    const pedido = req.body
    console.log(pedido)
    res.render('comanda', { ...pedido })
})

app.use('/pedidos', pedidosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/', usuariosRoutes);

app.get('/search', async (req, res) => {
    const { q } = req.query;
    const result = await Cliente.find({ $or: [{ 'nome': { $regex: new RegExp(q, "i") } }, { 'telefone': { $regex: new RegExp(q, "i") } }] })
    res.send(result);
})
app.get('/mapa', async (req, res) => {
    const { q } = req.query
    const geoData = await geocoder.forwardGeocode({
        query: q,
        limit: 5
    }).send()
    //res.send(geoData.body.features.map(x => x.place_name))
    res.render('locais.ejs', { geoData, q })
})


app.all('*', (req, res) => {
    res.render('erro404');
})
app.use((erro, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = erro
    if (!erro.message) erro.message = 'Something went wrong'
    res.status(status).render('erro500', { erro })

})
let port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
