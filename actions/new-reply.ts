"use server";

import db from "@/lib/db";
import {
  Media,
  medias as mediaTable,
  attachments as attachmentTable,
} from "@/lib/db/schema";
import { cloudinaryDelete, cloudinaryUpload } from "@/lib/upload";
import { currentUser } from "@/lib/user";
import { NewReplyShcema } from "@/schemas";
import * as z from "zod";

export const newReply = async (values: z.infer<typeof NewReplyShcema>) => {
  try {
    const validatedFields = NewReplyShcema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!!!!" };
    }
    const { content, attachments, privacyType, postId, parentId } =
      validatedFields.data;

    const user = await currentUser();

    if (!user) return { error: "Email does not exist!" };

    if (attachments.length === 0 && !content.trim().length)
      return { error: "Your reply is empty" };

    const isOverFlowContent = content.length > 300;

    if (attachments.length === 0 && content.length) {
      const newReply = await db
        .insert(mediaTable)
        .values({
          content,
          userId: user.id,
          isOverFlowContent,
          privacyType,
          type: "reply",
          parentId,
          postId,
        })
        .returning();
      return {
        success: "reply created!",
        data: {
          ...newReply[0],
          postId: newReply[0].postId as string,
          parentId: newReply[0].parentId as string,
          attachments: [],
        },
      };
    } else {
      const uploadedFiles = await cloudinaryUpload(attachments);

      const newReply = await db
        .insert(mediaTable)
        .values({
          content,
          userId: user.id,
          isOverFlowContent,
          privacyType,
          type: "reply",
          parentId,
          postId,
        })
        .returning();

      if (!newReply) {
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
          parentId: newReply[0].id,
          publicId: file.public_id,
        };
      });
      const newAttachments = await db
        .insert(attachmentTable)
        .values(formatedUploadedFiles)
        .returning();
      return {
        success: "Reply created!",
        data: {
          ...newReply[0],
          postId: newReply[0].postId as string,
          parentId: newReply[0].parentId as string,
          attachments: newAttachments,
        },
      };
    }
  } catch (error) {
    console.log(error);
    return { error: "Coud not create reply" };
  }
};
