"use client";

import TabMenu from "./tab";
import PostContainer from "../containers/post/post-container";
import PostFormCard from "../cards/post-form-card";
import { getInfiniteMedias } from "@/actions/get-infinite-medias";
import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SessionUser } from "@/type";


interface UserProfileTabProps {
  user: SessionUser;
}

const UserProfileTab = ({ user }: UserProfileTabProps) => {
  const { user: currentUser } = useCurrentUser();
  const tabValues = ["post", "bio"];
  const tabContents = [
    <>
      <div className="min-h-screen flex flex-col">
        {user.id === currentUser?.id && <PostFormCard />}
        <PostContainer
          route="profile"
          profileId={user.id}
          queryFn={getInfiniteMedias}
        />
      </div>
    </>,
    <>
      <div className="px-4 min-h-screen">
        {user.bio.length ? user.bio : "This user has not given a bio yet"}
      </div>
    </>,
  ];

  return <TabMenu tabContents={tabContents} tabValues={tabValues} />;
};

export default UserProfileTab;
