"use server";
import { unstable_update } from "@/auth";
import db from "@/lib/db";
import { ProfileImage, profileImages, users } from "@/lib/db/schema";
import { cloudinaryEditDelete, cloudinaryUpload } from "@/lib/upload";
import { currentUser } from "@/lib/user";
import { EditUserProfileShcema } from "@/schemas";
import { and, eq } from "drizzle-orm";

import * as z from "zod";
export const updateProfile = async (
  values: z.infer<typeof EditUserProfileShcema>
) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!" };
  try {
    const validatedFields = EditUserProfileShcema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
    const { name, avatarImage, coverImage,bio } = validatedFields.data;
    let newSessionCoverImage: ProfileImage | null = user.avatarImage;
    let newSessionAvatarImage: ProfileImage | null = user.coverImage;
    if (avatarImage && !avatarImage.publicId) {
      const newImage = await cloudinaryUpload([
        { url: avatarImage.url, type: "image" },
      ]);

      const formattedNewImage: {
        profileImageType: "cover" | "image";
        url: string;
        publicId: string;
        userId: string;
        isActive: boolean;
      }[] = newImage.map((file) => {
        return {
          profileImageType: "image" as "cover" | "image",
          url: file.secure_url,
          publicId: file.public_id,
          userId: user.id,
          isActive: true,
        };
      });

      const newInsertAvatarImage = await db
        .insert(profileImages)
        .values(formattedNewImage[0])
        .returning();
      newSessionAvatarImage = newInsertAvatarImage[0];
      if (user.avatarImage && newInsertAvatarImage) {
        await db
          .update(profileImages)
          .set({ isActive: false })
          .where(
            and(
              eq(profileImages.id, user.avatarImage.id),
              eq(profileImages.userId, user.id),
              eq(profileImages.isActive, true)
            )
          );
      }
    }

    if (coverImage && !coverImage.publicId) {
      const newCoverImage = await cloudinaryUpload([
        { url: coverImage.url, type: "image" },
      ]);

      const formattedNewCoverImage: {
        profileImageType: "cover" | "image";
        url: string;
        publicId: string;
        userId: string;
        isActive: boolean;
      }[] = newCoverImage.map((file) => {
        return {
          profileImageType:"cover" as "cover" | "image",
          url: file.secure_url,
          publicId: file.public_id,
          userId: user.id,
          isActive: true,
        };
      });

      const newInserCoverImage = await db
        .insert(profileImages)
        .values(formattedNewCoverImage[0])
        .returning();
      newSessionCoverImage = newInserCoverImage[0];
      if (user.coverImage && newInserCoverImage) {
        await db
          .update(profileImages)
          .set({ isActive: false })
          .where(
            and(
              eq(profileImages.id, user.coverImage.id),
              eq(profileImages.userId, user.id),
              eq(profileImages.isActive, true)
            )
          );
      }
    }

    const updatedUser = await db
      .update(users)
      .set({
        name: name,
        bio:bio
      })
      .where(eq(users.id, user.id))
      .returning();
    updatedUser &&
      (unstable_update({
        user: {
          ...user,
          name: name,
          bio:bio,
          avatarImage: newSessionAvatarImage,
          coverImage: newSessionCoverImage,
        },
      }));

    return { success: "profile updated" };
  } catch (error) {
    console.log(error);
    return { error: "something went wrong!!!!" };
  }
};
