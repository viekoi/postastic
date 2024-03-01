import { PostWithData } from "@/type";
import React, { useOptimistic } from "react";
import { Loader } from "../Loader";
import PostCard from "./cards/post-card";

interface PostListProps {
  posts: PostWithData[];
  currentPage?: number;
}

const PostList = ({ posts, currentPage }: PostListProps) => {
  if (!currentPage) return;
  return (
    <>
      {posts.map((post) => {
        return <PostCard key={post.id} post={post} currentPage={currentPage} />;
      })}
    </>
  );
};

export default PostList;
