"use server";

import db from "@/lib/db";
import {
  Media,
  medias as mediaTable,
  attachments as attachmentTable,
} from "@/lib/db/schema";
import {
  cloudinaryDelete,
  cloudinaryEditDelete,
  cloudinaryUpload,
} from "@/lib/upload";
import { currentUser } from "@/lib/user";
import { NewPostShcema } from "@/schemas";
import { eq } from "drizzle-orm";
import * as z from "zod";

export const updatePost = async (
  values: z.infer<typeof NewPostShcema>,
  postId: string
) => {
  const user = await currentUser();

  if (!user) return { error: "Email does not exist!" };

  try {
    const validatedFields = NewPostShcema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!!!!" };
    }
    const { content, attachments, privacyType } = validatedFields.data;

    if (attachments.length === 0 && !content.trim().length)
      return { error: "Your post is empty" };

    const isOverFlowContent = content.length > 300;

    if (attachments.length === 0 && content.length) {
      const updatedPost = await db
        .update(mediaTable)
        .set({
          content,
          isOverFlowContent,
          privacyType,
          type: "post",
        })
        .returning();

      const currentAttachments = await db.query.attachments.findMany({
        where: (a) => eq(a.parentId, postId),
      });

      await cloudinaryEditDelete(currentAttachments);
      await db
        .update(attachmentTable)
        .set({ parentId: null })
        .where(eq(attachmentTable.parentId, postId));

      return {
        success: "Post updated!",
        data: { ...updatedPost[0], attachments: [] },
      };
    } else {
      const currentAttachments = await db.query.attachments.findMany({
        where: (a) => eq(a.parentId, postId),
      });

      const addedAttachments = attachments.filter(
        (a) => a.publicId === undefined
      );

      const removedAttachments = currentAttachments.filter(
        (a) => !attachments.find((na) => na.publicId === a.publicId)
      );

      const keepedAttachments = currentAttachments.filter((a) =>
        attachments.find((na) => na.publicId === a.publicId)
      );

      await cloudinaryEditDelete(removedAttachments);
      const uploadedFiles = await cloudinaryUpload(addedAttachments);

      const updatedPost = await db
        .update(mediaTable)
        .set({
          content,
          isOverFlowContent,
          privacyType,
          type: "post",
        })
        .returning();

      if (!updatedPost) {
        await cloudinaryDelete(uploadedFiles);
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
          parentId: postId,
          publicId: file.public_id,
        };
      });
      const newAttachments = await db
        .insert(attachmentTable)
        .values(formatedUploadedFiles)
        .returning();
      return {
        success: "Post updated!",
        data: {
          ...updatedPost[0],
          attachments: [...keepedAttachments, ...newAttachments],
        },
      };
    }
  } catch (error) {
    console.log(error);
    return { error: "Coud not update post" };
  }
};
