import {v2 as filer} from 'cloudinary';
import fs from 'fs';// Importing the Cloudinary library and the file system module

cloudinary.config({ 
        cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME',
        api_key: 'process.env.CLOUDINARY_API_KEY', 
        api_secret: 'process.env.COUDINARY_API_SECRET' 
}); // Configuring Cloudinary with environment variables


const uploadonCloudinary = async (localfilePath) => {
    try {
        if (!localfilePath) return null;
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: 'auto', // Automatically determine the resource type
            folder: 'CWC' // Specify the folder in Cloudinary where the file will be uploaded
        });
        //file uploaded successfully
        console.log("File uploaded successfully:", response.url);
        return response;
          
    } catch (error) {
        fs.unlinkSync(localfilePath); // Delete the local file if upload fails
        // Log the error for debugging
        console.error("Error in uploadonCloudinary:", error);
        return null;
    }
}


export default uploadonCloudinary; // Exporting the upload function for use in other parts of the application

