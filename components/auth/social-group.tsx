"use client";

import { FaGithub } from "react-icons/fa";

import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const SocialGroup = () => {

  const onClick = (provider:  "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  }
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        className="w-full"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <FaGithub size={20} />
      </Button>
    </div>
  );
};
