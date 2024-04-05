import { ProfileImage, User } from "./lib/db/schema";

export type ExtendedUser = Omit<User,"image" |"password"> & {
  isOAuth: boolean;
  coverImage: ProfileImage | null;
  avatarImage: ProfileImage | null;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
