"use client";

import TabMenu from "./tab";
import PostContainer from "../containers/post/post-container";
import PostFormCard from "../cards/post-form-card";
import { getInfiniteMedias } from "@/actions/get-infinite-medias";
import { InfiniteMediasQueryKeyBuilder } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ExtendedUser } from "@/next-auth";

interface UserProfileTabProps {
  user: ExtendedUser;
}

const UserProfileTab = ({ user }: UserProfileTabProps) => {
  const { user: currentUser } = useCurrentUser();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab");
  const tabValues = ["post", "bio"];
  const tabContents = [
    <>
      {user.id === currentUser?.id && <PostFormCard />}
      <PostContainer
        route="profile"
        profileId={user.id}
        queryFn={getInfiniteMedias}
        queryKey={InfiniteMediasQueryKeyBuilder({
          parentId: null,
          type: "post",
          route: "profile",
          profileId: user.id,
        })}
      />
    </>,
    <>
      <div className="px-4">
        {user.bio.length ? user.bio : "This user has not given a bio yet"}
      </div>
      ,
    </>,
  ];

  return (
    <TabMenu
      tabContents={tabContents}
      tabValues={tabValues}
      defaultValue={defaultTab ? defaultTab : tabValues[0]}
    />
  );
};

export default UserProfileTab;
