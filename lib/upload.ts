import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { AttachmentFile } from "@/type";
import { Attachment } from "./db/schema";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = async (files: AttachmentFile[]) => {
  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const result = cloudinary.uploader.upload(file.url as string, {
        resource_type: file.type,
        folder: "postatic",
      });
      return result; // Return the upload result object
    })
  );

  return uploadedFiles;
};

export const cloudinaryDelete = async (files: UploadApiResponse[]) => {
  const filesToDelete = await Promise.all(
    files.map(async (file) => {
      const result = cloudinary.uploader.destroy(file.public_id, {
        resource_type: file.resource_type,
      });

      return result;
    })
  );

  return filesToDelete;
};

export const cloudinaryEditDelete = async (files: Attachment[]) => {
  const filesToDelete = await Promise.all(
    files.map(async (file) => {
      const result = cloudinary.uploader.destroy(file.publicId, {
        resource_type: file.type,
      });

      return result;
    })
  );

  return filesToDelete;
};
