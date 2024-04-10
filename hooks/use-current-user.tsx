"use client";
import { useSession } from "next-auth/react";



export const useCurrentUser = () => {
  const session = useSession();

  return {
    user: session.data?.user,
    isLoading: session.status === "loading" ? true : false,
    update: session.update,
  };
};
