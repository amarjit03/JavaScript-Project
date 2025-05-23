import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null;

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        });

        // console.log("File uploaded to Cloudinary:", response.url);
        fs.unlinkSync(localfilepath)
        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error);

        // Remove the locally saved temporary file if it exists
        if (fs.existsSync(localfilepath)) {
            fs.unlinkSync(localfilepath);
        }

        return null;
    }
};

export default uploadCloudinary;
