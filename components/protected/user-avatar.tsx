import { ExtendedUser } from "@/next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "@/lib/db/schema";
import { User as UserIcon } from "lucide-react";

interface UserAvatarProps {
  user?: ExtendedUser | User;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={user?.image || ""} />
      <AvatarFallback>
        {" "}
        <UserIcon stroke="black"/>
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
