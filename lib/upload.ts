import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { Base64File } from "@/type";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = async (files: Base64File[]) => {
  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const result = cloudinary.uploader.upload(file.base64Url as string, {
        resource_type: file.type,
        folder: "postatic",
      });
      return result; // Return the upload result object
    })
  );

  return uploadedFiles;
};

export const cloudinaryDelete = async (files: UploadApiResponse[]) => {
  const filesToDelete = files.map(async (file) => {
    return cloudinary.uploader.destroy(file.public_id, {
      resource_type: file.resource_type,
    });
  });

  const deletedFiles = await Promise.all(filesToDelete);

  return deletedFiles;
};
