import { CommentWithData, PostWithData, ReplyWithData } from "@/type";
import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";

export type ShareType<T> = T & {
  interactsCount?: number;
};

export type QueryListType =
  | ShareType<PostWithData>
  | ShareType<CommentWithData>
  | ShareType<ReplyWithData>;

export const updateLikesCount = async ({
  queryClient,
  queryKey,
  id,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  id: string;
}) => {
  await queryClient.cancelQueries({
    queryKey: queryKey,
  });

  const previousData = queryClient.getQueryData(queryKey);

  queryClient.setQueryData(
    queryKey,
    (
      old: InfiniteData<{
        success: QueryListType[];
        currentPage: number;
        nextPage: number;
        total: number;
        totalPages: number;
        limit: number;
      }>
    ) => {
      return {
        ...old,
        pages: old.pages.map((page) => {
          return {
            ...page,
            success: page.success.map((post) => {
              if (post.id === id) {
                const countModifier = post.isLikedByMe ? -1 : +1;
                return {
                  ...post,
                  likesCount: post.likesCount + countModifier,
                  isLikedByMe: !post.isLikedByMe,
                };
              } else return post;
            }),
          };
        }),
      };
    }
  );

  return previousData;
};

export const updateInteractCount = async ({
  queryClient,
  queryKey,
  id,
  newCount,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  id: string;
  newCount?: number;
}) => {
  await queryClient.cancelQueries({
    queryKey: queryKey,
  });
  queryClient.setQueryData(
    queryKey,
    (
      old: InfiniteData<{
        success: QueryListType[];
        currentPage: number;
        nextPage: number;
        total: number;
        totalPages: number;
        limit: number;
      }>
    ) => {
      return {
        ...old,
        pages: old.pages.map((page) => {
          return {
            ...page,
            success: page.success.map((post) => {
              if (post.id === id) {
                return {
                  ...post,
                  interactsCount: newCount
                    ? newCount
                    : post.interactsCount! + 1,
                };
              } else return post;
            }),
          };
        }),
      };
    }
  );
};

export const optimisticInsert = async ({
  queryClient,
  queryKey,
  data,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  data: QueryListType;
}) => {
  await queryClient.cancelQueries({
    queryKey: queryKey,
  });

  queryClient.setQueryData(
    queryKey,
    (
      old: InfiniteData<{
        error?: string;
        success?: QueryListType[];
        currentPage: number;
        nextPage: number;
        total: number;
        totalPages: number;
        limit: number;
      }>
    ) => {
      if (!old) return;
      if (old.pages[0].error || !old.pages[0].success) return;

      const newTotalPages = Math.ceil((old.pages[0].total + 1) / 10);
      const newTotal = old.pages[0].total + 1;
      if (old.pages[0].success.length === 10) {
        return {
          pageParams: [...old.pageParams, (old.pageParams[-1] as number) + 1],
          pages: [
            {
              ...old.pages[0],
              success: [data],
              totalPages: newTotalPages,
              total: newTotal,
            },
            ...old.pages.map((page) => {
              return {
                ...page,
                totalPages: newTotalPages,
                total: newTotal,
              };
            }),
          ],
        };
      } else {
        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              success: [data, ...old.pages[0].success],
              totalPages: newTotalPages,
              total: newTotal,
            },
            ...old.pages.slice(1).map((page) => {
              return {
                ...page,
                totalPages: newTotalPages,
                total: newTotal,
              };
            }),
          ],
        };
      }
    }
  );
};

export const optimisticUpdate = async ({
  queryClient,
  queryKey,
  data,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  data: QueryListType;
}) => {
  await queryClient.cancelQueries({
    queryKey: queryKey,
  });

  queryClient.setQueryData(
    queryKey,
    (
      old: InfiniteData<{
        success: QueryListType[];
        currentPage: number;
        nextPage: number;
        total: number;
        totalPages: number;
        limit: number;
      }>
    ) => {
      return {
        ...old,
        pages: old.pages.map((page) => {
          return {
            ...page,
            success: page.success.map((post) => {
              if (post.id === data.id) {
                return {
                  ...data,
                };
              } else return post;
            }),
          };
        }),
      };
    }
  );
};
