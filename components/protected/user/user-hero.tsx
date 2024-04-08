"use client";
import Image from "next/image";
import UserAvatar from "./user-avatar";
import { SessionUser, UserWithData } from "@/type";


interface UserHeroProps {
  user: UserWithData;
}

const UserHero = ({ user }: UserHeroProps) => {
  return (
    <div>
      <div className="bg-neutral-700 h-44  relative ">
        {user.coverImage && (
          <Image
            src={user.coverImage.url}
            priority
            quality={100}
            fill
            alt="Cover Image"
            className="bg-cover bg-no-repeat bg-center object-cover"
          />
        )}
        <div className="absolute -bottom-16 left-4">
          <UserAvatar className="h-32 w-32" user={user} />
        </div>
      </div>
    </div>
  );
};

export default UserHero;
