import { v2 as cloudinary } from 'cloudinary'

// connecting to cloudinary
const connectCloudinary = async ()=>{
    // configuring cloudinary
    cloudinary.config({
        cloud_name : process.env.CLOUDINARY_CLOUD_NAME, // cloud name
        api_key : process.env.CLOUDINARY_API_KEY, // api key
        api_secret : process.env.CLOUDINARY_SECRET_KEY // api secret
    })
}

export default connectCloudinary;
