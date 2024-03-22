"use server";

import db from "@/lib/db";
import {
  medias as mediaTable,
  attachments as attachmentTable,
} from "@/lib/db/schema";
import { cloudinaryUpload } from "@/lib/upload";
import { currentUser } from "@/lib/user";
import { NewPostShcema } from "@/schemas";
import { eq } from "drizzle-orm";
import * as z from "zod";

export const updateMedia = async (
  values: z.infer<typeof NewPostShcema>,
  id: string
) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!" };

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
        })
        .where(eq(mediaTable.id, id));

      await db
        .update(attachmentTable)
        .set({ parentId: null })
        .where(eq(attachmentTable.parentId, id));

      return {
        success: "Post updated!",
      };
    } else {
      await db
        .update(mediaTable)
        .set({
          content,
          isOverFlowContent,
          privacyType,
        })
        .where(eq(mediaTable.id, id));

      const currentAttachments = await db.query.attachments.findMany({
        where: (a) => eq(a.parentId, id),
      });

      const removedAttachments = currentAttachments.filter(
        (a) => !attachments.find((na) => na.publicId === a.publicId)
      );

      if (removedAttachments.length) {
        await db
          .update(attachmentTable)
          .set({ parentId: null })
          .where(eq(attachmentTable.parentId, id));
      }

      const addedAttachments = attachments.filter(
        (a) => a.publicId === undefined
      );

      if (addedAttachments.length) {
        const uploadedFiles = await cloudinaryUpload(addedAttachments);

        const formatedUploadedFiles: {
          url: string;
          type: "image" | "video";
          parentId: string;
          publicId: string;
        }[] = uploadedFiles.map((file) => {
          return {
            url: file.secure_url,
            type: file.resource_type as "image" | "video",
            parentId: id,
            publicId: file.public_id,
          };
        });
        await db.insert(attachmentTable).values(formatedUploadedFiles);
      }

      return {
        success: "Post updated!",
      };
    }
  } catch (error) {
    console.log(error);
    return { error: "Coud not update post" };
  }
};
