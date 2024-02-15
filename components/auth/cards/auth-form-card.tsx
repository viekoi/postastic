"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { SocialGroup } from "../social-group";
import { BackButton } from "@/components/auth/back-button";
import { Separator } from "@radix-ui/react-separator";

interface AuthFormCardProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const AuthFormCard = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: AuthFormCardProps) => {
  return (
    <Card className="w-full h-full md:h-auto md:w-[400px] flex flex-col justify-center border-none bg-black ">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <SocialGroup />
        </CardFooter>
      )}
      <CardContent>
        <div className="w-full flex items-center justify-center gap-1">
          <Separator className="w-full h-[1px] bg-gray-500" />
          <span className="text-gray-500 leading-[16px]">or</span>
          <Separator className="w-full h-[1px] bg-gray-500" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-1">
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
