'use client';

import { FileUploader } from '@/components/file-uploader';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = z.object({
  image: z
    .any()
    .optional() // Make image optional
    .refine(
      (files) => !files || files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => !files || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  loanNumber: z.string().optional(), // Make loanNumber optional
  loanOfficer: z.string().optional(), // Make loanOfficer optional
  loanOfficerEmail: z.string().email().optional(), // Make loanOfficerEmail optional
  lender: z.string().optional(), // Make lender optional
  lenderAddress: z.string().optional(), // Make lenderAddress optional
  lenderCity: z.string().optional(), // Make lenderCity optional
  lenderZip: z.string().optional(), // Make lenderZip optional
  borrowerName: z.string().optional(), // Make borrowerName optional
  borrowerEmail: z.string().email().optional(), // Make borrowerEmail optional
  borrowerPhoneType: z.string().optional(), // Make borrowerPhoneType optional
  borrowerPhoneNumber: z.string().optional(), // Make borrowerPhoneNumber optional
  propertyAddress: z.string().optional(), // Make propertyAddress optional
  propertyCity: z.string().optional(), // Make propertyCity optional
  propertyZip: z.string().optional(), // Make propertyZip optional
  orderType: z.string().optional(), // Make orderType optional
  propertyType: z.string().optional(), // Make propertyType optional
  presentOccupancy: z.string().optional(), // Make presentOccupancy optional
  loanPurpose: z.string().optional(), // Make loanPurpose optional
  loanType: z.string().optional(), // Make loanType optional
  mainProduct: z.string().optional(), // Make mainProduct optional
  requestedDueDate: z.string().optional(), // Make requestedDueDate optional
});
  

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
    propertyZip: '',
    orderType: '',
    propertyType: '',
    presentOccupancy:'',
    loanPurpose: '',
    loanType: '',
    mainProduct: '',
    requestedDueDate: '',
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted");
    console.log(values);
  }

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
            <FormField
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
            />
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
                <FormItem><FormLabel>Street Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name='propertyCity' control={form.control} render={({ field }) => (
                <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name='propertyZip' control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
                          <SelectValue placeholder='Select Order Type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='residential'>Residential</SelectItem>
                        <SelectItem value='commercial'>Commercial</SelectItem>
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
                          <SelectValue placeholder='Select Property Type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='sfr'>SFR</SelectItem>
                        <SelectItem value='condo'>Condo</SelectItem>
                        <SelectItem value='multifamily'>Multifamily</SelectItem>
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
                          <SelectValue placeholder='Select Present Occupancy' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='occupied'>Occupied</SelectItem>
                        <SelectItem value='vacant'>Vacant</SelectItem>
                        <SelectItem value='tenants'>Tenants</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <CardDescription className='text-xl font-bold'>Subject Property</CardDescription>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <FormField control={form.control} name='orderType' render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select order type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='residential'>Residential</SelectItem>
                      <SelectItem value='commercial'>Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name='loanPurpose' render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Purpose</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select loan purpose' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='home-equity'>Home Equity</SelectItem>
                      <SelectItem value='heloc'>HELOC</SelectItem>
                      <SelectItem value='purchase'>Purchase</SelectItem>
                      <SelectItem value='refinance'>Refinance</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
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
                        <SelectValue placeholder='Select loan type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='fha'>FHA</SelectItem>
                      <SelectItem value='conventional'>Conventional</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
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
                        <SelectValue placeholder='Select main product' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='1004-sfr'>1004 SFR</SelectItem>
                      <SelectItem value='bpo'>BPO</SelectItem>
                      <SelectItem value='pcr'>PCR</SelectItem>
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
            <Button type='submit'>Next</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
