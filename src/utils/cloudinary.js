import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });


// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
    try{
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        console.log("File uploaded successfully", response.url)
        return response

    } catch(error) {
        fs.unlinkSync(localFilePath)  // To remove file even if it hasn't been uploaded.
    }
}




const uploadResult = await cloudinary.uploader.upload(
    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
    {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });