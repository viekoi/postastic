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

export const NewPostShcema = z.object({
  content: z.string().max(2200, { message: "Exceeded the maximum character" }),
  medias: z.custom<File[]>().refine(()=>length <= 5,{message:"You can only upload 5 files!!!"}),
  isReply: z.boolean(),
  privacyType: z.enum(["private", "public", "more"]),
});
