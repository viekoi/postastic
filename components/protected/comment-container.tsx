"use client";
import { useGetInfinitePostComments } from "@/queries/react-query/queris";
import { Button } from "../ui/button";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Loader } from "../Loader";
import { MessageSquareText } from "lucide-react";
import CommentList from "./comment-list";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/queries/react-query/query-keys";

import { updateCommentsCount } from "@/queries/react-query/optimistic-functions";

const CommentContainer = ({
  postId,
  initialCommentsCount,
}: {
  postId: string;
  initialCommentsCount: number;
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
    if (data?.pages[0].total && data!.pages[0].total !== initialCommentsCount) {
      updateCommentsCount({
        queryClient,
        queryKey: [QUERY_KEYS.GET_HOME_POSTS],
        id: postId,
        newCount: data?.pages[0].total,
      });
    }
  }, [data]);

  if (isPending)
    return (
      <div className="flex h-full  justify-center items-center">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="flex h-full justify-center items-center">
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
          <CommentList
            key={index}
            comments={page.success ? page.success : []}
          />
        );
      })}

      {hasNextPage && (
        <div
          ref={ref}
          className="w-full h-full flex items-center justify-center py-1"
        >
          <Loader />
        </div>
      )}
    </>
  );
};

export default CommentContainer;
