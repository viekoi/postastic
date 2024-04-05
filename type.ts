import { profile } from "console";
import { Attachment, User, Media } from "./lib/db/schema";
import { ExtendedUser } from "./next-auth";

export type MediaWithData = Media & {
  likesCount: number;
  interactsCount: number;
} & { isLikedByMe: boolean } & { user: ExtendedUser } & {
  attachments: Attachment[];
};

export type UploadFile = {
  url: string | ArrayBuffer | null;
  type: "image" | "video" ;
  publicId?: string;
  size?: number;
  error?: boolean;
};

