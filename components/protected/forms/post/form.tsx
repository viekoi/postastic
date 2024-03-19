"use client";
import { useNewPostModal } from "@/hooks/use-modal-store";
import React from "react";

import Edit from "./edit";
import NewForm from "./new-form";

const Form = () => {
  const { postId } = useNewPostModal();

  if (!postId) {
    return <NewForm />;
  }

  return <Edit postId={postId} />;
};

export default Form;
