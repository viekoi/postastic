"use client";
import { UserWithData } from "@/type";
import React from "react";
import UserCard from "../../cards/user/user-card";

interface UserListProps {
  users: UserWithData[];
}

const UserList = ({ users }: UserListProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      {users.map((user) => {
        return <UserCard type="card" user={user} key={user.id} />;
      })}
    </div>
  );
};

export default UserList;
