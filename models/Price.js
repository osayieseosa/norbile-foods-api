const mongoose = require('mongoose')

const pricesSchema = mongoose.Schema({
        charges: {type:String, required: true}, 
        delivery: {
            oredo:{type:String, required: true},
            egor:{type:String, required: true},
            ovia:{type:String, required: true},
            ikpoba: {type: String, required: true}
        },
})

module.exports = mongoose.model('Prices', pricesSchema)