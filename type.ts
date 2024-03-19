import { Attachment, User, Media } from "./lib/db/schema";

export type PostWithData = Media & {
  likesCount: number;
  interactsCount: number;
} & { isLikedByMe: boolean } & { user: User } & {
  attachments: Attachment[];
};

export type CommentWithData = Media & {
  postId: string;
  parentId: string;
} & {
  likesCount: number;
  interactsCount: number;
} & { isLikedByMe: boolean } & { user: User } & {
  attachments: Attachment[];
};

export type ReplyWithData = Media & {
  postId: string;
  parentId: string;
} & {
  likesCount: number;
} & { isLikedByMe: boolean } & { user: User } & {
  attachments: Attachment[];
};

export type AttachmentFile = {
  url: string | ArrayBuffer | null;
  type: "image" | "video";
  publicId?:string,
  size?: number;
  error?: boolean;
};
