module.exports.estaLogado = (req, res, next) => {

    if (!req.isAuthenticated() && req.originalUrl != '/login') {
        req.session.urlOriginal = req.originalUrl
        //req.flash('error', 'Você precisa estar logado para tomar essa ação.')
        // return res.render('./usuarios/login')
        return res.redirect('/login')
    }
    next();
}