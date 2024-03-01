
import { getInfiniteaccessiblePosts } from "@/actions/get-inifinite-accessible-posts";
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
    queryKey: [QUERY_KEYS.GET_INFINITE_ACCESSIBLE_POSTS],
    queryFn: ({ pageParam }) => getInfiniteaccessiblePosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return null;

      if (lastPage.error) return null;

      if (lastPage.success && lastPage.success.length === 0) {
        return null;
      }
  
      return lastPage.nextPage;
    },
    pages: 2, // prefetch the first 3 pages
    
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostFormCard/>
      <PostContainer />
    </HydrationBoundary>
  );
};

export default Home;
