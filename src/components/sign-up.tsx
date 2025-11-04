'use client'
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
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useEffect, useRef, useState } from "react"
import { useLoadScript } from "@react-google-maps/api"
import { AuthCredentials } from "types"
import { BrokerRegisterSchema } from "@/lib/schema/signup_schema"


type RegisterFormValues = z.infer<typeof BrokerRegisterSchema>;


export default function SignUpForm({
  setIsOpened,
}: {
  setIsOpened?: (isOpened: boolean) => void
}) {
  const router = useRouter()

const form = useForm<RegisterFormValues>({
  resolver: zodResolver(BrokerRegisterSchema),
  mode: "onSubmit",
  defaultValues: {
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    licenseNum: "",
    role: "broker",
  },
});

  const onSubmit = async (data: AuthCredentials) => {
    try{
      const result = await register(data)
      if (result.success) {
        toast.success("Account Created!");
        router.replace("/broker/dashboard")
      }
      else {
        toast.error("Failed to create account. Please try again.");
      }
    } catch(error){
      toast.error("An error occurred while signing up")
    }
  }
  const addressRef = useRef(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries: ['places'],
  });

  useEffect(() => {
    if (isLoaded && !isGoogleLoaded) {
      const autocomplete = new google.maps.places.Autocomplete(addressRef.current!, {
        types: ['geocode'],
        componentRestrictions: { country: 'us' },
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
        const addressComponents = place.address_components;

        const getComponent = (type) =>
          addressComponents!.find((comp) => comp.types.includes(type))?.long_name || '';

        form.setValue('street', getComponent('street_number') + ' ' + getComponent('route'));
        form.setValue('city', getComponent('locality'));
        form.setValue('state', getComponent('administrative_area_level_1'));
        form.setValue('zip', getComponent('postal_code'));
      });
      setIsGoogleLoaded(true);
    }
  }, [isLoaded]);
    

  return (
<div className="flex justify-center p-4 w-full">
  <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left w-full">
            <FormField
              control={form.control}
              name="fname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
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
                    <Input placeholder="Last Name" {...field} />
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
                    <Input placeholder="Email" {...field} />
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
                    <Input placeholder="Phone" {...field} />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm Password" {...field} />
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
                    <Input {...field} ref={addressRef} placeholder="Street Address"/>
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
                    <Input placeholder="City" {...field} />
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
                    <Input placeholder="State" {...field} />
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
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input placeholder="Zip" {...field} />
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
                    <Input placeholder="Company" {...field} />
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
                    <Input placeholder="License Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
        <div className="mt-5 flex justify-end">
          <Button type="submit" className="text-white px-6 py-2 rounded-md w-1/2 border-white bg-blue-600 hover:bg-blue-700">Sign up</Button>
        </div>
          </form>
        </Form>
    </div>
  )
}