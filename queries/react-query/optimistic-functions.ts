import { MediaWithData, OptimisticUpdateData } from "@/type";
import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";

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
        success: MediaWithData[];
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
            success: page.success.map((media) => {
              if (media.id === id) {
                const countModifier = media.isLikedByMe ? -1 : +1;
                return {
                  ...media,
                  likesCount: media.likesCount + countModifier,
                  isLikedByMe: !media.isLikedByMe,
                };
              } else return media;
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
  action,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  id: string;
  newCount?: number;
  action?: "insert" | "delete";
}) => {
  if (!newCount && !action)
    throw new Error("neither give a action or a newCount");
  await queryClient.cancelQueries({
    queryKey: queryKey,
  });
  queryClient.setQueryData(
    queryKey,
    (
      old: InfiniteData<{
        success: MediaWithData[];
        currentPage: number;
        nextPage: number;
        total: number;
        totalPages: number;
        limit: number;
      }>
    ) => {
      if (!old) return;
      return {
        ...old,
        pages: old.pages.map((page) => {
          return {
            ...page,
            success: page.success.map((media) => {
              if (media.id === id) {
                const countModifier = action === "insert" ? +1 : -1;
                return {
                  ...media,
                  interactsCount: newCount
                    ? newCount
                    : media.interactsCount + countModifier,
                };
              } else return media;
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
  orderBy,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  data: MediaWithData;
  orderBy: "asc" | "dsc";
}) => {
  await queryClient.cancelQueries({
    queryKey: queryKey,
  });

  queryClient.setQueryData(
    queryKey,
    (
      old: InfiniteData<{
        error?: string;
        success?: MediaWithData[];
        currentPage: number;
        nextPage: number;
        total: number;
        totalPages: number;
        limit: number;
      }>
    ) => {
      if (!old) return;
      const firstPage = old.pages[0];
      const currentLastPageIndex = old.pages.length - 1;
      const currentLastPage = old.pages[currentLastPageIndex];

      if (old && firstPage.success && currentLastPage.success) {
        if (orderBy === "dsc") {
          return {
            ...old,
            pages: [
              {
                ...firstPage,
                success: [data, ...firstPage.success],
              },
              ...old.pages.slice(1).map((page) => {
                return page;
              }),
            ],
          };
        } else {
          if (currentLastPageIndex === 0) {
            return {
              ...old,
              pages: [
                {
                  ...currentLastPage,
                  success: [...currentLastPage.success, data],
                },
              ],
            };
          }

          return {
            ...old,
            pages: [
              ...old.pages.slice(0, old.pages.length).map((page) => {
                return page;
              }),
              {
                ...currentLastPage,
                success: [...currentLastPage.success, data],
              },
            ],
          };
        }
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
  data: OptimisticUpdateData;
}) => {
  await queryClient.cancelQueries({
    queryKey: queryKey,
  });

  queryClient.setQueryData(
    queryKey,
    (
      old: InfiniteData<{
        success: MediaWithData[];
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
            success: page.success.map((media) => {
              if (media.id === data.id) {
                return {
                  ...data,
                  interactsCount: media.interactsCount,
                };
              } else return media;
            }),
          };
        }),
      };
    }
  );
};
