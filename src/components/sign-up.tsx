"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"
import { z } from "zod"

import { register } from "@/lib/user.actions"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from 'sonner';
import { RegisterSchema } from "@/lib/schema/signup_schema"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export default function SignUpForm({
  setIsOpened,
}: {
  setIsOpened?: (isOpened: boolean) => void
}) {
  const router = useRouter()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      licenseNum: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  })

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    const res = await register(data)
    if (res.success) {
      if (setIsOpened) {
        setIsOpened(false)
      }

      router.replace("/dashboard/overview")
    } else {
      toast.error(res.message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Signup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
        </div>
        <div className="flex gap-2 items-center justify-center my-2">
          <div className="w-full h-[0.5px] bg-primary " />
          <span className="text-sm text-gray-500">OR</span>
          <div className="w-full h-[0.5px] bg-primary " />
        </div>
        <p className="text-sm text-center text-gray-500 my-2">
          Sign up with your email and password
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="fname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
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
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licenseNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button
                type="button"
                onClick={() => {
                  if (setIsOpened) {
                    setIsOpened(false)
                    router.replace("/signin")
                  } else {
                    window.location.replace("/signin")
                  }
                }}
                className="underline text-gray-500 px-0"
                variant={"link"}
              >
                Already have an account? Sign in
              </Button>
            </div>
            <Button type="submit">Sign up</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}