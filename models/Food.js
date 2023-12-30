const mongoose = require('mongoose')

const foodSchema = mongoose.Schema({
    image: {
        name: {type:String, required: true}, 
        object_id: {type:String, required: true}
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Food', foodSchema)