import { Like, Post, User } from "./lib/db/schema";

export type PostWithData = Post & { user: User } & { likes: Like[] };


