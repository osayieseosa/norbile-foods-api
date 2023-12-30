const rateLimit = require('express-rate-limit')

const LoginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message:
    {
        message: 'Too many login attempts from this IP, please try again after a 60 second pause'
    },
    handler: (req, res, next, options) => {
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeaders: true
})

module.exports = LoginLimiter