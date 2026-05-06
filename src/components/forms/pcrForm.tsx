'use client'
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FetchImages } from "@/app/broker/dashboard/order/upload/fetchImg";
import { useEffect } from "react";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";

const FormSchema = z.object({
  inspector: z.string().min(1, "Inspector name is required"),
  date: z.string().min(1, "Inspection date is required"),
  notes: z.string().optional(),
  items: z.array(z.string()).min(1, "Select at least one property type"),
  subjectCondition: z.string().optional(),
  repairsNeeded: z.string().optional(),
  occupancy: z.string().optional(),
  propertyType: z.string().optional(),
  stories: z.string().optional(),
  neighborhood: z.string().optional(),
  neighborhoodConformity: z.string().optional(),
  viewFactors: z.string().optional(),
  commonElements: z.string().optional(),
});
const items = [
  { id: "Single Family", label: "Single Family" },
  { id: "Multi Family", label: "Multi Family" },
  { id: "Condo", label: "Condo" },
  { id: "Vacant Land", label: "Vacant Land" },
];

export default function PcrForm({ OrderDetails, session }) {
  
  useEffect(() => {
  async function loadFormData() {
    const res = await fetch(`/api/order/${OrderDetails.orderId}`);
    if (res.ok) {
      const { data } = await res.json();
      form.reset(data);
    }
  }

  loadFormData();
}, [OrderDetails.orderId]);
const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
      defaultValues: {
        inspector: '',
        date: '',
        notes: '',
        items: [],
        subjectCondition: '',
        repairsNeeded: '',
        occupancy: '',
        propertyType: '',
        stories: '',
        neighborhood: '',
        neighborhoodConformity: '',
        viewFactors: '',
        commonElements: '',
      },

  })

