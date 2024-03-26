import { Attachment, User, Media } from "./lib/db/schema";

export type MediaWithData = Media & {
  likesCount: number;
  interactsCount: number;
} & { isLikedByMe: boolean } & { user: User } & {
  attachments: Attachment[];
};

export type OptimisticUpdateData = Media & {
  likesCount: number;
} & { isLikedByMe: boolean } & { user: User } & {
  attachments: Attachment[];
};

export type AttachmentFile = {
  url: string | ArrayBuffer | null;
  type: "image" | "video";
  publicId?: string;
  size?: number;
  error?: boolean;
};
