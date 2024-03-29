import { QUERY_KEYS } from "@/queries/react-query/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PostFormCard from "@/components/protected/cards/post-form-card";
import PostContainer from "@/components/protected/containers/post/post-container";
import { getInfiniteMedias } from "@/actions/get-infinite-medias";

const Home = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_MEDIAS,null],
    queryFn: ({ pageParam }) => getInfiniteMedias(pageParam),
    initialPageParam: {type:"post" as "post" },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor
        ? { cursor: lastPage.nextCursor, type: "post" as "post" }
        : undefined;
    },
    pages: 1, // prefetch the first 1 pages
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostFormCard />
      <PostContainer />
    </HydrationBoundary>
  );
};

export default Home;
