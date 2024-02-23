"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewPasswordSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthFormCard } from "../cards/auth-form-card";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { newPassword } from "@/actions/new-password";
import { Eye, EyeOff } from "lucide-react";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState("password");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const handleShowPassword = () => {
    if (showPassword === "password") {
      setShowPassword("text");
    } else {
      setShowPassword("password");
    }
  };

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const formErrors = form.formState.errors;

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <AuthFormCard
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/login"
      isPending={isPending}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-bold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="w-full relative">
                      <Input
                        variant={
                          formErrors.password ? "destructive" : "outline"
                        }
                        {...field}
                        disabled={isPending}
                        placeholder="password"
                        type={showPassword}
                      />
                      <Button
                        className={"absolute top-0 right-0 h-full"}
                        size={"icon"}
                        type="button"
                        variant={"ghost"}
                        onClick={handleShowPassword}
                      >
                        {showPassword === "password" ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-bold">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="w-full relative">
                      <Input
                        variant={
                          formErrors.confirmPassword ? "destructive" : "outline"
                        }
                        {...field}
                        disabled={isPending}
                        placeholder="confirm password"
                        type={showPassword}
                      />
                      <Button
                        className={"absolute top-0 right-0 h-full"}
                        size={"icon"}
                        type="button"
                        variant={"ghost"}
                        onClick={handleShowPassword}
                      >
                        {showPassword === "password" ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Reset password
          </Button>
        </form>
      </Form>
    </AuthFormCard>
  );
};
