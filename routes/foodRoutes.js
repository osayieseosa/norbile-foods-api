const express = require('express')
const router = express.Router()
const foodController = require('../controllers/foodController')

router.route('/')
    .get(foodController.getAllFood)
    .post(foodController.createNewFood)
    .patch(foodController.updateFood)

router.route('/:id')
    .delete(foodController.deleteFood)

module.exports = router