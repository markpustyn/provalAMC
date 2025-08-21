'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/constants/mock-api';
import { createOrder } from '@/lib/admin/order';
import { OrderSchema } from '@/lib/schema/order_schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useLoadScript } from "@react-google-maps/api";
import { useEffect, useRef, useState } from 'react';


export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const defaultValues = {
    loanNumber: '',
    loanOfficer: '',
    loanOfficerEmail: '',
    lender: '',
    lenderAddress: '',
    lenderCity: '',
    lenderZip: '',
    borrowerName: '',
    borrowerEmail: '',
    borrowerPhoneType: '',
    borrowerPhoneNumber: '',
    propertyAddress: '',
    propertyCity: '',
    propertyState: '', // ✅ Added missing field
    propertyZip: '',
    orderType: '',
    propertyType: '',
    presentOccupancy: '',
    loanPurpose: '',
    loanType: '',
    mainProduct: '',
    requestedDueDate: '', // ✅ Ensure correct format if needed
    description: '',
    status: 'open',
  };
  
  const form = useForm<z.infer<typeof OrderSchema>>({
    resolver: zodResolver(OrderSchema),
    defaultValues, // Default values for form fields
  });
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof OrderSchema>, ) => {
    
    try {
      const result = await createOrder(values);
      
      if (result.success) {
        toast.success("Order created successfully!");
        router.push(`/admin/order/${result.data.orderId}`);
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  };

  
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

        form.setValue('propertyAddress', getComponent('street_number') + ' ' + getComponent('route'));
        form.setValue('propertyCity', getComponent('locality'));
        form.setValue('propertyState', getComponent('administrative_area_level_1'));
        form.setValue('propertyZip', getComponent('postal_code'));
      });
      setIsGoogleLoaded(true);
    }
  }, [isLoaded]);
  return (
    <Card className='mx-auto w-3/4'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {/* <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <div className='space-y-6'>
                  <FormItem className='w-full'>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value }
                        onValueChange={field.onChange}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                        // disabled={loading}
                        // progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        // disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            /> */}
            <CardDescription className='text-xl font-bold'>Client Information</CardDescription>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <FormField name='loanNumber' control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
              <FormField name='loanOfficer' control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Loan Officer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name='loanOfficerEmail' control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Loan Officer Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <CardDescription className='text-xl font-bold'>Lender Info</CardDescription>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <FormField name='lender' control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Lender</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name='lenderAddress' control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Lender Street Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name='lenderCity' control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Lender City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name='lenderZip' control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Lender Zip Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <CardDescription className='text-xl font-bold'>Borrower Info</CardDescription>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <FormField name='borrowerName' control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name='borrowerEmail' control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name='borrowerPhoneType' control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Type</FormLabel>
                  <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                  <SelectTrigger>
                      <SelectValue placeholder='' />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value='mobile'>Mobile</SelectItem>
                    <SelectItem value='home'>Home</SelectItem>
                    <SelectItem value='work'>Work</SelectItem>
                  </SelectContent></Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name='borrowerPhoneNumber' control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <CardDescription className='text-xl font-bold'>Subject Property</CardDescription>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <FormField name='propertyAddress' control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input {...field} ref={addressRef} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name='propertyCity' control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name='propertyState' control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name='propertyZip' control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
                <FormField
                control={form.control}
                name='orderType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Order Type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Residential'>Residential</SelectItem>
                        <SelectItem value='Commercial'>Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='propertyType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Property Type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='SFR'>SFR</SelectItem>
                        <SelectItem value='Condo'>Condo</SelectItem>
                        <SelectItem value='Multifamily'>Multifamily</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='presentOccupancy'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Present Occupancy</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Occupancy' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Occupied'>Occupied</SelectItem>
                        <SelectItem value='Vacant'>Vacant</SelectItem>
                        <SelectItem value='Tenants'>Tenants</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <CardDescription className='text-xl font-bold'>Subject Property</CardDescription>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <FormField control={form.control} name='loanPurpose' render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Purpose</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Loan purpose' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Home-Equity'>Home Equity</SelectItem>
                      <SelectItem value='HELOC'>HELOC</SelectItem>
                      <SelectItem value='Purchase'>Purchase</SelectItem>
                      <SelectItem value='Refinance'>Refinance</SelectItem>
                      <SelectItem value='Other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name='loanType' render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Loan type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='FHA'>FHA</SelectItem>
                      <SelectItem value='Conventional'>Conventional</SelectItem>
                      <SelectItem value='Other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name='mainProduct' render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Product</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Main product' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='1004-SFR'>1004 SFR</SelectItem>
                      <SelectItem value='BPO'>BPO</SelectItem>
                      <SelectItem value='PCR'>PCR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
                <FormField
                  control={form.control}
                  name="requestedDueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requested Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <CardDescription className='text-xl font-bold'>Product Type</CardDescription>
            <div className='grid grid-cols-4 items-center gap-4 w-1/2'>
              <FormField
                control={form.control}
                name="mainProduct"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Order Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select inspection type" />
                        </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="exterior">
                                <div className="flex justify-between w-full">
                                  <span>PCR Exterior Property Inspection</span>
                                  <span className="ml-2">$30</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="interior">
                                <div className="flex justify-between w-full">
                                  <span>IPCR Interior Property Inspection</span>
                                  <span className="ml-2">$65</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="bpo" disabled>
                                <div className="flex justify-between w-full">
                                  <span>Broker Priced Opinion</span>
                                  <span className="ml-2">$60</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="apprasial" disabled>
                                <div className="flex justify-between w-full">
                                  <span>1004 Appraisal</span>
                                  <span className="ml-2">$400</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="ace-pdr" disabled>
                                <div className="flex justify-between w-full">
                                  <span>ACE + PDR</span>
                                  <span className="ml-2">$250</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
          </div>
            <CardDescription className='text-xl font-bold'>Additional Info</CardDescription>
            <div className='grid grid-cols-4 items-center gap-4'>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter description"
                      className="col-span-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
