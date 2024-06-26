"use client";
import { Button } from "../../../ui/button";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { MessageSquareText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS_PREFLIX } from "@/queries/react-query/query-keys";

import { updateInteractCount } from "@/queries/react-query/optimistic-functions";
import { SkeletonCard } from "../../cards/skeleton-card";
import MediaList from "../../lists/media/media-list";
import { useGetInfiniteMedias } from "@/queries/react-query/queris";
import { getInfiniteMedias } from "@/actions/get-infinite-medias";

const ReplyContainer = ({
  postId,
  parentId,
  initialInteractCount,
}: {
  postId: string | null;
  parentId: string | null;
  initialInteractCount: number;
}) => {
  const queryClient = useQueryClient();
  const { data, error, refetch, hasNextPage, fetchNextPage, isPending } =
    useGetInfiniteMedias({
      parentId,
      type:"reply",
      queryFn: getInfiniteMedias,
    });
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (data?.pages[0].total && data!.pages[0].total !== initialInteractCount) {
      updateInteractCount({
        queryClient,
        queryKeyPreflix: [
          QUERY_KEYS_PREFLIX.GET_INFINITE_MEDIAS,
          "reply",
          { parentId: parentId },
        ],
        parentId: postId,
        newCount: data?.pages[0].total,
      });
    }
  }, [data]);

  if (isPending)
    return (
      <div className="flex h-full items-start flex-col">
        {Array.from({ length: initialInteractCount + 1 }).map(
          (element, index) => (
            <SkeletonCard key={index} />
          )
        )}
      </div>
    );

  if (error)
    return (
      <div className="p-2 flex flex-col h-full w-[300px] justify-center items-center bg-white rounded-3xl ">
        Opps!!! something went wrong
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );

  if (data.pages[0].data?.length === 0) {
    return (
      <div className="flex h-full flex-col  justify-center items-center bg-white rounded-3xl ">
        <MessageSquareText className="size-[20%]" />
        <strong>There are no comment</strong>
        <p>Be the first person to leave a reply</p>
      </div>
    );
  }

  return (
    <div className="max-h-[40vh] overflow-y-scroll custom-scrollbar ">
      {data.pages.flat().map((page, index) => {
        return (
          <MediaList
            className="flex flex-col gap-y-4 w-full"
            key={index}
            medias={page.data ? page.data : []}
            type="reply"
          />
        );
      })}
      {hasNextPage && (
        <div ref={ref} className="flex h-full items-center">
          <SkeletonCard />
        </div>
      )}
    </div>
  );
};

export default ReplyContainer;
