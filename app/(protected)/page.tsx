import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PostFormCard from "@/components/protected/cards/post-form-card";
import PostContainer from "@/components/protected/containers/post/post-container";
import { getInfiniteMedias } from "@/actions/get-infinite-medias";
import { InfiniteMediasQueryKeyBuilder } from "@/lib/utils";

const Home = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: InfiniteMediasQueryKeyBuilder({
      parentId: null,
      type: "post",
      route: "home",
    }),
    queryFn: ({ pageParam }) => getInfiniteMedias(pageParam),
    initialPageParam: { type:"post" as "post", route:"home" },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor
        ? {
            cursor: lastPage.nextCursor,
            type:"post" as "post",
            route:"home",
          }
        : undefined;
    },
    pages: 1, // prefetch the first 1 pages
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostFormCard />
      <PostContainer
        route={"home"}
        queryFn={getInfiniteMedias}
        queryKey={InfiniteMediasQueryKeyBuilder({
          parentId: null,
          type: "post",
          route: "home",
        })}
      />
    </HydrationBoundary>
  );
};

export default Home;
