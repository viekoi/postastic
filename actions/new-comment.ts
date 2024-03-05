"use server";

import db from "@/lib/db";
import { medias as dbMedias, comments, Comment } from "@/lib/db/schema";
import { cloudinaryDelete, cloudinaryUpload } from "@/lib/upload";
import { currentUser } from "@/lib/user";
import { NewCommentShcema} from "@/schemas";
import * as z from "zod";

export const newComment = async (values: z.infer<typeof NewCommentShcema>) => {
  try {
    const validatedFields = NewCommentShcema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!!!!" };
    }
    const { content, medias, privacyType,postId } = validatedFields.data;

    const user = await currentUser();

    if (!user) return { error: "Email does not exist!" };

    if (medias.length === 0 && !content.trim().length)
      return { error: "Your comment is empty" };

    const isOverFlowContent = content.length > 300;

    if (medias.length === 0 && content.length) {
      const newComment = await db
        .insert(comments)
        .values({
          content,
          userId: user.id,
          isOverFlowContent,
          privacyType,
          postId
        })
        .returning();
      return { success: "comment created!", data: { ...newComment[0], medias: [] } };
    } else {
      const uploadedFiles = await cloudinaryUpload(medias);

      const newComment: Comment[] = await db
        .insert(comments)
        .values({
          content,
          userId: user.id,
          isOverFlowContent,
          privacyType,
          postId
        })
        .returning();

      if (!newComment) {
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
          parentId: newComment[0].id,
        };
      });

      const newMedias = await db
        .insert(dbMedias)
        .values(formatedUploadedFiles)
        .returning();
      return {
        success: "Comment created!",
        data: { ...newComment[0], medias: newMedias },
      };
    }
  } catch (error) {
    console.log(error);
    return { error: "Coud not create Comment" };
  }
};
