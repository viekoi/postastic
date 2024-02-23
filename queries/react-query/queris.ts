import {getInfiniteaccessiblePosts } from "@/actions/get-inifinite-accessible-posts";
import { QUERY_KEYS } from "./query-keys";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { likePost } from "@/actions/like-post";

export const useGetInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_ACCESSIBLE_POSTS],
    queryFn: ({ pageParam }) => getInfiniteaccessiblePosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return null;

      if (lastPage.error) return null;

      if (lastPage.success && lastPage.success.length === 0) {
        return null;
      }
      const nextPageParam = lastPage.pageParam + 1;
      return nextPageParam;
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) =>
      likePost(postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_ACCESSIBLE_POSTS],
      });
    },
  });
};
