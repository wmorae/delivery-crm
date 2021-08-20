const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const pedidos = require('../controllers/pedidos')

router.route('/novo')
    .get(pedidos.newForm)

router.route('/')
    .get(catchAsync(pedidos.index))
    .post(catchAsync(pedidos.create))

router.route('/:id')
    .get(catchAsync(pedidos.read))
    .delete(catchAsync(pedidos.destroy))

module.exports = router

