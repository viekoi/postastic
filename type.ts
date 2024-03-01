import { Like, Post, User,Media } from "./lib/db/schema";

export type PostWithData = Post & { user: User } & { likes: Like[] } &{medias:Media[]};

export type Base64File = {
    base64Url:(string | ArrayBuffer | null),
    type:"image" | "video",
    size:number,
}

