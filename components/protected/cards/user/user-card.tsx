"use client";
import { UserWithData } from "@/type";
import { Card } from "@/components/ui/card";
import UserAvatar from "../../user/user-avatar";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchModal } from "@/hooks/use-modal-store";
interface UserCard {
  user: UserWithData;
  type: "link" | "card";
}
const UserCard = ({ user, type }: UserCard) => {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const { onClose } = useSearchModal();
  return (
    <>
      {type === "link" ? (
        <Link key={user.id} href={`/profile/${user?.id}`} onClick={onClose}>
          <Button variant={"ghost"} className="h-auto justify-start w-full">
            <div className="flex space-x-2 items-center">
              <UserAvatar user={user} />
              <div className="text-left text-sm">
                <div className="font-semibold">{user?.name}</div>
              </div>
            </div>
          </Button>
        </Link>
      ) : (
        <Card
          className={cn(
            " px-4 py-6 bg-black border-b-[0.5px] border-gray-600 text-black rounded-none "
          )}
        >
          <div className="flex justify-between items-center">
            <div
              onClick={() => router.push(`/profile/${user.id}`)}
              className="flex space-x-2 items-center  hover:cursor-pointer"
            >
              <UserAvatar user={user} />
              <div className="text-left text-sm text-white">
                <div className="font-semibold">{user.name}</div>
                <div className="flex gap-x-2">
                  <div className="font-semibold text-sm text-gray-600">
                    Followers: {user.followerCounts}
                  </div>
                  <div className="font-semibold text-sm text-gray-600">
                    Following: {user.followingCounts}
                  </div>
                </div>
              </div>
            </div>
            {currentUser && currentUser.id !== user.id && (
              <div className="text-white">
                {user.isFollowedByMe ? "following" : "follow"}
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  );
};

export default UserCard;
