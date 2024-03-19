import { getHomePosts } from "@/actions/get-home-posts";
import { QUERY_KEYS } from "./query-keys";
import {
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { like } from "@/actions/like";
import { getPostComments } from "@/actions/get-post-comments";
import { updateLikesCount } from "./optimistic-functions";
import { getCommentReplies } from "@/actions/get-comment-replies";
import { getPostById } from "@/actions/get-post-by-id";

export const useGetInfinitePosts = () => {
  return useInfiniteQuery({
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
        lastPage.currentPage >= lastPage.totalPages
      )
        return null;

      return lastPage.nextPage;
    },
  });
};

export const useGetInfinitePostComments = (postId: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POST_COMMENTS, postId, "comments"],
    queryFn: ({ pageParam }) => getPostComments(pageParam, postId),
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
        lastPage.currentPage >= lastPage.totalPages
      ) {
        return null;
      }

      return lastPage.nextPage;
    },
  });
};

export const useGetInfiniteCommentReplies = (
  postId: string,
  parentId: string
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_COMMENT_REPLIES, postId, parentId, "replies"],
    queryFn: ({ pageParam }) => getCommentReplies(pageParam, postId, parentId),
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
        lastPage.currentPage >= lastPage.totalPages
      ) {
        return null;
      }

      return lastPage.nextPage;
    },
  });
};

export const useGetPostById = (postId:string | null)=>{
  return useQuery(
    {
      queryKey:[QUERY_KEYS.GET_POST_BY_ID,postId],
      queryFn:()=>getPostById(postId)
    }
  )
}

export const useLike = (querykey: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => like(id),
    onMutate: (id) => {
      const previousData = updateLikesCount({
        queryClient: queryClient,
        queryKey: querykey,
        id,
      });

      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_HOME_POSTS],
        context?.previousData
      );
    },
  });
};
