"use server";

import db from "@/lib/db";
import { posts, medias as dbMedias } from "@/lib/db/schema";
import { cloudinaryDelete, cloudinaryUpload } from "@/lib/upload";
import { currentUser } from "@/lib/user";
import { NewPostShcema } from "@/schemas";
import * as z from "zod";
import { revalidatePath } from "next/cache";

export const newPost = async (values: z.infer<typeof NewPostShcema>) => {
  try {
    const validatedFields = NewPostShcema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!!!!" };
    }
    const { content, medias, privacyType } = validatedFields.data;

    const user = await currentUser();

    if (!user) return { error: "Email does not exist!" };

    if (medias.length === 0 && !content.length)
      return { error: "Your post is empty" };

    const isOverFlowContent = content.length > 300;

    if (medias.length === 0 && content.length) {
      await db.insert(posts).values({
        content,
        userId: user.id,
        isOverFlowContent,
        privacyType,
        isReply: false,
      });
    } else {
      const uploadedFiles = await cloudinaryUpload(medias);

      const newPost = await db
        .insert(posts)
        .values({
          content,
          userId: user.id,
          isOverFlowContent,
          privacyType,
          isReply: false,
        })
        .returning();

      if (!newPost) {
        const deletedFiles = await cloudinaryDelete(uploadedFiles);
        return { error: "Coud not create post" };
      }

      const formatedUploadedFiles: {
        url: string;
        type: "image" | "video";
        postId: string;
        publicId: string;
      }[] = uploadedFiles.map((file) => {
        return {
          url: file.secure_url,
          publicId: file.public_id,
          type: file.resource_type as "image" | "video",
          postId: newPost[0].id,
        };
      });

      await db.insert(dbMedias).values(formatedUploadedFiles);
    }

    revalidatePath("/");
    return { success: "Post created!" };
  } catch (error) {
    console.log(error);
    return { error: "Coud not create post" };
  }
};
