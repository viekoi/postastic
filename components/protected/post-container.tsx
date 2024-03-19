"use client";

import { useGetInfinitePosts } from "@/queries/react-query/queris";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";
import { Loader } from "../Loader";

import PostList from "./post-list";
import { Button } from "../ui/button";
import { MessageSquareText } from "lucide-react";
import { SkeletonCard } from "./cards/skeleton-card";

const PostContainer = () => {
  const { data, fetchNextPage, hasNextPage, error, refetch, isPending } =
    useGetInfinitePosts();
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (isPending)
    return (
      <div className="flex justify-center items-center w-full h-full flex-col gap-y-10">
        {Array.from({ length: 10 }).map((element, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );

  if (error)
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
          <PostList key={index} posts={page.success ? page.success : []} />
        );
      })}

      {hasNextPage && (
        <div ref={ref} className="w-full flex items-center justify-center py-1">
          <Loader />
        </div>
      )}
    </>
  );
};

export default PostContainer;
