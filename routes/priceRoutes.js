const express = require('express')
const router = express.Router()
const priceController = require('../controllers/priceController')

router.route('/')
    .get(priceController.getAllPrices)
    .post(priceController.createNewPrice)
    .patch(priceController.updatePrice)

module.exports = router