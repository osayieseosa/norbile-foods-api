const User = require('../models/User')
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
    const {name, password, email} = req.body

    if(!req.body.roles){
        var roles = ["2005"]
    }else{
        var {roles} = req.body
    }

    if(!password || !name || !email || !roles){
        return res.status(400).json({message: "All fields are required"})
    }
    try{
        const duplicate = await User.findOne({email}).exec()
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

module.exports ={
    register
}