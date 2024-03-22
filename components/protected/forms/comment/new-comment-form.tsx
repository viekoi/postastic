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
import { NewCommentShcema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "../../user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Image } from "lucide-react";
import { toast } from "sonner";
import { postPrivacyOtptions, videoMaxSize } from "@/constansts";
import { useNewPostModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "../../emoji-picker";
import useIsMobile from "@/hooks/use-is-mobile";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/queries/react-query/query-keys";
import { AttachmentFile, MediaWithData } from "@/type";
import { newComment } from "@/actions/new-comment";
import {
  optimisticInsert,
  updateInteractCount,
} from "@/queries/react-query/optimistic-functions";
import { useDropzone } from "react-dropzone";
import { useFilesUploadActions } from "@/hooks/use-files-upload-actions";
import FileUploader from "../../file-uploader";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

const NewCommentForm = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<AttachmentFile[]>([]);
  const { onClose } = useNewPostModal();
  const { onDrop, onRemoveFiles, onRemoveFile } = useFilesUploadActions(
    files,
    setFiles
  );
  const { getInputProps, getRootProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4", ".MP4"],
    },
    onDropRejected: () => {
      form.setError("attachments", { message: "Maximum 5 files" });
    },
    maxSize: videoMaxSize,
    maxFiles: 5,
  });
  const [privacyOption, setPrivacyOption] = useState(postPrivacyOtptions[0]);
  const [isPending, startTransition] = useTransition();
  const isMobile = useIsMobile(1024);
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  const baseContainerClassName = "border border-gray-600 ";
  const indexContainerClassName = (index: number, dataLength: number) => {
    var className = "";
    if (dataLength % 2 === 0) {
      className = "grow-0 basis-[50%] max-w-[50%] ";
    }
    if (dataLength === 1) {
      className = "grow-0 basis-[100%] max-w-[100%] ";
    }

    if (dataLength === 3) {
      className = "grow-0 basis-[33%] max-w-[33%] ";
    }

    if (dataLength === 5) {
      if (index <= 2) {
        className = "grow-0 basis-[33%] max-w-[33%] ";
      } else {
        className = "grow-0 basis-[50%] max-w-[50%] ";
      }
    }
    return className;
  };
  const baseMediaClassName = "max-h-[100%]  !static ";

  const form = useForm<z.infer<typeof NewCommentShcema>>({
    resolver: zodResolver(NewCommentShcema),
    defaultValues: {
      content: "",
      attachments: files,
      postId: postId,
      privacyType: privacyOption.value,
    },
  });

  const contentValue = form.watch("content");
  const attachmentsValue = form.watch("attachments");
  const { user } = useCurrentUser();

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [contentValue]);

  useEffect(() => {
    if (attachmentsValue.length > 0 || contentValue.trim().length) {
      form.formState.errors.isEmpty && form.clearErrors("isEmpty");
    }
  }, [contentValue, attachmentsValue]);

  if (!user) return null;

  const onSubmit = (values: z.infer<typeof NewCommentShcema>) => {
    startTransition(() => {
      newComment(values).then(async (data) => {
        if (data.success && data.data) {
          toast.success(data.success, { closeButton: false });
          form.reset();
          const newCacheComment: MediaWithData = {
            ...data.data,
            isLikedByMe: false,
            likesCount: 0,
            interactsCount: 0,
            user: user,
            type: "comment",
          };
          optimisticInsert({
            queryClient,
            queryKey: [QUERY_KEYS.GET_POST_COMMENTS, postId, "comments"],
            data: newCacheComment,
            orderBy:"asc"
          });
          updateInteractCount({
            queryClient,
            queryKey: [QUERY_KEYS.GET_HOME_POSTS],
            id: postId,
            action:"insert"
          });
          onClose();
          onRemoveFiles();
        } else if (data.error) {
          toast.error(data.error, { closeButton: false });
        }
      });
    });
  };

  return (
    <div className="w-full  max-h-[40%]  overflow-x-hidden overflow-y-auto custom-scrollbar  p-4 pb-0 border-t-[0.5px] border-gray-600  bg-black ">
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
                    <div className="flex">
                      <UserAvatar user={user} />
                      <Textarea
                        disabled={isPending}
                        className="border-none overflow-hidden flex-grow resize-none"
                        {...field}
                        ref={inputRef}
                        placeholder="Leave a comment!"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUploader
                      files={files}
                      onRemoveFiles={onRemoveFiles}
                      onRemoveFile={onRemoveFile}
                      className="max-w-[300px]"
                      isCommentFormChild
                      getInputProps={getInputProps}
                      getRootProps={getRootProps}
                      open={open}
                      baseContainerClassName={baseContainerClassName}
                      baseAttachmentClassName={baseMediaClassName}
                      indexContainerClassName={indexContainerClassName}
                      disabled={isPending}
                      fieldChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.isEmpty && (
              <FormField
                control={form.control}
                name="isEmpty"
                render={() => (
                  <FormItem className=" px-3">
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="inline-flex items-center">
              <Button
                disabled={isPending}
                type="button"
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  open();
                }}
              >
                <Image />
              </Button>
              {!isMobile && (
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <EmojiPicker
                          disabled={isPending}
                          onChange={(emoji: string) =>
                            field.onChange(`${field.value} ${emoji}`)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="privacyType"
                render={({ field }) => (
                  <FormItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={isPending}
                        asChild
                        className="outline-none"
                      >
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
              disabled={isPending}
              type="submit"
              variant={"blue"}
              className="rounded-3xl  px-6 text-sm"
            >
              comment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewCommentForm;
