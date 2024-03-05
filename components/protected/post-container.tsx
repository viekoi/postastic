"use client";

import { useGetInfinitePosts } from "@/queries/react-query/queris";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";
import { Loader } from "../Loader";

import PostList from "./post-list";
import { Button } from "../ui/button";

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
      <div className="flex justify-center items-center w-full h-full">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center w-full h-full">
        Opps!!! something went wrong
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );
  return (
    <>
      {data.pages.flat().map((page, index) => {
        return (
          <PostList
            key={index}
            posts={page.success ? page.success : []}
          
          />
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
