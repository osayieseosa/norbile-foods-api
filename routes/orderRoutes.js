const express = require('express')
const router = express.Router()
const ordersController = require('../controllers/ordersController')

router.route('/')
    .get(ordersController.getAllOrders)
    .post(ordersController.createNewOrders)
    .patch(ordersController.updateOrders)

router.route('/:id')
    .delete(ordersController.deleteOrders)

module.exports = router