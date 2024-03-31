import { QUERY_KEYS_PREFLIX } from "./query-keys";
import {
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { like } from "@/actions/like";
import {
  optimisticInsert,
  optimisticUpdate,
  updateInteractCount,
  updateLikesCount,
} from "./optimistic-functions";
import { updateMedia } from "@/actions/update-media";
import { EditMediaShcema, NewMediaSchema } from "@/schemas";
import * as z from "zod";
import { getPostCreator } from "@/actions/get-post-creator";
import { deleteMedia } from "@/actions/delete-media";
import { newMedia } from "@/actions/new-media";
import { InfinitePostsRoutes, MediaTypes } from "@/constansts";

export const useGetInfiniteMedias = ({
  profileId,
  parentId,
  type,
  queryFn,
  queryKey,
  route,
}: {
  profileId?: string;
  parentId?: string | null;
  type: (typeof MediaTypes)[number];
  queryFn: (pageParam: any) => Promise<any>;
  queryKey: QueryKey;
  route?: (typeof InfinitePostsRoutes)[number];
}) => {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => queryFn(pageParam),
    initialPageParam: {
      cursor: undefined,
      parentId: parentId,
      type: type,
      profileId: profileId,
      route,
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor
        ? {
            cursor: lastPage.nextCursor,
            parentId,
            type,
            profileId: profileId,
            route,
          }
        : undefined;
    },
  });
};

export const useGetPostCreator = (postId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS_PREFLIX.GET_POST_CREATOR, { mediaId: postId }],
    queryFn: () => getPostCreator(postId),
  });
};

export const useLike = (querykeyPreflix: QueryKey) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => like(id),
    onMutate: (id) => {
      updateLikesCount({
        queryClient: queryClient,
        queryKeyPreflix: querykeyPreflix,
        id,
      });
    },
  });
};

export const useCreateMedia = ({
  type,
  currentListQueryKey,
  parentListPreflix,
  parentId,
}: {
  type: (typeof MediaTypes)[number];
  currentListQueryKey: QueryKey;
  parentListPreflix?: QueryKey;
  parentId: string | null;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: z.infer<typeof NewMediaSchema>) => newMedia(values),
    onSettled(data, error, variables, context) {
      if (data?.success && data.data) {
        optimisticInsert({
          queryClient,
          queryKey: currentListQueryKey,
          data: {
            ...data.data,
            isLikedByMe: false,
            interactsCount: 0,
            likesCount: 0,
          },
          orderBy: type !== "post" ? "asc" : "dsc",
        });
        if (type !== "post" && parentId && parentListPreflix) {
          console.log(parentListPreflix);
          updateInteractCount({
            queryClient,
            queryKeyPreflix: parentListPreflix,
            parentId: parentId,
            action: "insert",
          });
        }
      }
    },
  });
};

export const useUpdateMedia = (queryKeyPreflix: QueryKey) => {
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
      if (data?.success && data.data) {
        optimisticUpdate({ queryClient, queryKeyPreflix, data: data.data });
      }
    },
  });
};

export const useDeleteMedia = (querykeyPreflix: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: querykeyPreflix, exact: true });
    },
  });
};
