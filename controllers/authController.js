const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    const {name, password} = req.body

    if(!name || !password){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const foundUser = await User.findOne({name}).exec()

    if(!foundUser){
        return res.status(401).json({message: 'Unauthorized'})
    }

    const match = bcrypt.compareSync(password,foundUser.password)

    if(!match) return res.status(401).json({message: 'Unauthorized'})

    const roles = Object.values(foundUser.roles).filter(Boolean)
    const email = foundUser.email

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "name": foundUser.name,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1m'}
    )
    const refreshToken = jwt.sign(
        {
            "name": foundUser.name
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1d'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ roles,email,accessToken })

}
const refresh = async (req, res) => {
    const cookies = req.cookies
    console.log(cookies)

    if(!cookies?.jwt) return res.status(401).json({message: 'Unauthorized line 53'})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if(err) return res.status(403).json({message: 'Forbidden'})

            const foundUser = await User.findOne ({ name: decoded.name})

            if(!foundUser) return res.status(401).json({ message: 'Unauthorized'})

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "name": foundUser.name,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '1m'}
            )

            res.json({accessToken})
        }
    )
}
const logout = async (req, res) => {

    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.json({message: 'Cookie cleared'})
}

module.exports = {
    login,
    refresh,
    logout
}