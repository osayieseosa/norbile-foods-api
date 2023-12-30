const Orders = require('../models/Order')

const getAllOrders = async(req, res) => {
    try{
        const allOrders = await Orders.find().lean()
        if(!allOrders){
            return res.status(400).json({ message: 'No Orders found'})
        }
        
        res.json(allOrders)
        
    }catch (err){
        console.log(err)
    }
}

const createNewOrders = async (req, res) => {
    const {name, cart, price,location,phone,lga, status, timeStamp} = req.body

    if(!name || !cart || !price ||!location ||!phone ||!lga, !status, !timeStamp){
        return res.status(400).json({message: "All fields are required"})
    }
    try{
        const orders = await Orders.create({name, cart, price,location,phone,lga, status, timeStamp})
        if(orders){
            res.status(201).json({message: `New order ${orders.name} created`})
        }else{
            res.status(400).json({message: `invalid user data received`})
        }
    }catch(err){
        console.log(err)
    }

}

const updateOrders = async (req, res) => {
    const {id,name, cart, price, location, phone, lga, status, timeStamp} = req.body

    if(!id ||!name || !cart || !price || !location || !phone || !lga ||!status || !timeStamp){
        return res.status(400).json({message: "All fields are required"})
    }

    try{
        const orders = await Orders.findById(id).exec()

        if(!orders){
            return res.status(400).json({message: 'Orders not found'})
        }

        const duplicate = await Orders.findOne({name}).lean().exec()

        if(duplicate && duplicate?._id.toString() !== id){
            return res.status(409).json({message: 'Duplicate Orders found'})
        }
        name, cart, price,location,phone,lga
        orders.name = name
        orders.cart = cart
        orders.price = price
        orders.location = location
        orders.phone = phone
        orders.lga = lga
        name.status = status
        name.timeStamp = timeStamp

        const updatedOrders = await orders.save()

        res.json({message: `${updatedOrders.name} updated`})
    }catch(err){
        console.log(err)
    }
}

const deleteOrders = async (req, res) => {
    const {id} = req.params

    if(!id){
        return res.status(400).json({message:'All fields are required'})
    }

    try{
        const orders = await Orders.findById(id).exec()

        if(!orders){
            return res.status(404).json({message:'Orders not found'})
        }
    
        await orders.deleteOne()

        const reply = `order deleted`
       
        res.json(reply)
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getAllOrders,
    createNewOrders,
    updateOrders,
    deleteOrders
}