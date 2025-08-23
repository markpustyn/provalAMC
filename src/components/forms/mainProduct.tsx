'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { GoogleMap, StreetViewPanorama, useLoadScript } from "@react-google-maps/api";
import { toast } from "sonner";
import { OrderSchema } from "@/lib/schema/order_schema";
import { useRouter } from "next/navigation";
import CheckOutPage from "../checkout";
import { Elements } from "@stripe/react-stripe-js";
import { stripe } from "@/lib/stripe";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutContainer from "../checkout";


// ---------- Component ----------
export default function MainProduct() {
  // form
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
    unitNumber: "",
    status: "open",
  };

  const form = useForm<z.infer<typeof OrderSchema>>({
    resolver: zodResolver(OrderSchema),
    defaultValues,
    mode: "onChange",
  });

  const router = useRouter();

  // google maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries: ["places"],
  });

  const addressRef = useRef<HTMLInputElement | null>(null);
  const [isAutocompleteInit, setIsAutocompleteInit] = useState(false);

  const defaultCenter = { lat: 37.7749, lng: -122.4194 };
  const [panoPos, setPanoPos] = useState<{ lat: number; lng: number } | null>(null);

  const setAddressFromPlace = useCallback(
    (place: google.maps.places.PlaceResult) => {
      if (!place?.geometry) return;
      const comps = place.address_components ?? [];
      const get = (t: string) => comps.find((c) => c.types.includes(t))?.long_name || "";

      form.setValue(
        "propertyAddress",
        [get("street_number"), get("route")].filter(Boolean).join(" ").trim(),
        { shouldValidate: true }
      );
      form.setValue("propertyCity", get("locality") || get("postal_town"), { shouldValidate: true });
      form.setValue("propertyState", get("administrative_area_level_1"), { shouldValidate: true });
      form.setValue("propertyZip", get("postal_code"), { shouldValidate: true });

      const loc = place.geometry.location!;
      setPanoPos({ lat: loc.lat(), lng: loc.lng() });
    },
    [form]
  );

  useEffect(() => {
    if (!isLoaded || isAutocompleteInit || !addressRef.current) return;

    const ac = new google.maps.places.Autocomplete(addressRef.current!, {
      types: ["geocode"],
      componentRestrictions: { country: "us" },
      fields: ["address_components", "geometry"],
    });

    ac.addListener("place_changed", () => setAddressFromPlace(ac.getPlace()));
    setIsAutocompleteInit(true);
  }, [isLoaded, isAutocompleteInit, setAddressFromPlace]);

  const geocodeCurrentAddress = async () => {
    if (!isLoaded) return;
    const addr = [
      form.getValues("propertyAddress"),
      form.getValues("propertyCity"),
      form.getValues("propertyState"),
      form.getValues("propertyZip"),
    ]
      .filter(Boolean)
      .join(", ");

    if (!addr.trim()) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: addr }, (results, status) => {
      if (status === "OK" && results?.[0]?.geometry?.location) {
        const loc = results[0].geometry.location;
        setPanoPos({ lat: loc.lat(), lng: loc.lng() });
      }
    });
  };

  // section gating
  const [mapOpen, setMapOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const addressValid =
    !!form.watch("propertyAddress") &&
    !!form.watch("propertyCity") &&
    !!form.watch("propertyState") &&
    !!form.watch("propertyZip");


  const addDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const onSubmit = async (values: z.infer<typeof OrderSchema>) => {
    try {
      const result = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values }),
      });

      if (result.ok) {
        toast.success("Order created successfully!");
        router.push(`/client/order/`);
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch {
      toast.error("An error occurred while submitting the form.");
    }
  };
  const PRODUCT_CATALOG: Record<string, { label: string; amountCents: number }> = {
  rushExterior: { label: "Rush Three Day Exterior", amountCents: 3500 },
  exterior:     { label: "Exterior Inspection",      amountCents: 3000 },
  interior:     { label: "Interior Inspection",      amountCents: 7500 },
};
const mainProduct = form.watch("mainProduct");
const amountCents = mainProduct ? PRODUCT_CATALOG[mainProduct]?.amountCents ?? 0 : 0;

  return (
    <div className="mx-auto">
      {/* 1) ADDRESS */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="flex-1 space-y-10">
                  <Card>
        <CardHeader>
          <CardDescription className="text-2xl font-semibold text-black">Subject Property Address</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                <div className="flex gap-4">
                    <div className="flex-1">
                    <FormField
                name="propertyAddress"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=""
                        ref={(el) => {
                          field.ref(el);
                          addressRef.current = el;
                        }}
                        onBlur={(e) => {
                          field.onBlur();
                          geocodeCurrentAddress();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <div className="w-24">
              <FormField
                name="unitNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit #</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onBlur={(e) => {
                          field.onBlur();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  name="propertyCity"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input {...field} onBlur={geocodeCurrentAddress} /></FormControl>
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
                      <FormControl><Input {...field} onBlur={geocodeCurrentAddress} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="propertyZip"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP</FormLabel>
                      <FormControl><Input {...field} onBlur={geocodeCurrentAddress} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
              <Card id="details-section">
          <CardHeader>
            <CardDescription className="text-2xl font-semibold text-black">Borrower Info</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Borrower */}
                <div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      name="borrowerName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="md:col-span-1">
                          <FormLabel>Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
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
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="borrowerPhoneNumber"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="md:col-span-1">
                          <FormLabel>Phone</FormLabel>
                          <FormControl><Input type="tel" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Product */}
                <div>
                  <div className="mb-2 text-xl font-bold">Product Type</div>
                  <FormField
                    control={form.control}
                    name="mainProduct"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                              { value: "rushExterior", label: "Rush Three Day Exterior Property Inspection", price: "$35", date: addDays(3) },
                              { value: "exterior", label: "Exterior Property Inspection", price: "$30", date: addDays(5) },
                              { value: "interior", label: "Interior Property Inspection", price: "$75", date: addDays(6) },
                            ].map((opt) => (
                              <button
                                type="button"
                                key={opt.value}
                                onClick={() => field.onChange(opt.value)}
                                className={`text-left rounded-xl border p-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 ${
                                  field.value === opt.value ? "border-blue-600 bg-blue-50 ring-blue-200" : "border-gray-300 hover:border-blue-400"
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

                {/* Additional */}
                <div>
                  <div className="mb-2 text-xl font-bold">Additional Info</div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea {...field} placeholder="Enter description" className="min-h-28" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="text-right">
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Place Order</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        </div>
        <div className="w-full lg:w-[520px] xl:w-[640px] shrink-0 lg:sticky lg:top-6 space-y-10">
            <Card>
                <CardHeader>
                    <CardDescription className="text-base font-medium"></CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="rounded-xl border overflow-hidden">
                    <div className="w-full h-80">
                        {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "100%" }}
                            center={panoPos ?? defaultCenter}
                            zoom={panoPos ? 15 : 12}
                            options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
                        >
                            {panoPos && (
                            <StreetViewPanorama
                                options={{
                                position: panoPos,
                                pov: { heading: 0, pitch: 0 },
                                zoom: 1,
                                visible: true,
                                addressControl: false,
                                linksControl: false,
                                panControl: false,
                                enableCloseButton: false,
                                }}
                            />
                            )}
                        </GoogleMap>
                        ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">Loading map…</div>
                        )}
                    </div>
                    </div>
                </CardContent>
                </Card>
            <Card>
                <CardHeader>
                    <CardDescription className="text-base font-medium">Payment Options</CardDescription>
                </CardHeader>
                <CardContent>
                    {!mainProduct ? (
                    <div className="text-sm text-gray-600">Select a product to initialize payment.</div>
                    ) : (
                    <>
                        <div className="mb-2 text-sm">
                        Selected: {PRODUCT_CATALOG[mainProduct].label} — ${(amountCents / 100).toFixed(2)}
                        </div>
                        <CheckoutContainer product={mainProduct} order={form.getValues()} />
                    </>
                    )}
                </CardContent>
                </Card>
        </div>
                

    </div>
    </div>
  );
}
