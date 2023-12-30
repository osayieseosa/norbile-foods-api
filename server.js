require('dotenv').config()
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3500
const uploadImage = require("./uploadImage")
const cookies = require('cookie-parser')
const cors = require('cors')
const corsOptions = require("./config/corsOptions")
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const credentials = require('./middleware/credentials')

app.use(credentials)

app.use(cors(corsOptions))

app.use(express.json({limit: "25mb"}))

app.use(cookies())

connectDB()

app.use('/food', require('./routes/foodRoutes'))

app.use('/order', require('./routes/orderRoutes'))

app.use('/users', require('./routes/userRoutes'))

app.use('/auth', require('./routes/authRoutes'))

app.use('/register', require('./routes/registerRoute'))

app.use('/prices', require('./routes/priceRoutes'))

app.post('/upload-image', (req, res) => {
  uploadImage(req.body.image)
  .then((result) => res.json({url:result.secure_url,id:result.public_id}))
  .catch((err) => res.status(500).send(err))
    })

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
})