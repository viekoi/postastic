"use client";

import Link from "next/link";

import { Button } from "../ui/button";

interface BackButtonProps {
  href: string;
  label: string;
  isPending?:boolean
}

export const BackButton = ({ href, label,isPending }: BackButtonProps) => {

  return (
    <Button disabled={isPending} className="font-normal w-full">
      <Link href={href}>{label}</Link>
    </Button>
  );
};
