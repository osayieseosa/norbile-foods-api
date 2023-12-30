const express = require('express')
const LoginLimiter = require('../middleware/loginLimiter')
const router = express.Router()
const authController = require('../controllers/authController')

router.route('/')
    .post(LoginLimiter,authController.login)
router.route('/refresh')
    .get(authController.refresh)
router.route('/logout')
    .post(authController.logout)

module.exports = router
