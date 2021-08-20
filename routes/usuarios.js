const express = require('express')
const passport = require('passport')
const router = express.Router()
const usuarios = require('../controllers/usuarios')
const catchAsync = require('../utils/catchAsync')

router.route('/login')
    .get(usuarios.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usuarios.login)

router.route('/registrar')
    .get(usuarios.registerForm)
    .post(catchAsync(usuarios.register))


router.route('/logout')
    .all(usuarios.logout)

module.exports = router