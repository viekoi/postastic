"use client";

import ImageCarouselModal from "@/components/protected/modals/image-carousel-modal";
import NewPostModal from "@/components/protected/modals/new-post-modal";
import ReplyModal from "@/components/protected/modals/reply-modal";
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
      <ImageCarouselModal/>
      <ReplyModal/>
    </>
  );
};

export default ModalProvider;
