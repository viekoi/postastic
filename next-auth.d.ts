import { User } from "./lib/db/schema";

export type ExtendedUser = User & {
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
