
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

let isCloudinaryConfigured = false;
function ensureCloudinaryConfigured() {
    if (!isCloudinaryConfigured) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        isCloudinaryConfigured = true;
    }
}

const uploadonCloudinary = async (localfilePath) => {
    try {
        ensureCloudinaryConfigured();
        if (!localfilePath) return null;
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: 'auto',
            folder: 'CWC'
        });
        console.log("File uploaded successfully:", response.url);
        fs.unlinkSync(localfilePath); // Delete the local file after upload
        return response;
    } catch (error) {
        if (localfilePath && fs.existsSync(localfilePath)) {
            fs.unlinkSync(localfilePath);
        }
        console.error("Error in uploadonCloudinary:", error);
        return null;
    }
}

export { uploadonCloudinary };

