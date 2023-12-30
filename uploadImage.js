const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
})

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
}

module.exports = (image) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (error, result) => {
            if(result && result.secure_url){
                return resolve(result)
            }
            return reject({message: error.message})
        })
    })
}