async function onSubmit(values: z.infer<typeof FormSchema>) {
        try {
        const res = await fetch(`/api/order/${OrderDetails.orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values, ),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        toast.success("Order Submitted! ");
        await fetch(`/api/order/${OrderDetails.orderId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        router.push('/broker/dashboard/order')
      } catch (error) {
        console.error("Error submitting form:", error);
      }
  }
async function onSave() {
    const values = form.getValues()
        try {
        const res = await fetch(`/api/order/${OrderDetails.orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        toast.success("Order Saved! ");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 text-black">
      <h2 className="text-4xl font-bold text-center py-12">Property Condition Report</h2>

      <div>
        <h3 className="text-2xl font-bold text-black border-b pb-1">Address</h3>
        <p className="font-medium">
          {OrderDetails.propertyAddress} {OrderDetails.propertyCity}, {OrderDetails.propertyState} {OrderDetails.propertyZip}
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-black border-b pb-1">Other Details</h3>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <p className="text-black font-bold">Property</p>
            <p className="font-medium">{OrderDetails.orderType || "N/A"}</p>
          </div>
          <div>
            <p className="text-black font-bold">Due Date</p>
            <p className="font-medium">{OrderDetails.requestedDueDate || "N/A"}</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form id="reportForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="inspector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-xl'>Inspector Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold text-xl'>Inspection Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
            </div>

          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                <FormLabel className='font-bold text-xl'>Property Type</FormLabel>
                <FormDescription>Select all applicable conditions</FormDescription>
                <div className="space-y-2">
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="items"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3">
                          <FormControl>
                            <Checkbox
                               checked={field.value?.includes(item.id)}
                               onCheckedChange={(checked) => {
                                 return checked
                                   ? field.onChange([...field.value, item.id])
                                   : field.onChange(
                                       field.value?.filter( 
                                         (value) => value !== item.id
                                       )
                                     )
                               }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
                control={form.control}
                name="subjectCondition"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className='font-bold text-xl'>Subject Condition</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                        >
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                            <RadioGroupItem value="New" />
                            </FormControl>
                            <Label>New</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                            <RadioGroupItem value="Like New" />
                            </FormControl>
                            <Label>Like New</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                            <RadioGroupItem value="Good" />
                            </FormControl>
                            <Label>Good</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                            <RadioGroupItem value="Fair" />
                            </FormControl>
                            <Label>Fair</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                            <RadioGroupItem value="Poor" />
                            </FormControl>
                            <Label>Poor</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                            <RadioGroupItem value="Bad" />
                            </FormControl>
                            <Label>Bad</Label>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem> 
                )}
                />
              <FormField
                control={form.control}
                name="repairsNeeded"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className='font-bold text-xl'>Repairs Needed</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                        >
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                            <RadioGroupItem value="New" />
                            </FormControl>
                            <Label>New</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                            <RadioGroupItem value="Like New" />
                            </FormControl>
                            <Label>Like New</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                            <RadioGroupItem value="None" />
                            </FormControl>
                            <Label>None Required</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                            <RadioGroupItem value="Minor Reparis Needed" />
                            </FormControl>
                            <Label>Minor Repairs</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3">
                            <FormControl>
                            <RadioGroupItem value="Major Reparis Needed" />
                            </FormControl>
                            <Label>Major Repairs</Label>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem> 
                )}
                /> 
                <FormField
                control={form.control}
                name="occupancy"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className='font-bold text-xl'>Occupancy</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                        >
                        <FormItem className="flex items-center space-x-3">
                    <FormControl><RadioGroupItem value="Occupied" /></FormControl>
                    <Label>Occupied</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Vacant" /></FormControl>
                    <Label>Vacant</Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
                    <FormMessage />
                    </FormItem> 
                )}
                />
                <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className='font-bold text-xl'>Property Type</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                        >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Residential" /></FormControl>
                    <Label>Residential</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Commercial" /></FormControl>
                    <Label>Commercial</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Industrial" /></FormControl>
                    <Label>Industrial</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Agricultural" /></FormControl>
                    <Label>Agricultural</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Mixed Use" /></FormControl>
                    <Label>Mixed Use</Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
                    <FormMessage />
                    </FormItem> 
                )}
                />
                <FormField
                control={form.control}
                name="stories"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className='font-bold text-xl'>Number of Stories</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                        >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="1" /></FormControl>
                    <Label>1</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="2" /></FormControl>
                    <Label>2</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="3+" /></FormControl>
                    <Label>3+</Label>
                  </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem> 
                )}
                /> 
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className='font-bold text-xl'>Neighborhood</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                        >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Urban" /></FormControl>
                    <Label>Urban</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Suburban" /></FormControl>
                    <Label>Suburban</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Rural" /></FormControl>
                    <Label>Rural</Label>
                  </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem> 
                )}
                /> 
                <FormField
                control={form.control}
                name="neighborhoodConformity"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className='font-bold text-xl'>Neighborhood Conformity</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                        >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Good" /></FormControl>
                    <Label>Good</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Average" /></FormControl>
                    <Label>Average</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Fair" /></FormControl>
                    <Label>Fair</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Poor" /></FormControl>
                    <Label>Poor</Label>
                  </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem> 
                )}
                /> 
                <FormField
                control={form.control}
                name="viewFactors"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className='font-bold text-xl'>View Factors</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                        >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Street" /></FormControl>
                    <Label>Street</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Park" /></FormControl>
                    <Label>Park</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Lake" /></FormControl>
                    <Label>Lake</Label>
                  </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem> 
                )}
                /> 
                <FormField
                control={form.control}
                name="commonElements"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className='font-bold text-xl'>Common Elements</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                        >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Pool" /></FormControl>
                    <Label>Pool</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Gym" /></FormControl>
                    <Label>Gym</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value="Clubhouse" /></FormControl>
                    <Label>Clubhouse</Label>
                  </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem> 
                )}
                /> 
          <div>
          </div>
          </div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Any additional notes..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <FetchImages userId={session?.user?.id!} propId={OrderDetails.orderId} />
                <div className="flex justify-end gap-4 mx-auto">
              <Button type="button" className="px-6 py-2 font-semibold border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg shadow-sm" onClick={()=> onSave()}>Save</Button>
              <Button type="submit" className="px-6 py-2 font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm" form="reportForm" onClick={() => router.push('/')}>Submit Report</Button>
            </div>
    </div>
  );
}


