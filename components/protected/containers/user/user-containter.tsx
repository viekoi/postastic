"use client";

import { getIniniteUsers } from "@/actions/get-infinite-users";
import { useGetInfiniteUsers } from "@/queries/react-query/queris";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { SkeletonCard } from "../../cards/skeleton-card";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import UserList from "../../lists/media/user-list";

interface UserContainerProps {
  q: string;
}

const UserContainer = ({ q }: UserContainerProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    error,
    refetch,
    isPending,
    isRefetching,
  } = useGetInfiniteUsers({
    queryFn: getIniniteUsers,
    q: q,
  });

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

  if (data.pages[0].data?.length === 0) {
    return (
      <div className="flex flex-1  h-full flex-col  justify-center items-center">
        <MessageSquareText className="size-[20%]" />
        <strong>Search is empty</strong>
      </div>
    );
  }

  return (
    <>
      {data.pages.flat().map((page, index) => {
        return <UserList users={page.data} key={index} />;
      })}

      {hasNextPage && (
        <div ref={ref} className="w-full">
          <SkeletonCard />
        </div>
      )}
    </>
  );
};

export default UserContainer;
