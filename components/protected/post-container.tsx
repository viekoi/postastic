"use client";

import { useGetInfinitePosts } from "@/queries/react-query/queris";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";
import { Loader } from "../Loader";

import PostList from "./post-list";

const PostContainer = () => {
  const { data, fetchNextPage, hasNextPage, error } = useGetInfinitePosts();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (!data || error)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader />
      </div>
    );
  return (
    <>
      {data.pages.flat().map((page, index) => {
        return (
          <PostList key={index} posts={page.success ? page.success : []} currentPage={page.currentPage}  />
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
