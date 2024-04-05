"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ExtendedUser } from "@/next-auth";
import SettingsTab from "../../tabs/settings-tab";
import { getUserById } from "@/queries/react-query/queris";
import { Loader } from "@/components/Loader";

interface EditProps {
  id: string;
}

const Edit = ({ id }: EditProps) => {
  const {
    data: user,
    error,
    refetch,
    isRefetching,
    isPending,
  } = getUserById(id);
  const [isEdit, setIsEdit] = useState(false);
  const handleSetIsEdit = () => {
    setIsEdit((prev) => !prev);
  };
  if (isPending || isRefetching)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader />
      </div>
    );

  if (error || !user)
    return (
      <div className="flex flex-col justify-center items-center w-full h-full gap-y-1">
        Opps!!! something went wrong
        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    );
  return (
    <div className="">
      <SettingsTab setIsEdit={handleSetIsEdit} isEdit={isEdit} user={user} />
    </div>
  );
};

export default Edit;
