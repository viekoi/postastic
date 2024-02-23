"use server";
import db from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { currentUser } from "@/lib/user";

import { NewPostShcema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const newPost = async (values: z.infer<typeof NewPostShcema>) => {
  try {
    const validatedFields = NewPostShcema.safeParse(values);
    const user = await currentUser();

    if (!user) return { error: "Email does not exist!" };

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    console.log(validatedFields.data);

    const { content, isWithMedia, privacyType, isReply } = validatedFields.data;

    if (!isWithMedia && !content.length) return { error: "Your post is empty" };

    const isOverFlowContent = content.length > 300;

    await db.insert(posts).values({
      content,
      userId: user.id,
      isOverFlowContent,
      privacyType,
      isReply,
    });

    revalidatePath("/");
    return { success: "Post created!" };
  } catch (error) {
    console.log(error);
    return { error: "Coud not create post" };
  }
};
