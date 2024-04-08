"use client";

import TabMenu from "./tab";
import EditUserProfileForm from "../forms/profile/edit-user-profile-form";


import SecuritySettingAccordion from "../accordions/security-setting-accordion";
import { SessionUser } from "@/type";

interface SettingsTabProps {
  user: SessionUser;
  isEdit: boolean;
  setIsEdit: () => void;
}

const SettingsTab = ({ user, isEdit, setIsEdit }: SettingsTabProps) => {
  const tabValues = ["profile", "security"];
  const tabContents = [
    <>
      <EditUserProfileForm setIsEdit={setIsEdit} isEdit={isEdit} user={user} />
    </>,
    <>
      <SecuritySettingAccordion user={user} />
    </>,
  ];

  return <TabMenu tabContents={tabContents} tabValues={tabValues} />;
};

export default SettingsTab;
