"use server";

import db from "@/lib/db";
import {
  Media,
  medias as mediaTable,
  attachments as attachmentTable,
} from "@/lib/db/schema";
import { cloudinaryDelete, cloudinaryUpload } from "@/lib/upload";
import { currentUser } from "@/lib/user";
import { NewMediaShcema } from "@/schemas";
import * as z from "zod";

export const newMedia = async (values: z.infer<typeof NewMediaShcema>) => {
  try {
    const validatedFields = NewMediaShcema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!!!!" };
    }
    const { content, attachments, privacyType, postId, parentId, type } =
      validatedFields.data;

    const user = await currentUser();

    if (!user) return { error: "Email does not exist!" };

    if (type === "reply" && !postId && !parentId) {
      return {
        error: "postId and parentId is need for creating a comment ",
      };
    }

    if (type === "reply" && !postId && !parentId) {
      return {
        error: "postId and parentId is need for creating a reply",
      };
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
        },
      };
    }
  } catch (error) {
    console.log(error);
    return { error: "Coud not create media" };
  }
};
