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
import { NewMediaSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Image } from "lucide-react";
import { toast } from "sonner";
import { MediaTypes, postPrivacyOtptions, videoMaxSize } from "@/constansts";
import { useCommentModal, useNewMediaModal } from "@/hooks/use-modal-store";
import { QueryKey} from "@tanstack/react-query";
import { AttachmentFile} from "@/type";

import { useDropzone } from "react-dropzone";
import { useFilesUploadActions } from "@/hooks/use-files-upload-actions";
import UserAvatar from "@/components/protected/user/user-avatar";
import FileUploader from "@/components/protected/file-uploader";
import { EmojiPicker } from "@/components/protected/emoji-picker";
import { useCreateMedia } from "@/queries/react-query/queris";
import { cn, getPostPrivacyOption } from "@/lib/utils";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";
import { useNewMediaDrafts } from "@/hooks/use-new-media-drafts-store";
import useDebounce from "@/hooks/use-debounce";
import { isEqual } from "lodash";
import { useIsMobile } from "@/providers/is-mobile-provider";
import { useRouter } from "next/navigation";

interface NewMediaFormProps {
  type: (typeof MediaTypes)[number];
  postId: string | null;
  parentId: string | null;
  currentListQueryKey: QueryKey;
  parentListPreflix?: QueryKey;
  defaultValues?: z.infer<typeof NewMediaSchema>;
}

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

const NewMediaForm = ({
  type,
  postId,
  parentId,
  parentListPreflix,
  currentListQueryKey,
  defaultValues,
}: NewMediaFormProps) => {
  if (type !== "post" && !postId && !parentId) {
    throw new Error(
      "postId and parentId is needed when create a new reply or comment "
    );
  }

  const [files, setFiles] = useState<AttachmentFile[]>(
    defaultValues ? defaultValues.attachments : []
  );
  const [privacyOption, setPrivacyOption] = useState(
    getPostPrivacyOption(defaultValues ? defaultValues.privacyType : "public")
  );
  const router = useRouter();
  const { setDrafts, removeDraft } = useNewMediaDrafts();
  const {
    mutateAsync: createMedia,
    isPending,
    isSuccess,
  } = useCreateMedia({
    type,
    currentListQueryKey,
    parentId,
    parentListPreflix,
  });
  const { onClose } = useNewMediaModal();
  const { onClose: onCommentModalClose } = useCommentModal();
  const { onDrop, onRemoveFiles, onRemoveFile } = useFilesUploadActions(
    files,
    setFiles
  );
  const { onAdd, onCancel,isAddingFiles} = useIsAddingFiles();
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

  const { isMobile } = useIsMobile();
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

  const form = useForm<z.infer<typeof NewMediaSchema>>({
    resolver: zodResolver(NewMediaSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          content: "",
          attachments: files,
          postId,
          parentId,
          type,
          privacyType: privacyOption.value,
        },
  });

  const contentValue = useDebounce(form.watch("content"), 300);
  const attachmentsValue = useDebounce(form.watch("attachments"), 300);
  const privacyTypeValue = useDebounce(form.watch("privacyType"), 300);

  const { user } = useCurrentUser();

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [contentValue]);

  useEffect(() => {
    if (attachmentsValue.length > 0 || contentValue.trim().length) {
      form.formState.errors.isEmpty && form.clearErrors("isEmpty");
    }
  }, [contentValue, attachmentsValue]);

  useEffect(() => {
    const handleSetDraft = () => {
      if (!isSuccess && !isEqual(form.getValues, defaultValues)) {
        setDrafts(form.getValues());
      }
    };
    handleSetDraft();
  }, [contentValue, attachmentsValue, privacyTypeValue]);

  if (!user) return null;

  const onSubmit = async (values: z.infer<typeof NewMediaSchema>) => {
    try {
      await createMedia(values).then((res) => {
        if (res.success && res.data) {
          toast.success(res.success, { closeButton: false });
          form.reset();
          removeDraft(res.data.parentId);
          onClose();
          onRemoveFiles();
        } else if (res.error) {
          toast.error(res.error, { closeButton: false });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={cn(
        "w-full p-4 pb-0 overflow-x-hidden overflow-y-scroll custom-scrollbar",
        type === "comment" &&
          "border-t-[0.5px] border-gray-600  max-h-[40%]  bg-black"
      )}
    >
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
                      <UserAvatar
                        onClick={() => {
                          router.push(`/profile/${user.id}`);
                          onClose();
                          onCommentModalClose();
                        }}
                        user={user}
                      />
                      <Textarea
                        disabled={isPending}
                        className="border-none overflow-hidden flex-grow resize-none"
                        {...field}
                        value={field.value}
                        ref={inputRef}
                        placeholder={`Write ${type} here`}
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
                      className={cn("", type !== "post" && "max-w-[300px]")}
                      isCommentFormChild={type !== "post" ? true : false}
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
                disabled={isPending || isAddingFiles}
                type="button"
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  type === "post" ? onAdd() : open();
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
              {type}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewMediaForm;
