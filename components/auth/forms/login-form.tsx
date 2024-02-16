"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schema";
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
import { Eye, EyeOff } from "lucide-react";
import { useState, useTransition } from "react";
import { login } from "@/actions/login";
import Link from "next/link";

export const LoginForm = () => {
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

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formErrors = form.formState.errors;

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then((data) => {
        setError(data?.error);
        // TODO: Add when we add 2FA
        setSuccess(data?.success);
      });
    });
  };

  return (
    <AuthFormCard
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
      showSocial
      showForgot
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-bold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      variant={formErrors.email ? "destructive" : "outline"}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </AuthFormCard>
  );
};
