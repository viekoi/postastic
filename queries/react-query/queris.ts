import { QUERY_KEYS } from "./query-keys";
import {
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { like } from "@/actions/like";
import { updateLikesCount } from "./optimistic-functions";
import { getPostById } from "@/actions/get-post-by-id";
import { updateMedia } from "@/actions/update-media";
import { EditMediaShcema, NewMediaSchema } from "@/schemas";
import * as z from "zod";
import { getPostCreator } from "@/actions/get-post-creator";
import { deleteMedia } from "@/actions/delete-media";
import { newMedia } from "@/actions/new-media";
import { getInfiniteMedias } from "@/actions/get-infinite-medias";

export const useGetInfiniteMedias = ({
  parentId,
  type,
}: {
  parentId?: string | null;
  type: "post" | "comment" | "reply";
}) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_MEDIAS,parentId],
    queryFn: ({ pageParam }) => getInfiniteMedias(pageParam),
    initialPageParam: { parentId: parentId, type: type },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor
        ? { cursor: lastPage.nextCursor, parentId, type }
        : undefined;
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
      queryClient.setQueryData(querykey, context?.previousData);
    },
  });
};

export const useCreateMedia = () => {
  return useMutation({
    mutationFn: (values: z.infer<typeof NewMediaSchema>) => newMedia(values),
  });
};

export const useUpdateMedia = (querykey: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      values,
      id,
    }: {
      values: z.infer<typeof EditMediaShcema>;
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
