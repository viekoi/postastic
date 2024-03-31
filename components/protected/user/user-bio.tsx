"use client";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEditProfileModal } from "@/hooks/use-modal-store";
import { formatDateString } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { User } from "next-auth";
import React, { useMemo } from "react";

interface UserBiopProps {
  user: User;
}

const UserBio = ({ user }: UserBiopProps) => {
  const { user: currentUser, isLoading } = useCurrentUser();
  const { onOpen } = useEditProfileModal();
  return (
    <div className="border-b-[0.5px] border-gray-600 pb-4 px-4">
      <div className="flex items-center w-full justify-between">
        <p className="text-2xl font-semibold">{user.name}</p>
        <div>
          {currentUser?.id === user.id && (
            <Button onClick={onOpen}>Edit Profile</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBio;
