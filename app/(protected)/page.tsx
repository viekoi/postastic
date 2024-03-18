import { getHomePosts } from "@/actions/get-home-posts";
import { QUERY_KEYS } from "@/queries/react-query/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PostFormCard from "@/components/protected/cards/post-form-card";
import PostContainer from "@/components/protected/post-container";

const Home = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_HOME_POSTS],
    queryFn: ({ pageParam }) => getHomePosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return null;

      if (lastPage.error) return null;

      if (lastPage.totalPages === 0) {
        return null;
      }

      if (
        lastPage.currentPage &&
        lastPage.totalPages &&
        lastPage.currentPage === lastPage.totalPages
      ) {
        return null;
      }

      return lastPage.nextPage;
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
