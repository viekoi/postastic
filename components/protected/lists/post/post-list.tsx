"use client";
import { MediaWithData } from "@/type";
import React, { useOptimistic } from "react";

import PostCard from "../../cards/post/post-card";

interface PostListProps {
  posts: MediaWithData[];
}

const PostList = ({ posts }: PostListProps) => {
  return (
    <>
      {posts.map((post) => {
        return <PostCard key={post.id} post={post} />;
      })}
    </>
  );
};

export default PostList;
