import {v2} from "cloudinary";
import { log } from "console";
import fs from "fs";

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });



const uploadOnCloudinary = async (localfilePath) => {
   try {
          if (!localfilePath) return null;
          //upload file to cloudinary
         const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto",
        });
          //file uploaded successfully 
          console.log("File uploaded successfully ", response.url);
          return response;
   } catch (error) {
         fs .unlinkSync(localfilePath); // Delete the local file if upload fails
         // Log the error for debugging
        console.error("Error uploading file ", error);
        return null;
   }
    }