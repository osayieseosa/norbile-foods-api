const mongoose = require('mongoose')

const ordersSchema = mongoose.Schema({
        name: {type:String, required: true}, 
        cart: {
            items:[{type:String, required: true}]
        },
        price: {type:Number, required: true},
        lga: {type:String, required: true},
        location: {type:String, required: true},
        phone: {type:String, required: true},
        status: {type:String, required: true},
        timeStamp: {type: String, required: true},
})

module.exports = mongoose.model('Orders', ordersSchema)