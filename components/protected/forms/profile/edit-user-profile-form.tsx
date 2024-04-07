"use client";
import React, { useCallback, useRef, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditUserProfileShcema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateUserProfile } from "@/queries/react-query/queris";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUpload from "../../user/profile-image-uploader";
import { FormError } from "@/components/form-error";
import { ExtendedUser } from "@/next-auth";

import { useCurrentUser } from "@/hooks/use-current-user";

import { Textarea } from "@/components/ui/textarea";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

interface EditUserProfileFormProps {
  user: ExtendedUser;
  isEdit: boolean;
  setIsEdit: () => void;
}

const EditUserProfileForm = ({
  user,
  isEdit,
  setIsEdit,
}: EditUserProfileFormProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);
  const [error, setError] = useState("");
  const router = useRouter();
  const { update } = useCurrentUser();
  const form = useForm<z.infer<typeof EditUserProfileShcema>>({
    resolver: zodResolver(EditUserProfileShcema),
    defaultValues: {
      ...user,
    },
  });

  const formErrors = form.formState.errors;

  const { mutateAsync: updateProfile, isPending } = useUpdateUserProfile();

  const onSubmit = async (values: z.infer<typeof EditUserProfileShcema>) => {
    try {
      await updateProfile(values).then((res) => {
        if (res.success) {
          toast.success(res.success, { closeButton: false });
          setIsEdit();
          update();
        }
        if (res.error) {
          setError(res.error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-bold">
                    Cover Image
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      type="coverImage"
                      disabled={isPending || !isEdit}
                      fieldChange={(value) => field.onChange(value)}
                      label="Cover Image"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatarImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-bold">
                    Image
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      type="image"
                      disabled={isPending || !isEdit}
                      fieldChange={(value) => field.onChange(value)}
                      label="Image"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-bold">
                    User Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-black"
                      variant={formErrors.name ? "destructive" : "outline"}
                      value={field.value}
                      placeholder="Enter a name"
                      disabled={isPending || !isEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-bold">
                    User Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      variant={formErrors.bio ? "destructive" : "outline"}
                      disabled={isPending || !isEdit}
                      className="border-none overflow-hidden flex-grow resize-none bg-white text-black"
                      {...field}
                      value={field.value}
                      ref={inputRef}
                      placeholder={`Write something here`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <div className="flex justify-end">
            {isEdit ? (
              <div className="flex gap-x-2">
                <Button
                  variant={"destructive"}
                  disabled={isPending}
                  onClick={setIsEdit}
                  type="button"
                >
                  cancel
                </Button>
                <Button variant={"blue"} disabled={isPending} type="submit">
                  save
                </Button>
              </div>
            ) : (
              <Button
                variant={"default"}
                onClick={setIsEdit}
                disabled={isPending}
                type="button"
              >
                edit
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditUserProfileForm;
