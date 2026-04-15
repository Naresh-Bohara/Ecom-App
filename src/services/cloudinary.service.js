import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';

dotenv.config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class FileUploadService {
  static async uploadFile(fileBuffer, dir) {
    try {
      // Add this check
      if (!fileBuffer) {
        return null; // No file to upload
      }

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: dir,
            resource_type: "auto",
            unique_filename: true 
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });
    } catch (exception) {
      throw exception;
    }
  }
}

export default FileUploadService;