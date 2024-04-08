import { ProfileImage } from "./lib/db/schema";
import { SessionUser } from "./type";



declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
}
