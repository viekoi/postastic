import { getInfiniteProfileMedias } from "@/actions/get-infinite-profile-medias";
import UserProfile from "@/components/protected/user/user-profile";
import { InfiniteMediasQueryKeyBuilder } from "@/lib/utils";
import { getUserById } from "@/queries/user";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await getUserById(params.id);

  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: InfiniteMediasQueryKeyBuilder({
      parentId: null,
      type: "post",
      route: "profile",
      profileId: params.id,
    }),
    queryFn: ({ pageParam }) => getInfiniteProfileMedias(pageParam),
    initialPageParam: { type: "post" as "post", profileId: params.id },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor
        ? {
            cursor: lastPage.nextCursor,
            type: "post" as "post",
            profileId: params.id,
          }
        : undefined;
    },
    pages: 1, // prefetch the first 1 pages
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfile user={user} />
    </HydrationBoundary>
  );
};

export default page;
