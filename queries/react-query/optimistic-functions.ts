import { MediaWithData } from "@/type";
import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";

export const updateLikesCount = async ({
  queryClient,
  queryKeyPreflix,
  id,
}: {
  queryClient: QueryClient;
  queryKeyPreflix: QueryKey;
  id: string;
}) => {
  await queryClient.cancelQueries({
    queryKey: queryKeyPreflix,
  });

  queryClient.setQueriesData(
    { queryKey: queryKeyPreflix },
    (old: InfiniteData<{ data: MediaWithData[] }> | undefined) => {
      if (!old) return;
      return {
        ...old,
        pages: old.pages.map((page) => {
          return {
            ...page,
            data: page.data.map((media) => {
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
};

export const updateInteractCount = async ({
  queryClient,
  queryKeyPreflix,
  parentId,
  newCount,
  action,
}: {
  queryClient: QueryClient;
  queryKeyPreflix: QueryKey;
  parentId: string | null;
  newCount?: number;
  action?: "insert" | "delete";
}) => {
  if (!parentId) return;
  if (!newCount && !action)
    throw new Error("neither give a action or a newCount");
  await queryClient.cancelQueries({
    queryKey: queryKeyPreflix,
  });

  queryClient.setQueriesData(
    { queryKey: queryKeyPreflix },
    (old: InfiniteData<{ data: MediaWithData[] }> | undefined) => {
      if (!old) {
        return;
      }
      return {
        ...old,
        pages: old.pages.map((page) => {
          return {
            ...page,
            data: page.data.map((media) => {
              if (media.id === parentId) {
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

  queryClient.setQueriesData(
    { queryKey: queryKey },
    (
      old:
        | InfiniteData<{ data: MediaWithData[]; status: "success" | "failed" }>
        | undefined
    ) => {
      if (!old) {
        return;
      }
      //@ts-ignore
      if (old.pageParams[0].route && old.pageParams[0].route === "save") {
        return;
      }
      const firstPage = old.pages[0];
      const currentLastPageIndex = old.pages.length - 1;
      const currentLastPage = old.pages[currentLastPageIndex];

      if (old && firstPage.data && currentLastPage.status === "success") {
        if (orderBy === "dsc") {
          return {
            ...old,
            pages: [
              {
                ...firstPage,
                data: [data, ...firstPage.data],
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
                  data: [...currentLastPage.data, data],
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
                data: [...currentLastPage.data, data],
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
  queryKeyPreflix,
  data,
}: {
  queryClient: QueryClient;
  queryKeyPreflix: QueryKey;
  data: Omit<
    MediaWithData,
    "interactsCount" | "user" | "likesCount" | "isLikedByMe"
  >;
}) => {
  await queryClient.cancelQueries({
    queryKey: queryKeyPreflix,
  });
  queryClient.setQueriesData(
    { queryKey: queryKeyPreflix },
    (
      old:
        | InfiniteData<{
            data: MediaWithData[];
          }>
        | undefined
    ) => {
      if (!old) return;
      return {
        ...old,
        pages: old.pages.map((page) => {
          return {
            ...page,
            data: page.data.map((media) => {
              if (media.id === data.id) {
                return {
                  ...data,
                  isLikedByMe: media.isLikedByMe,
                  likesCount: media.likesCount,
                  user: media.user,
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
