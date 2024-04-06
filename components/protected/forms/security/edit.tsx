"use client"
import React from "react";
import CollapseMenu from "../../accordions/accordion";
import NewPasswordForm from "./new-password-form";
import { ExtendedUser } from "@/next-auth";

interface EditProps{
  user:ExtendedUser
}

const Edit = ({user}:EditProps) => {
  const contents = [
    {
      value: "email",
      triggerText: "Change your email ?",
      content: <>email</>,
    },
    {
      value: "password",
      triggerText: "Change your password ?",
      content: (
        <>
          <NewPasswordForm user={user} />
        </>
      ),
    },
  ];

  return <CollapseMenu collapseMenuContents={contents} />;
};

export default Edit;
