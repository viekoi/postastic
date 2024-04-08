"use client";
import React from "react";
import CollapseMenu from "./accordion";
import NewPasswordForm from "../forms/security/new-password-form";

import NewEmailForm from "../forms/security/new-email-form";
import { SessionUser } from "@/type";

interface EditProps {
  user: SessionUser;
}

const SecuritySettingAccordion = ({ user }: EditProps) => {
  const contents = [
    {
      value: "email",
      triggerText: "Change your email ?",
      content: (
        <>
          <NewEmailForm user={user} />
        </>
      ),
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

export default SecuritySettingAccordion;
