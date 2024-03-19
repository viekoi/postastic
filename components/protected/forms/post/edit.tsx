"use client";
import { useNewPostModal } from "@/hooks/use-modal-store";
import { useGetPostById } from "@/queries/react-query/queris";
import React, { useEffect } from "react";
import { SkeletonCard } from "../../cards/skeleton-card";
import EditForm from "./edit-form";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { optimisticUpdate } from "@/queries/react-query/optimistic-functions";
import { QUERY_KEYS } from "@/queries/react-query/query-keys";

interface EditProps {
  postId: string;
}

const Edit = ({ postId }: EditProps) => {
  const queryClient = useQueryClient();
  const { data, isPending, error, refetch, isFetched } = useGetPostById(postId);

  useEffect(() => {
    if (isFetched && data?.success) {
      console.log("ran");
      optimisticUpdate({
        queryClient,
        queryKey: [QUERY_KEYS.GET_HOME_POSTS],
        data: data.success,
      });
    }
  }, [isFetched]);

  if (isPending) return <SkeletonCard />;

  if (error || !data?.success)
    return (
      <div className="flex flex-col justify-center items-center w-full h-full gap-y-1">
        Opps!!! something went wrong
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );

  return <EditForm postId={postId} defaultValues={data.success} />;
};

export default Edit;
