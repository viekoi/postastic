"use client";
import { User } from "@/lib/db/schema";
import Image from "next/image";
import UserAvatar from "./user-avatar";

interface UserHeroProps {
  user: User;
}

const UserHero = ({ user }: UserHeroProps) => {
  return (
    <div>
      <div className="bg-neutral-700 h-44 relative">
        {user?.coverImage && (
          <Image
            src={user.coverImage}
            fill
            alt="Cover Image"
            style={{ objectFit: "cover" }}
          />
        )}
        <div className="absolute -bottom-16 left-4">
          <UserAvatar
            className="h-32 w-32"
            user={user}
          />
        </div>
      </div>
    </div>
  );
};

export default UserHero;
