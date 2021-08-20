const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const clientes = require('../controllers/clientes')

router.route('/novo')
    .get(clientes.newForm)

router.route('/')
    .get(catchAsync(clientes.index))
    .post(catchAsync(clientes.create))

router.route('/:id')
    .get(catchAsync(clientes.read))
    .patch(catchAsync(clientes.update))
    .delete(catchAsync(clientes.destroy))

module.exports = router