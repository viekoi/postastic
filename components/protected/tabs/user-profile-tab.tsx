"use client";

import TabMenu from "./tab";
import PostContainer from "../containers/post/post-container";
import PostFormCard from "../cards/post-form-card";
import { getInfiniteProfileMedias } from "@/actions/get-infinite-profile-medias";
import { InfiniteMediasQueryKeyBuilder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

const UserProfileTab = () => {
  const { id } = useParams();
  const { user } = useCurrentUser();

  const tabValues = ["post", "bio"];
  const tabContents = [
    <>
      {id === user?.id && <PostFormCard />}
      <PostContainer
        route="profile"
        profileId={id as string}
        queryFn={getInfiniteProfileMedias}
        queryKey={InfiniteMediasQueryKeyBuilder({
          parentId: null,
          type: "post",
          route: "profile",
          profileId: id as string,
        })}
      />
    </>,
    <>bio</>,
  ];
  return <TabMenu tabContents={tabContents} tabValues={tabValues} />;
};

export default UserProfileTab;
