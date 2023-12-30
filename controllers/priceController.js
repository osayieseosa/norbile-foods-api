const Prices = require('../models/Price')

const getAllPrices = async(req, res) => {
    try{
        const allPrices = await Prices.find().lean()
        if(!allPrices){
            return res.status(400).json({ message: 'No Prices found'})
        }
        
        res.json(allPrices)
        
    }catch (err){
        console.log(err)
    }
}

const createNewPrice = async (req, res) => {
    const {charges, delivery} = req.body

    if(!charges || !delivery){
        return res.status(400).json({message: "All fields are required"})
    }
    try{
        const prices = await Prices.create({charges, delivery})
        if(prices){
            res.status(201).json({message: `created`})
        }else{
            res.status(400).json({message: `invalid data received`})
        }
    }catch(err){
        console.log(err)
    }

}

const updatePrice = async (req, res) => {
    const {id,charges, delivery} = req.body

    if(!id ||!charges || !delivery){
        return res.status(400).json({message: "All fields are required"})
    }

    try{
        const prices = await Prices.findById(id).exec()

        if(!prices){
            return res.status(400).json({message: 'not found'})
        }
        prices.charges = charges
        prices.delivery = delivery

        await prices.save()

        res.json({message: `updated`})
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getAllPrices,
    createNewPrice,
    updatePrice
}