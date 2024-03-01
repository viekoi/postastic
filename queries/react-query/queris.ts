import { getInfiniteaccessiblePosts } from "@/actions/get-inifinite-accessible-posts";
import { QUERY_KEYS } from "./query-keys";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { likePost } from "@/actions/like-post";
import { PostWithData } from "@/type";

export const useGetInfinitePosts = () => {
  return useInfiniteQuery({
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
  });
};



export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      likedPost,
      currentPage,
    }: {
      likedPost: PostWithData;
      currentPage: number;
    }) => likePost(likedPost.id),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_ACCESSIBLE_POSTS],
      });

      queryClient.setQueryData(
        [QUERY_KEYS.GET_INFINITE_ACCESSIBLE_POSTS],
        (
          old: InfiniteData<{
            success: PostWithData[];
            currentPage: number;
            nextPage: number;
          }>
        ) => {
          const updatedPages = structuredClone(old.pages).map((page) => {
            if (page.currentPage !== variables.currentPage) {
              return page;
            } else {
              const updatedSuccess = page.success.map((post) => {
                if (post.id === variables.likedPost.id) {
                  if (variables.likedPost.isLikedByUser) {
                    return {
                      ...variables.likedPost,
                      likesCount: variables.likedPost.likesCount - 1,
                      isLikedByUser: !variables.likedPost.isLikedByUser,
                    };
                  } else {
                    return {
                      ...variables.likedPost,
                      likesCount: variables.likedPost.likesCount + 1,
                      isLikedByUser: !variables.likedPost.isLikedByUser,
                    };
                  }
                } else return post;
              });

              return {
                ...page,
                success: updatedSuccess,
              };
            }
          });

          return { ...old, pages: updatedPages };
        }
      );
    },
  });
};
