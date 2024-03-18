"use server";

import db from "@/lib/db";
import {
  Media,
  medias as mediaTable,
  attachments as attachmentTable,
} from "@/lib/db/schema";
import { cloudinaryDelete, cloudinaryUpload } from "@/lib/upload";
import { currentUser } from "@/lib/user";
import { NewPostShcema } from "@/schemas";
import * as z from "zod";

export const newPost = async (values: z.infer<typeof NewPostShcema>) => {
  try {
    const validatedFields = NewPostShcema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!!!!" };
    }
    const { content, attachments, privacyType } = validatedFields.data;

    const user = await currentUser();

    if (!user) return { error: "Email does not exist!" };

    if (attachments.length === 0 && !content.trim().length)
      return { error: "Your post is empty" };

    const isOverFlowContent = content.length > 300;

    if (attachments.length === 0 && content.length) {
      const newPost = await db
        .insert(mediaTable)
        .values({
          content,
          userId: user.id,
          isOverFlowContent,
          privacyType,
          type: "post",
        })
        .returning();
      return {
        success: "Post created!",
        data: { ...newPost[0], attachments: [] },
      };
    } else {
      const uploadedFiles = await cloudinaryUpload(attachments);

      const newPost = await db
        .insert(mediaTable)
        .values({
          content,
          userId: user.id,
          isOverFlowContent,
          privacyType,
          type: "post",
        })
        .returning();

      if (!newPost) {
        const deletedFiles = await cloudinaryDelete(uploadedFiles);
        return { error: "Coud not create post" };
      }

      const formatedUploadedFiles: {
        url: string;
        type: "image" | "video";
        parentId: string;
        publicId: string;
      }[] = uploadedFiles.map((file) => {
        return {
          url: file.secure_url,
          type: file.resource_type as "image" | "video",
          parentId: newPost[0].id,
          publicId: file.public_id,
        };
      });
      const newAttachments = await db
        .insert(attachmentTable)
        .values(formatedUploadedFiles)
        .returning();
      return {
        success: "Post created!",
        data: { ...newPost[0], attachments: newAttachments },
      };
    }
  } catch (error) {
    console.log(error);
    return { error: "Coud not create post" };
  }
};
