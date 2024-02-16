import { auth } from "./auth";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes } from "@/routes";
import { NextResponse } from "next/server";

export default auth((req) => {
  console.log("💩💩💩💩");
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (!isAuthRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isApiAuthRoute && isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
