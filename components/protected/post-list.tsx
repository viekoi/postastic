"use client";
import { PostWithData } from "@/type";
import React, { useOptimistic } from "react";

import PostCard from "./cards/post-card";

interface PostListProps {
  posts: PostWithData[];
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
