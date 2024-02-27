import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { convertFileToUrl } from "./utils";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = async (files: File[]) => {
  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const result = await cloudinary.uploader.upload(convertFileToUrl(file));
      return result; // Return the upload result object
    })
  );

  return uploadedFiles;
};

export const cloudinaryDelete = async (files: UploadApiResponse[]) => {
  const filesToDelete = files.map(async (file) => {
    return await cloudinary.uploader.destroy(file.public_id);
  });

  const deletedFiles = await Promise.all(filesToDelete);

  return deletedFiles;
};
