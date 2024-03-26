"use client";
import { useGetInfinitePostComments } from "@/queries/react-query/queris";
import { Button } from "../../../ui/button";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { MessageSquareText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/queries/react-query/query-keys";

import { updateInteractCount } from "@/queries/react-query/optimistic-functions";
import { SkeletonCard } from "../../cards/skeleton-card";
import MediaList from "../../lists/media/media-list";

const CommentContainer = ({
  postId,
  initiaParentInteractCount,
}: {
  postId: string;
  initiaParentInteractCount: number;
}) => {
  const queryClient = useQueryClient();
  const { data, error, refetch, hasNextPage, fetchNextPage, isPending } =
    useGetInfinitePostComments(postId);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (
      data?.pages[0].total &&
      data!.pages[0].total !== initiaParentInteractCount
    ) {
      updateInteractCount({
        queryClient,
        queryKey: [QUERY_KEYS.GET_HOME_POSTS],
        parentId: postId,
        newCount: data?.pages[0].total,
      });
    }
  }, [data]);

  if (isPending) {
    return (
      <div className="flex h-full flex-col w-[300px]  justify-start items-center">
        {Array.from({ length: initiaParentInteractCount + 1 }).map(
          (element, index) => (
            <SkeletonCard key={index} />
          )
        )}
      </div>
    );
  }

  if (error)
    return (
      <div className="flex h-full flex-col py-1 justify-center items-center">
        Opps!!! something went wrong
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );

  if (data.pages[0].success?.length === 0) {
    return (
      <div className="flex h-full flex-col  justify-center items-center">
        <MessageSquareText className="size-[20%]" />
        <strong>There are no comment</strong>
        <p>Be the first person to leave a comment</p>
      </div>
    );
  }

  return (
    <>
      {data.pages.flat().map((page, index) => {
        return (
          <MediaList
            className="flex flex-col gap-y-4 w-full"
            key={index}
            medias={page.success ? page.success : []}
            type="comment"
          />
        );
      })}

      {hasNextPage && (
        <div ref={ref} className="flex flex-col gap-y-4">
          <SkeletonCard />
        </div>
      )}
    </>
  );
};

export default CommentContainer;
