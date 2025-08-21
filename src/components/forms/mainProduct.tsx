"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OrderSchema } from "@/lib/schema/order_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { GoogleMap, StreetViewPanorama, useLoadScript } from "@react-google-maps/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";

export default function MainProduct() {
const defaultValues = {
  propertyAddress: "",
  propertyCity: "",
  propertyState: "",
  propertyZip: "",
  borrowerName: "",
  borrowerEmail: "",
  borrowerPhoneType: "",
  borrowerPhoneNumber: "",
  mainProduct: "",
  description: "",
  status: "open",
};

  const form = useForm<z.infer<typeof OrderSchema>>({
    resolver: zodResolver(OrderSchema),
    defaultValues,
  });

  const router = useRouter();


  const onSubmit = async (values: z.infer<typeof OrderSchema>) => {
    try {

        const result = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        });

      if (result) {
        toast.success("Order created successfully!");
        router.push(`/client/order/`);
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch {
      toast.error("An error occurred while submitting the form.");
    }
  };

  const addressRef = useRef(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries: ["places"],
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

        form.setValue('propertyAddress', getComponent('street_number') + ' ' + getComponent('route'));
        form.setValue('propertyCity', getComponent('locality'));
        form.setValue('propertyState', getComponent('administrative_area_level_1'));
        form.setValue('propertyZip', getComponent('postal_code'));
      });
      setIsGoogleLoaded(true);
    }
  }, [isLoaded]);

function addDays(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
      {/* LEFT CARD */}
      <Card className="h-full">
        <CardHeader className="pb-2">
          {/* <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle> */}
          <CardDescription>Fill out the details below</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <CardDescription className="mb-2 text-xl font-bold">Subject Property</CardDescription>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    name="propertyAddress"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          {/* ensure RHF ref + local ref both receive the element */}
                          <Input
                            {...field}
                            ref={addressRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="propertyCity"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="propertyState"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="propertyZip"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <CardDescription className="mb-2 text-xl font-bold">Borrower Info</CardDescription>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    name="borrowerName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="borrowerEmail"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="borrowerPhoneType"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Phone Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mobile">Mobile</SelectItem>
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="work">Work</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="borrowerPhoneNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <CardDescription className="mb-2 text-xl font-bold">Product Type</CardDescription>
                <FormField
                  control={form.control}
                  name="mainProduct"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {[
                            {
                              value: "rushExterior",
                              label: "Rush Three Day Exterior Property Inspection",
                              price: "$35",
                              date: addDays(3),
                            },
                            {
                              value: "exterior",
                              label: "Exterior Property Inspection",
                              price: "$30",
                              date: addDays(5),
                            },
                            {
                              value: "interior",
                              label: "Interior Property Inspection",
                              price: "$75",
                              date: addDays(6),
                            },
                          ].map((opt) => (
                            <button
                              type="button"
                              key={opt.value}
                              onClick={() => field.onChange(opt.value)}
                              className={`text-left rounded-xl border p-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 ${
                                field.value === opt.value
                                  ? "border-blue-600 bg-blue-50 ring-blue-200"
                                  : "border-gray-300 hover:border-blue-400"
                              }`}
                            >
                              <p className="font-medium leading-5">{opt.label}</p>
                              <p className="mt-1 text-gray-900">{opt.price}</p>
                              <p className="text-xs text-gray-600">Due: {opt.date}</p>
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <CardDescription className="mb-2 text-xl font-bold">Additional Info</CardDescription>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter description" className="min-h-28" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                <Button type="submit" className="text-md">
                  Next
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

            {/* RIGHT CARD (kept blank, aligned height) */}
        <Card className="h-full">
        <CardHeader>
            <CardDescription>Street View</CardDescription>
        </CardHeader>
        <CardContent>

        </CardContent>
        </Card>

    </div>
  );
}
