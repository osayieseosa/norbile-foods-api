const User = require('../models/User')
const bcrypt = require('bcryptjs')

const getAllUsers = async(req, res) => {
    try{
        const allUsers = await User.find().lean()
        if(!allUsers){
            return res.status(400).json({ message: 'No Food found'})
        }
        res.json(allUsers)
        
    }catch (err){
        console.log(err)
    }
}

const createNewUser = async (req, res) => {
    const {name, password, email, roles} = req.body

    if(!password || !name || !email || !roles){
        return res.status(400).json({message: "All fields are required"})
    }
    try{
        const duplicate = await User.findOne({name}).exec()
        if(duplicate){
            return res.status(409).json({message: 'Duplicate User foound'})
        }

        
        const salt = bcrypt.genSaltSync(10)

        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = await User.create({name, "password":hashedPassword, email, roles})
        if(user){
            res.status(201).json({message: `New user ${user.name} created`})
        }else{
            res.status(400).json({message: `invalid user data received`})
        }
    }catch(err){
        console.log(err)
    }

}

const updateUser = async (req, res) => {
    const {id ,name, password, email} = req.body

    if(!id || !name || !password || !email){
        return res.status(400).json({message: "All fields are required"})
    }

    try{
        const user = await User.findById(id).exec()

        if(!user){
            return res.status(400).json({message: 'User not found'})
        }

        const duplicate = await User.findOne({ name }).lean().exec()

        if(duplicate && duplicate?._id.toString() !== id){
            return res.status(409).json({message: 'Duplicate User found'})
        }

        const salt = bcrypt.genSalt(10)

        user.name = name
        user.password = bcrypt.hashSync(password, salt)
        user.email = email

        const updatedUser = await user.save()

        res.json({message: `${updatedUser.name} updated`})
    }catch(err){
        console.log(err)
    }
}

const deleteUser = async (req, res) => {
    const {id} = req.body

    if(!id){
        return res.status(400).json({message:'All fields are required'})
    }

    try{
        const user = await User.findById(id).lean().exec()

        if(!user){
            return res.status(404).json({message:'User not found'})
        }
    
        await User.deleteOne()

        const reply = `user deleted`
       
        res.json(reply)
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}