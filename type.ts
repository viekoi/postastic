import { Attachment, User, Media, ProfileImage } from "./lib/db/schema";

export type MediaWithData = Media & {
  likesCount: number;
  interactsCount: number;
} & { isLikedByMe: boolean } & { user: SessionUser } & {
  attachments: Attachment[];
};

export type UploadFile = {
  url: string | ArrayBuffer | null;
  type: "image" | "video";
  publicId?: string;
  size?: number;
  error?: boolean;
};

export type UserWithData = Omit<User, "image"> & {
  coverImage: ProfileImage | null;
  avatarImage: ProfileImage | null;
  followerCounts: number;
  followingCounts: number;
  isFollowedByMe: boolean;
};

export type SessionUser = Omit<User, "image"> & {
  isOAuth: boolean;
  coverImage: ProfileImage | null;
  avatarImage: ProfileImage | null;
};
