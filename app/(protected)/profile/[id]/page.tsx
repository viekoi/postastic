import { getInfiniteMedias } from "@/actions/get-infinite-medias";
import { getUserByIdAction } from "@/actions/get-user-by-id";
import UserProfile from "@/components/protected/user/user-profile";
import { InfiniteMediasQueryKeyBuilder } from "@/lib/utils";
import { QUERY_KEYS_PREFLIX } from "@/queries/react-query/query-keys";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

const page = async ({ params }: { params: { id: string } }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS_PREFLIX.GET_USER, { userId: params.id }],
    queryFn: () => getUserByIdAction(params.id),
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: InfiniteMediasQueryKeyBuilder({
      parentId: null,
      type: "post",
      route: "profile",
      profileId: params.id,
    }),
    queryFn: ({ pageParam }) => getInfiniteMedias(pageParam),
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
      <UserProfile id={params.id} />
    </HydrationBoundary>
  );
};

export default page;
