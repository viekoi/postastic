import { ExtendedUser } from "@/next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Loader } from "../Loader";

interface UserAvatarProps {
  user?: ExtendedUser;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={user?.image || ""} />
      <AvatarFallback></AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
