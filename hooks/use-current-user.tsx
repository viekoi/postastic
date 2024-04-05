"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { ExtendedUser } from "@/next-auth";

export const useCurrentUser = () => {
  const session = useSession();

  return {
    user: session.data?.user,
    isLoading: session.status === "loading" ? true : false,
    update:session.update
  };
};
