import { Post, User, Media, Comment } from "./lib/db/schema";

export type PostWithData = Post & {likesCount:number,commentsCount:number}&{ isLikedByMe: boolean } & { user: User } & {
  medias: Media[];
}

export type CommentWithData = Comment & {likesCount:number,repliesCount:number} & { isLikedByMe: boolean } & { user: User } & {
  medias: Media[];
}

export type Base64File = {
  url: string | ArrayBuffer | null;
  type: "image" | "video";
  size?: number;
};

export type MediaFile = Base64File & {
  error?: boolean;
};
