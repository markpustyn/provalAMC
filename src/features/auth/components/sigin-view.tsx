"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import UserAuthForm from "./user-auth-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Evalu Cloud Login",
};

export default function SignInViewPage() {
  const [role, setRole] = useState<"broker" | "client">("broker");

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Top-right link */}
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 hidden md:right-8 md:top-8"
        )}
      >
        Login
      </Link>

      {/* LEFT: image panel (visible on lg+) */}
      <div className="relative hidden h-full flex-col bg-[#F9FAFB] p-10 dark:border-r lg:flex">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F9FAFB] to-[#E5E7EB]" />
        <div className="relative z-20">
          <Image
            src="/mainLogo.png"
            alt="Evalu Cloud Logo"
            width={500}
            height={250}
            priority
            className="h-auto w-auto"
          />
        </div>
        {/* <div className="relative z-20 mt-auto text-gray-700">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This starter template has saved me countless hours of work
              and helped me deliver projects to my clients faster than ever.&rdquo;
            </p>
            <footer className="text-sm">Random Dude</footer>
          </blockquote>
        </div> */}
      </div>

      {/* RIGHT: form column */}
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          {/* Small-screen logo */}
          <div className="flex items-center justify-center lg:hidden">
            <Image
              src="/mainLogo.png"
              alt="Evalu Cloud Logo"
              width={220}
              height={110}
              priority
              className="h-auto w-auto mb-4"
            />
          </div>



          {/* Heading + helper text */}
          <div className="flex flex-col space-y-1 text-center">
            <h1 className="text-3xl font-semibold tracking-tight mb-4">
              {role === "broker" ? "Vendor Login" : "Client Login"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {role === "broker"
                ? "Sign in to manage orders, uploads, and reports."
                : "Sign in to view orders, statuses, and documents."}
            </p>
          </div>
          {/* Role toggle */}
          <div className="flex w-full items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setRole("broker")}
              aria-pressed={role === "broker"}
              className={cn(
                buttonVariants({ variant: role === "broker" ? "default" : "outline" }),
                "w-full"
              )}
            >
              Vendor Login
            </button>
            <button
              type="button"
              onClick={() => setRole("client")}
              aria-pressed={role === "client"}
              className={cn(
                buttonVariants({ variant: role === "client" ? "default" : "outline" }),
                "w-full"
              )}
            >
              Client Login
            </button>
          </div>
          {/* Auth form */}
          {/* If your UserAuthForm accepts a prop, pass it: <UserAuthForm role={role} /> */}
          {/* Otherwise, we force a remount on role change with `key` and include a hidden field. */}
          <div>
            <UserAuthForm role={role}/>
            {/* If your form doesn't accept props, add a hidden input inside it to submit the role.
               Example (inside your form component):
               <input type="hidden" name="role" value={role} /> */}
          </div>
            <div className='relative'>
        <div className='absolute flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase mt-4'>
          <Link href={`/${role}-sign-up`}>
        <Button
                type="button"
                className="underline text-gray-500 px-0"
                variant={"link"}
              >
                Don{"'"}t have an account? {role.charAt(0).toUpperCase() + role.slice(1)} Sign up
              </Button>
              </Link>
        </div>
      </div>
        </div>

      </div>
    </div>
  );
}
