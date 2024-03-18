import { Attachment, User, Media } from "./lib/db/schema";

export type PostWithData = Media & { type: "post" } & {
  likesCount: number;
  commentsCount: number;
} & { isLikedByMe: boolean } & { user: User } & {
  attachments: Attachment[];
};

export type CommentWithData = Media & { type: "comment" } & {
  likesCount: number;
  repliesCount: number;
} & { isLikedByMe: boolean } & { user: User } & {
  attachments: Attachment[];
};

export type Base64File = {
  url: string | ArrayBuffer | null;
  type: "image" | "video";
  size?: number;
};

export type AttachmentFile = Base64File & {
  error?: boolean;
};
