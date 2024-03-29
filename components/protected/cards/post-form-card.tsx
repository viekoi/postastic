"use client";
import React from "react";
import UserAvatar from "../user-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Image, Laugh } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNewMediaModal } from "@/hooks/use-modal-store";
import { useIsAddingFiles } from "@/hooks/use-is-adding-files";

const PostFormCard = () => {
  const { user, isLoading } = useCurrentUser();
  const { onOpen } = useNewMediaModal();
  const { onAdd } = useIsAddingFiles();
  return (
    <Card className="hidden lg:block bg-black border-0 border-b-[0.5px] border-gray-600 text-white rounded-none">
      <CardHeader>
        <div className="flex items-start gap-x-2">
          <UserAvatar user={user} />
          <Button
            onClick={() => onOpen(null)}
            variant={"ghost"}
            className="justify-start w-full rounded-full text-muted-foreground"
          >
            What is happening?
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex  items-center justify-end">
          <Button
            onClick={() => {
              onOpen(null);
              onAdd();
            }}
            type="button"
            variant={"ghost"}
            size={"icon"}
          >
            <Image />
          </Button>
          <Button
            onClick={() => onOpen(null)}
            type="button"
            variant={"ghost"}
            size={"icon"}
          >
            <Laugh />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostFormCard;
