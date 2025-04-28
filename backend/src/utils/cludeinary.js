import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload file to Cloudinary
const uploadOnCloudinary = async (localPath) => {
    try {
        if (!localPath) return null;

        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto", // auto selects between image and video
        });

        console.log("File uploaded to Cloudinary:", response.url);
        fs.unlinkSync(localPath); // delete the local file after uploading
        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        fs.unlinkSync(localPath); // delete the local file on error
        return null;
    }
}

export { uploadOnCloudinary };
