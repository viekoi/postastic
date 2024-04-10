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
  updateFollowCount,
  updateInteractCount,
  updateLikesCount,
} from "./optimistic-functions";
import { updateMedia } from "@/actions/update-media";
import {
  EditMediaShcema,
  EditUserProfileShcema,
  NewMediaSchema,
} from "@/schemas";
import * as z from "zod";
import { deleteMedia } from "@/actions/delete-media";
import { newMedia } from "@/actions/new-media";
import { InfinitePostsRoutes, MediaTypes } from "@/constansts";
import { updateProfile } from "@/actions/update-user-profile";
import { getUserByIdAction } from "@/actions/get-user-by-id";
import { follow } from "@/actions/follow";

// query

export const useGetInfiniteMedias = ({
  profileId,
  parentId,
  type,
  queryFn,
  route,
  q,
}: {
  type: (typeof MediaTypes)[number];
  queryFn: (pageParam: any) => Promise<any>;
  profileId?: string;
  parentId?: string | null;
  route?: (typeof InfinitePostsRoutes)[number];
  q?: string;
}) => {
  return useInfiniteQuery({
    queryKey: [
      QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,
      type,
      { parentId: parentId, profileId: profileId, route: route, q: q },
    ],
    queryFn: ({ pageParam }) => queryFn(pageParam),
    initialPageParam: {
      cursor: undefined,
      parentId: parentId,
      type: type,
      profileId: profileId,
      route,
      q: q,
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor
        ? {
            cursor: lastPage.nextCursor,
            parentId,
            type,
            profileId: profileId,
            route,
            q: q,
          }
        : undefined;
    },
  });
};

export const getUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS_PREFLIX.GET_USER, { userId }],
    queryFn: () => getUserByIdAction(userId),
  });
};

export const useGetInfiniteUsers = ({
  q,
  queryFn,
}: {
  q: string;
  queryFn: (pageParam: any) => Promise<any>;
}) => {
  return useInfiniteQuery({
    staleTime: 0,
    refetchOnWindowFocus: false,
    queryKey: [QUERY_KEYS_PREFLIX.GET_INFINTE_USERS, { q: q }],
    queryFn: ({ pageParam }) => queryFn(pageParam),
    initialPageParam: {
      cursor: undefined,
      q: q,
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor
        ? {
            cursor: lastPage.nextCursor,
            q: q,
          }
        : undefined;
    },
  });
};

//mutaion
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

export const useFollow = (
  followerId: string,
  followingId: string,
  action: "follow" | "unfollow"
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => follow(id),
    onMutate: () => {
      updateFollowCount({ queryClient, followerId, followingId, action });
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
      queryClient.invalidateQueries({ queryKey: querykeyPreflix });
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: z.infer<typeof EditUserProfileShcema>) =>
      updateProfile(values),
    onSettled: (data, error, variables, context) => {
      if (data?.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS_PREFLIX.GET_USER, { userId: variables.id }],
        });
      }
    },
  });
};
