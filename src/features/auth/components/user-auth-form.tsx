"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/lib/schema/login_schema";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getSession, signIn } from "next-auth/react";
import { useTransition } from "react";

type Props = {
  role: "broker" | "client" | "admin";
  setIsOpened?: (open: boolean) => void;
};

export default function UserAuthForm({ role, setIsOpened }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Incorrect Email or Password");
      return;
    }
    const session = await getSession();
    const sessionRole = session?.user?.role as "admin" | "broker" | "client" | undefined;

    if (sessionRole === "admin") {
      router.replace("/admin");
    } else if (!sessionRole || sessionRole !== role) {
      toast.error("Incorrect Email or Password");
      return;
    }

    if (setIsOpened) setIsOpened(false);


    const dest = callbackUrl ?? (role === "broker" ? "/broker/dashboard" : "/client");
    router.replace(dest)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* Pass role along if your credentials authorize() needs it */}
        <input type="hidden" name="role" value={role} />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loading} className="ml-auto w-full" type="submit">
          Login
        </Button>
      </form>
    </Form>
  );
}
