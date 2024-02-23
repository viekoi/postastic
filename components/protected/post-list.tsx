"use client";

import { useGetInfinitePosts } from "@/queries/react-query/queris";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";
import { Loader } from "../Loader";
import PostCard from "./cards/post-card";
import { PostWithData } from "@/type";

const PostList = () => {
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
      {data.pages.map((page, index) => {
        return (
          <div key={index}>
            {page?.success?.map((post: PostWithData) => {
              return <PostCard key={post.id} post={post} />;
            })}
          </div>
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

export default PostList;
