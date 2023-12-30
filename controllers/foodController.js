const Food = require('../models/Food')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
})

// Loveyourself12*

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
}

const getAllFood = async(req, res) => {
    try{
        const allFood = await Food.find().lean()
        if(!allFood){
            return res.status(400).json({ message: 'No Food found'})
        }
        
        res.json(allFood)
        
    }catch (err){
        console.log(err)
    }
}

const createNewFood = async (req, res) => {
    const {image, name, price} = req.body

    if(!image || !name || !price){
        return res.status(400).json({message: "All fields are required"})
    }
    try{
        const duplicate = await Food.findOne({name}).exec()
        if(duplicate){
            return res.status(409).json({message: 'Duplicate Food foound'})
        }
        const food = await Food.create({name, image, price: parseInt(price, 10)})
        if(food){
            res.status(201).json({message: `New food ${food.name} created`})
        }else{
            res.status(400).json({message: `invalid user data received`})
        }
    }catch(err){
        console.log(err)
    }

}

const updateFood = async (req, res) => {
    const {id ,name, price, image} = req.body
    if(image) {
        if(!id || !name || !price || !image){
            return res.status(400).json({message: "All fields are required"})
        }
    
        try{
            const food = await Food.findById(id).exec()
    
            if(!food){
                return res.status(400).json({message: 'Food not found'})
            }
    
            const duplicate = await Food.findOne({name}).lean().exec()
    
            if(duplicate && duplicate?._id.toString() !== id){
                return res.status(409).json({message: 'Duplicate Food found'})
            }
            const public_id = food.image.object_id
            await cloudinary.uploader.destroy(public_id)
    
            const uploadImage = (image) =>{     return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(image, opts, (error, result) => {
                    if(result && result.secure_url){
                        return resolve(result)
                    }
                    return reject({message: error.message})
                })
            })}
    
               const response = await uploadImage(image)
            
            const newImage = {
                name: response.secure_url,
                object_id: response.public_id,
              }
    
            food.name = name
            food.price = price
            food.image = newImage
    
            const updatedFood = await food.save()
    
            res.json({message: `${updatedFood.name} updated`})
        }catch(err){
            console.log(err)
        }
    }else{
    if(!id || !name || !price){
        return res.status(400).json({message: "All fields are required"})
    }

    try{
        const food = await Food.findById(id).exec()

        if(!food){
            return res.status(400).json({message: 'Food not found'})
        }

        const duplicate = await Food.findOne({name}).lean().exec()

        if(duplicate && duplicate?._id.toString() !== id){
            return res.status(409).json({message: 'Duplicate Food found'})
        }

        food.name = name
        food.price = price

        const updatedFood = await food.save()

        res.json({message: `${updatedFood.name} updated`})
    }catch(err){
        console.log(err)
    }
        
}
}

const deleteFood = async (req, res) => {
    const {id} = req.params

    if(!id){
        return res.status(400).json({message:'All fields are required'})
    }

    try{
        const food = await Food.findById(id).exec()

        if(!food){
            return res.status(404).json({message:'Food not found'})
        }
        const public_id = food.image.object_id
    
        await food.deleteOne()
        await cloudinary.uploader.destroy(public_id)

        const reply = `food deleted`
       
        res.json(reply)
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getAllFood,
    createNewFood,
    updateFood,
    deleteFood
}