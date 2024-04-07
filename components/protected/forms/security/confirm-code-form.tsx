"use client";

import { resetEmail } from "@/actions/reset-email";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ConfirmCodeSchema } from "@/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ConfirmCodeFormProps{
  onBack:()=>void
}

const ConfirmCodeForm = ({onBack}:ConfirmCodeFormProps) => {
  const isConfirmResetEmailTokenTimerMessage = localStorage.getItem(
    "isConfirmResetEmailTokenTimerMessage"
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>(
    isConfirmResetEmailTokenTimerMessage
      ? isConfirmResetEmailTokenTimerMessage
      : ""
  );

  const form = useForm<z.infer<typeof ConfirmCodeSchema>>({
    resolver: zodResolver(ConfirmCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ConfirmCodeSchema>) => {
    setError(""), setSuccess("");
    startTransition(() => {
      resetEmail(values.code).then((data) => {
        if (data.success) {
          setSuccess(data.success);
          localStorage.removeItem("isConfirmResetEmailTokenTimerMessage");
          signOut();
        }

        if (data.error) {
          setError(data.error);
        }
      });
    });
  };

  return (
    <>
      <FormSuccess message={success} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-bold">
                    Enter confirm code
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />

          <div className="flex justify-end space-x-2">
            <Button variant={"destructive"} onClick={onBack} disabled={isPending} type="submit">
              Cancel
            </Button>
            <Button variant={"blue"} disabled={isPending} type="submit">
              Confirm
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ConfirmCodeForm;
