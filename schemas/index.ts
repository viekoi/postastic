import { isTooLarge } from "@/lib/utils";
import { UploadFile } from "@/type";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  confirmPassword: z.string().min(6, {
    message: "Invalid confirm password",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const ResetPasswordViaEmailSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
  confirmPassword: z.string().min(6, {
    message: "Invalid confirm password",
  }),
});

export const ResetPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, {
        message: "Minimum of 6 characters required",
      })
      .optional(),
    newPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
    confirmNewPassword: z.string().min(6, {
      message: "Invalid confirm password",
    }),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.confirmNewPassword) {
        return false;
      }

      return true;
    },
    {
      message: "Password does not match confirm password!!!",
      path: ["confirmNewPassword"],
    }
  );

function refineFiles(files: UploadFile[]): boolean {
  return files.every((file: UploadFile) => !isTooLarge(file, file.type));
}

export const NewMediaSchema = z
  .object({
    content: z
      .string()
      .max(2200, { message: "Exceeded the maximum character" }),
    attachments: z
      .array(z.custom<UploadFile>())
      .max(5, { message: "Maximum of 5 media allowed" })
      .refine((data) => refineFiles(data), {
        message:
          "Images must be smaller than 8mb, videos must be smaller than 20mb",
      }),
    privacyType: z.enum(["private", "public"]),
    isEmpty: z.any().nullish(),
    postId: z.string().nullable(),
    parentId: z.string().nullable(),
    type: z.enum(["post", "comment", "reply"]),
  })
  .refine(
    (data) => {
      if (!data.content.trim().length && !data.attachments.length) return false;
      return true;
    },
    {
      path: ["isEmpty"],
      params: { empy: "empty" },
      message: `Media is empty!!!`,
    }
  );

export const EditMediaShcema = z
  .object({
    id: z.string(),
    content: z
      .string()
      .max(2200, { message: "Exceeded the maximum character" }),
    attachments: z
      .array(z.custom<UploadFile>())
      .max(5, { message: "Maximum of 5 media allowed" })
      .refine((data) => refineFiles(data), {
        message:
          "Images must be smaller than 8mb, videos must be smaller than 20mb",
      }),
    privacyType: z.enum(["private", "public"]),
    isEmpty: z.any().nullish(),
  })
  .refine(
    (data) => {
      if (!data.content.trim().length && !data.attachments.length) return false;
      return true;
    },
    {
      path: ["isEmpty"],
      params: { empy: "empty" },
      message: "Post is empty!!!",
    }
  );

export const EditUserProfileShcema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "user name can not be empty" }),
  avatarImage: z.custom<UploadFile>().nullable(),
  coverImage: z.custom<UploadFile>().nullable(),
  bio: z.string(),
});
