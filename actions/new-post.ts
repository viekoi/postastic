"use server";

import { privacyTypeValue } from "@/constansts";
import db from "@/lib/db";
import { posts, medias as dbMedias } from "@/lib/db/schema";
import { cloudinaryDelete, cloudinaryUpload } from "@/lib/upload";
import { currentUser } from "@/lib/user";
import { getMediaType } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const newPost = async (data: FormData) => {
  try {
    const content = data.get("content") as string;
    const jsonMedias = data.get("medias") as string;
    const privacyType = data.get("privacyType") as
      | privacyTypeValue.PRIVATE
      | privacyTypeValue.PUBLIC;

    if (content === null && jsonMedias === null && privacyType === null) {
      return { error: "Coud not create post" };
    }
    const medias = JSON.parse(jsonMedias) as File[];

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
      }[] = uploadedFiles.map((file) => {
        return {
          url: file.url,
          type: getMediaType(file.type),
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
