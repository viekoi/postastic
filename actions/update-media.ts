"use server";

import db from "@/lib/db";
import {
  medias as mediaTable,
  attachments as attachmentTable,
} from "@/lib/db/schema";
import { cloudinaryUpload } from "@/lib/upload";
import { currentUser } from "@/lib/user";
import { EditMediaShcema } from "@/schemas";
import { desc, eq } from "drizzle-orm";
import * as z from "zod";

export const updateMedia = async (
  values: z.infer<typeof EditMediaShcema>,
  id: string
) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!" };

  try {
    const validatedFields = EditMediaShcema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!!!!" };
    }
    const { content, attachments, privacyType } = validatedFields.data;

    if (attachments.length === 0 && !content.trim().length)
      return { error: "Your media is empty" };

    const isOverFlowContent = content.length > 300;

    if (attachments.length === 0 && content.length) {
      const updatedMedia = await db
        .update(mediaTable)
        .set({
          content,
          isOverFlowContent,
          privacyType,
        })
        .where(eq(mediaTable.id, id))
        .returning();

      await db
        .update(attachmentTable)
        .set({ parentId: null })
        .where(eq(attachmentTable.parentId, id));

      return {
        success: "media updated!",
        data: {
          ...updatedMedia[0],
          attachments: [],
        },
      };
    } else {
      const updatedMedia = await db
        .update(mediaTable)
        .set({
          content,
          isOverFlowContent,
          privacyType,
        })
        .where(eq(mediaTable.id, id))
        .returning();

      const currentAttachments = await db.query.attachments.findMany({
        where: (a) => eq(a.parentId, id),
      });

      const removedAttachments = currentAttachments.filter(
        (a) => !attachments.find((na) => na.publicId === a.publicId)
      );

      const addedAttachments = attachments.filter(
        (a) => a.publicId === undefined
      );

      if (removedAttachments.length) {
        await db
          .update(attachmentTable)
          .set({ parentId: null })
          .where(eq(attachmentTable.parentId, id));
      }

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

      const updatedAtachments = await db.query.attachments.findMany({
        where: (a) => eq(a.parentId, id),
        orderBy: (a) => desc(a.createdAt),
      });

      return {
        success: "Post updated!",
        data: {
          ...updatedMedia[0],
          attachments: updatedAtachments,
        },
      };
    }
  } catch (error) {
    console.log(error);
    return { error: "Coud not update post" };
  }
};
