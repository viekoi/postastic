"use client";

import NewPostModal from "@/components/protected/modals/new-post-modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <NewPostModal />
    </>
  );
};

export default ModalProvider;
