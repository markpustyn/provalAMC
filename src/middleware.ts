// middleware.ts
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Not authenticated -> send to login with callback
  if (!req.auth) {
    return NextResponse.redirect(
      new URL(`/?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
    );
  }

  // const role = req.auth.user.role as "admin" | "broker" | "client" | undefined;
  // if (!role) {
  //   return NextResponse.redirect(new URL("/unauthorized", req.url));
  // }

  // // Route guards by prefix
  // if (pathname.startsWith("/admin") && role !== "admin") {
  //   return NextResponse.redirect(new URL("/unauthorized", req.url));
  // }

  // if (pathname.startsWith("/broker/dashboard") && role !== "broker") {
  //   return NextResponse.redirect(new URL("/unauthorized", req.url));
  // }

  // if (pathname.startsWith("/client") && role !== "client") {
  //   return NextResponse.redirect(new URL("/unauthorized", req.url));
  // }

  return NextResponse.next();
});

// Protect these routes
export const config = {
  matcher: ["/admin/:path*", "/broker/dashboard/:path*", "/client/:path*"],
};
