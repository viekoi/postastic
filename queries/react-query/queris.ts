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
import { updateMedia } from "@/actions/update-media";
import { EditShcema, NewMediaShcema } from "@/schemas";
import * as z from "zod";
import { getPostCreator } from "@/actions/get-post-creator";
import { deleteMedia } from "@/actions/delete-media";
import { newMedia } from "@/actions/new-media";

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

export const useGetInfinitePostComments = (postId: string | null) => {
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
  postId: string | null,
  parentId: string | null
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

export const useGetMediaById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MEDIA_BY_ID, id],
    queryFn: () => getPostById(id),
  });
};

export const useGetPostCreator = (postId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_CREATOR, postId],
    queryFn: () => getPostCreator(postId),
  });
};

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

export const useCreateMedia = () => {
  return useMutation({
    mutationFn: (values: z.infer<typeof NewMediaShcema>) => newMedia(values),
  });
};

export const useUpdateMedia = (querykey: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      values,
      id,
    }: {
      values: z.infer<typeof EditShcema>;
      id: string;
    }) => updateMedia(values, id),
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: querykey });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MEDIA_BY_ID, variables.id],
      });
    },
  });
};

export const useDeleteMedia = (querykey: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: querykey });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MEDIA_BY_ID, variables],
      });
    },
  });
};
