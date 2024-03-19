"use client";
import { useGetInfiniteCommentReplies } from "@/queries/react-query/queris";
import { Button } from "../ui/button";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Loader } from "../Loader";
import { MessageSquareText } from "lucide-react";
import CommentList from "./comment-list";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/queries/react-query/query-keys";

import { updateInteractCount } from "@/queries/react-query/optimistic-functions";
import ReplyList from "./reply-list";
import { SkeletonCard } from "./cards/skeleton-card";

const ReplyContainer = ({
  postId,
  parentId,
  initialInteractCount,
}: {
  postId: string;
  parentId: string;
  initialInteractCount: number;
}) => {
  const queryClient = useQueryClient();
  const { data, error, refetch, hasNextPage, fetchNextPage, isPending } =
    useGetInfiniteCommentReplies(postId, parentId);
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
        queryKey: [QUERY_KEYS.GET_POST_COMMENTS, postId, "comments"],
        id: postId,
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

  if (data.pages[0].success?.length === 0) {
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
          <ReplyList key={index} replies={page.success ? page.success : []} />
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
