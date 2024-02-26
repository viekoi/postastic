"use client";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewPostShcema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import {
  startTransition,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "../user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { newPost } from "@/actions/new-post";
import { Image, Laugh } from "lucide-react";
import { toast } from "sonner";
import { postPrivacyOtptions } from "@/constansts";
import FileUploader from "../file-uploader";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

const NewPostForm = () => {
  const [privacyOption, setPrivacyOption] = useState(postPrivacyOtptions[0]);
  const { onAdd, onCancel, isAddingFiles } = useIsAddingFiles();

  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  const { user, isLoading } = useCurrentUser();

  const form = useForm<z.infer<typeof NewPostShcema>>({
    resolver: zodResolver(NewPostShcema),
    defaultValues: {
      content: "",
      isReply: false,
      medias: [],
      privacyType: privacyOption.value,
    },
  });

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [form.watch("content")]);

  const onSubmit = (values: z.infer<typeof NewPostShcema>) => {
    startTransition(() => {
      newPost(values).then((data) => {
        if (data.success) {
          toast.success(data.success);
          form.reset();
        } else if (data.error) {
          toast.error(data.error);
        }
      });
    });
  };

  return (
    <div className="flex w-full  p-4 pb-0 ">
      <UserAvatar user={user} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-grow flex-col"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="border-none overflow-hidden flex-grow resize-none"
                      {...field}
                      ref={inputRef}
                      placeholder="What's happening?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isAddingFiles && (
              <FormField
                control={form.control}
                name="medias"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUploader fieldChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="inline-flex items-center">
              <Button
                disabled={isAddingFiles}
                type="button"
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  onAdd();
                }}
              >
                <Image />
              </Button>

              <Button type="button" variant={"ghost"} size={"icon"}>
                <Laugh />
              </Button>

              <FormField
                control={form.control}
                name="privacyType"
                render={({ field }) => (
                  <FormItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="outline-none">
                        <Button type="button" variant={"ghost"} size={"icon"}>
                          <privacyOption.icon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56 "
                        onClick={(e) => e.stopPropagation()}
                      >
                        {postPrivacyOtptions.map((opt, index) => {
                          return (
                            <DropdownMenuItem
                              key={index}
                              onClick={() => {
                                field.onChange(opt.value);
                                setPrivacyOption(opt);
                              }}
                            >
                              {opt.label}
                              <DropdownMenuShortcut
                                className={`inline-flex gap-1 relative ${
                                  opt.value === privacyOption.value &&
                                  "side-link-active"
                                }`}
                              >
                                <opt.icon />
                              </DropdownMenuShortcut>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              variant={"blue"}
              className="rounded-3xl  px-6 text-sm"
            >
              Post
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewPostForm;
