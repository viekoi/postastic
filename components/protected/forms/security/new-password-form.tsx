"use client";

import { newPassword } from "@/actions/new-password";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ExtendedUser } from "@/next-auth";
import { ResetPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface NewPasswordFormProps {
  user: ExtendedUser;
}

const NewPasswordForm = ({ user }: NewPasswordFormProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState("password");
  const [showNewPassword, setShowNewPassword] = useState("password");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState("password");

  const handleShowCurrentPassword = () => {
    if (showCurrentPassword === "password") {
      setShowCurrentPassword("text");
    } else {
      setShowCurrentPassword("password");
    }
  };

  const handleShowNewPassword = () => {
    if (showNewPassword === "password") {
      setShowNewPassword("text");
    } else {
      setShowNewPassword("password");
    }
  };

  const handleShowConfirmNewPassword = () => {
    if (showConfirmNewPassword === "password") {
      setShowConfirmNewPassword("text");
    } else {
      setShowConfirmNewPassword("password");
    }
  };

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      currentPassword: user.isOAuth && !user.password ? undefined : "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const formErrors = form.formState.errors;

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      newPassword(values).then((data) => {
        if (data.success) {
          setSuccess(data.success);
          signOut();
        }

        if (data.error) {
          setError(data.error);
        }
      });
    });
  };

  return (
    <div className="px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {user.password && (
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground font-bold">
                      Current password
                    </FormLabel>
                    <FormControl>
                      <div className="w-full relative">
                        <Input
                          className="text-black"
                          variant={
                            formErrors.currentPassword
                              ? "destructive"
                              : "outline"
                          }
                          {...field}
                          placeholder="current password"
                          type={showCurrentPassword}
                          disabled={isPending}
                        />
                        <Button
                          className={"text-black absolute top-0 right-0 h-full"}
                          size={"icon"}
                          type="button"
                          variant={"ghost"}
                          onClick={handleShowCurrentPassword}
                        >
                          {showCurrentPassword === "password" ? (
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
            )}

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-bold">
                    New password
                  </FormLabel>
                  <FormControl>
                    <div className="w-full relative">
                      <Input
                        className="text-black"
                        variant={
                          formErrors.newPassword ? "destructive" : "outline"
                        }
                        {...field}
                        placeholder="new password"
                        type={showNewPassword}
                        disabled={isPending}
                      />
                      <Button
                        className={"text-black absolute top-0 right-0 h-full"}
                        size={"icon"}
                        type="button"
                        variant={"ghost"}
                        onClick={handleShowNewPassword}
                      >
                        {showNewPassword === "password" ? (
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
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-bold">
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <div className="w-full relative">
                      <Input
                        className="text-black"
                        variant={
                          formErrors.confirmNewPassword
                            ? "destructive"
                            : "outline"
                        }
                        {...field}
                        placeholder="confirm password"
                        type={showConfirmNewPassword}
                        disabled={isPending}
                      />
                      <Button
                        className={"text-black absolute top-0 right-0 h-full"}
                        size={"icon"}
                        type="button"
                        variant={"ghost"}
                        onClick={handleShowConfirmNewPassword}
                      >
                        {showConfirmNewPassword === "password" ? (
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
          <div className="flex justify-end">
            <Button variant={"blue"} disabled={isPending} type="submit">
              edit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewPasswordForm;
