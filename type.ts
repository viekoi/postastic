import { Post, User,Media } from "./lib/db/schema";

export type PostWithData = Post & { user: User } &{medias:Media[]};

export type Base64File = {
    url:(string | ArrayBuffer | null),
    type:"image" | "video",
    size?:number,
}

export type MediaFile  = Base64File & {
    error?:boolean
}

