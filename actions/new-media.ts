"use server";

import db from "@/lib/db";
import {
  Media,
  medias as mediaTable,
  attachments as attachmentTable,
} from "@/lib/db/schema";
import { cloudinaryDelete, cloudinaryUpload } from "@/lib/upload";
import { currentUser } from "@/lib/user";
import { NewMediaSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import * as z from "zod";

export const newMedia = async (values: z.infer<typeof NewMediaSchema>) => {
  try {
    const validatedFields = NewMediaSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!!!!" };
    }
    const { content, attachments, privacyType, postId, parentId, type } =
      validatedFields.data;

    const user = await currentUser();

    if (!user) return { error: "Email does not exist!" };

    if (type !== "post" && !postId && !parentId) {
      return {
        error: "postId and parentId is need for creating a comment ",
      };
    }

    if (parentId) {
      const existingParentMedia = await db.query.medias.findFirst({
        where: (m) => eq(m.id, parentId),
      });

      if (!existingParentMedia) {
        return {
          error:
            "something went wrong, the media that you are interact with may not exist or had been deleted!!!",
        };
      }
    }
    if (attachments.length === 0 && !content.trim().length)
      return { error: "Your media is empty" };

    const isOverFlowContent = content.length > 300;

    if (attachments.length === 0 && content.length) {
      const newMedia = await db
        .insert(mediaTable)
        .values({
          content,
          userId: user.id,
          isOverFlowContent,
          privacyType,
          type: type,
          parentId,
          postId,
        })
        .returning();
      return {
        success: "Media created!",
        data: {
          ...newMedia[0],
          attachments: [],
          user: user,
        },
      };
    } else {
      const uploadedFiles = await cloudinaryUpload(attachments);

      const newMedia = await db
        .insert(mediaTable)
        .values({
          content,
          userId: user.id,
          isOverFlowContent,
          privacyType,
          type: type,
          parentId,
          postId,
        })
        .returning();

      if (!newMedia) {
        const deletedFiles = await cloudinaryDelete(uploadedFiles);
        return { error: "Could not create media" };
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
          parentId: newMedia[0].id,
          publicId: file.public_id,
        };
      });
      const newAttachments = await db
        .insert(attachmentTable)
        .values(formatedUploadedFiles)
        .returning();
      return {
        success: "Media created!",
        data: {
          ...newMedia[0],
          attachments: newAttachments,
          user: user,
        },
      };
    }
  } catch (error) {
    console.log(error);
    return { error: "Coud not create media" };
  }
};
