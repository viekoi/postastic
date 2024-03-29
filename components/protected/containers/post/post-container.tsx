"use client";

import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";

import { Button } from "../../../ui/button";
import { MessageSquareText } from "lucide-react";
import { SkeletonCard } from "../../cards/skeleton-card";
import MediaList from "../../lists/media/media-list";
import { useGetInfiniteMedias } from "@/queries/react-query/queris";

const PostContainer = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    error,
    refetch,
    isPending,
    isRefetching,
  } = useGetInfiniteMedias({type:"post"});
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (isPending || isRefetching)
    return (
      <div className="flex justify-center items-center w-full h-full flex-col gap-y-10">
        {Array.from({ length: 10 }).map((element, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );

  if (error || !data?.pages)
    return (
      <div className="flex flex-col justify-center items-center w-full h-full gap-y-1">
        Opps!!! something went wrong
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );

  if (data.pages[0].success?.length === 0) {
    return (
      <div className="flex h-full flex-col  justify-center items-center">
        <MessageSquareText className="size-[20%]" />
        <strong>Feed is empty</strong>
      </div>
    );
  }
  return (
    <>
      {data.pages.flat().map((page, index) => {
        return (
          <MediaList
            key={index}
            medias={page.success ? page.success : []}
            type="post"
          />
        );
      })}

      {hasNextPage && (
        <div ref={ref} className="w-full">
          <SkeletonCard />
        </div>
      )}
    </>
  );
};

export default PostContainer;
