"use client";

import { newEmail } from "@/actions/new-email";
import { FormError } from "@/components/form-error";
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
import { ResetSchema } from "@/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ConfirmCodeForm from "./confirm-code-form";
import { SessionUser } from "@/type";

interface NewEmailFormProps {
  user: SessionUser;
}

const NewEmailForm = ({ user }: NewEmailFormProps) => {
  const isConfirmResetEmailTokenTimerMessage = localStorage.getItem(
    "isConfirmResetEmailTokenTimerMessage"
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [isTimerRun, setIsTimerRun] = useState(
    isConfirmResetEmailTokenTimerMessage ? true : false
  );

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: user.email,
    },
  });

  const onBack = () => {
    localStorage.removeItem("isConfirmResetEmailTokenTimerMessage");
    setIsTimerRun(false);
  };

  const formErrors = form.formState.errors;

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    startTransition(() => {
      newEmail(values).then((data) => {
        if (data.success) {
          localStorage.setItem(
            "isConfirmResetEmailTokenTimerMessage",
            `${data.success}`
          );
          setIsTimerRun(true);
        }
        if (data.error) {
          setError(data.error);
        }
      });
    });
  };

  return (
    <div className="px-4">
      {user.isOAuth ? (
        <div className="text-muted-foreground font-bold">
          This is an OAuth account, action is not allowed{" "}
        </div>
      ) : (
        <>
          {!isTimerRun && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                            className="text-black"
                            variant={
                              formErrors.email ? "destructive" : "outline"
                            }
                            {...field}
                            placeholder="confirm password"
                            type={"email"}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormError message={error} />

                <div className="flex justify-end">
                  <Button
                    variant={"blue"}
                    disabled={
                      isPending || user.email === form.getValues("email").trim()
                    }
                    type="submit"
                  >
                    save change
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {isTimerRun && <ConfirmCodeForm onBack={onBack} />}
        </>
      )}
    </div>
  );
};

export default NewEmailForm;
