"use client";
import { useGetMediaById } from "@/queries/react-query/queris";
import React, { useEffect } from "react";
import { SkeletonCard } from "../../../cards/skeleton-card";
import { Button } from "@/components/ui/button";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { optimisticUpdate } from "@/queries/react-query/optimistic-functions";
import EditForm from "./edit-form";
import { CornerDownRight } from "lucide-react";

interface EditProps {
  id: string;
  queryKey: QueryKey;
}

const Edit = ({ id, queryKey }: EditProps) => {
  const queryClient = useQueryClient();
  const { data, isPending, error, refetch, isFetched } = useGetMediaById(id);

  if (isFetched && data?.success) {
    optimisticUpdate({
      queryClient,
      queryKey,
      data: data.success,
    });
  }

  if (isPending) return <SkeletonCard />;

  if (error || !data?.success)
    return (
      <div className="flex flex-col justify-center items-center w-full h-full gap-y-1">
        Opps!!! something went wrong
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );

  return (
    <div>
      <div className="flex gap-x-1 items-center p-4">
        <CornerDownRight />
        <div className="pt-2">Editing {data.success.type}</div>
      </div>
      <EditForm id={id} defaultValues={data.success} queryKey={queryKey} />
    </div>
  );
};

export default Edit;
