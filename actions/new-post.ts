"use server";

import db from "@/lib/db";
import { posts, medias as dbMedias, Post } from "@/lib/db/schema";
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
    const { content, medias, privacyType } = validatedFields.data;

    const user = await currentUser();

    if (!user) return { error: "Email does not exist!" };

    if (medias.length === 0 && !content.trim().length)
      return { error: "Your post is empty" };

    const isOverFlowContent = content.length > 300;

    if (medias.length === 0 && content.length) {
      const newPost = await db
        .insert(posts)
        .values({
          content,
          userId: user.id,
          isOverFlowContent,
          privacyType,
        })
        .returning();
      return { success: "Post created!", data: { ...newPost[0], medias: [] } };
    } else {
      const uploadedFiles = await cloudinaryUpload(medias);

      const newPost: Post[] = await db
        .insert(posts)
        .values({
          content,
          userId: user.id,
          isOverFlowContent,
          privacyType,
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
          publicId: file.public_id,
          type: file.resource_type as "image" | "video",
          parentId: newPost[0].id,
        };
      });

      const newMedias = await db
        .insert(dbMedias)
        .values(formatedUploadedFiles)
        .returning();
      return {
        success: "Post created!",
        data: { ...newPost[0], medias: newMedias },
      };
    }
  } catch (error) {
    console.log(error);
    return { error: "Coud not create post" };
  }
};
