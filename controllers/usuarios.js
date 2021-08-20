const Usuario = require('../models/usuarios')

const login = (req, res) => {
    const urlOriginal = req.session.urlOriginal || '/pedidos'
    delete req.session.urlOriginal
    req.flash('success', `Bem vindo de volta ${req.user.username}!`)
    res.redirect(urlOriginal)

}

const loginForm = (req, res) => {
    res.render('usuarios/login.ejs')
}

const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new Usuario({ email, username })
        const registeredUser = await Usuario.register(user, password)
        req.flash('success', 'Usuario criado com sucesso')
        res.redirect('/')
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

const registerForm = (req, res) => {
    res.render('usuarios/register.ejs')
}
const logout = (req, res) => {
    req.logout()
    req.flash('success', "Até logo!")
    res.redirect('/login')
}

module.exports = {
    login,
    logout,
    register,
    registerForm,
    loginForm
}