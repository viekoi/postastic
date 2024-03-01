import { isTooLarge } from "@/lib/utils";
import { Base64File } from "@/type";
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

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
  confirmPassword: z.string().min(6, {
    message: "Invalid confirm password",
  }),
});

function refineFiles(files: Base64File[]): boolean {
  return files.every((file: Base64File) => !isTooLarge(file, file.type));
}

export const NewPostShcema = z.object({
  content: z.string().max(2200, { message: "Exceeded the maximum character" }),
  medias: z
    .array(z.custom<Base64File>())
    .max(5, { message: "Maximum of 5 media allowed" })
    .refine((data) => refineFiles(data), {
      message:
        "Images must be smaller than 8mb, videos must be smaller than 20mb",
    }),
  privacyType: z.enum(["private", "public", "more"]),
});
