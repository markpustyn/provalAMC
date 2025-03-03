"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"
import { z } from "zod"

import { login } from "@/lib/user.actions"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoginSchema } from "@/lib/schema/login_schema"
import { useRouter } from "next/navigation"
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTransition } from "react"


const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm({
  setIsOpened,
}: {
  setIsOpened?: (isOpened: boolean) => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();
  const defaultValues = {
    email: 'demo@gmail.com'
  };

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    const res = await login(data)
    if (res.success) {
      if (setIsOpened) {
        setIsOpened(false)
        signIn('credentials', {
            email: data.email,
            callbackUrl: callbackUrl ?? '/dashboard'
          });
      }
      toast.success('Signed In Successfully!');
      router.push("/dashboard/overview")
    } else {
        toast.warning('Incorrect Email or Password');
    }
  }

  return (
    <>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Email'
                    disabled={loading}
                    {...field}
                  />
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
                    <Input type="password" 
                    placeholder="Password" 
                    {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button disabled={loading} className='ml-auto w-full' type='submit'>
            Login
          </Button>
        </form>
      </Form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
        <Button
                type="button"
                onClick={() => {
                  if (setIsOpened) {
                    // this comes from an intercepted route
                    setIsOpened(false)
                    // i can do a soft navigation to see the modal
                    router.replace("/signup")
                  } else {
                    window.location.replace("/signup") // will cause a full page reload
                  }
                }}
                className="underline text-gray-500 px-0"
                variant={"link"}
              >
                Don{"'"}t have an account? Sign up
              </Button>
        </div>
      </div>
    </>
  );
}
