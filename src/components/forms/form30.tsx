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
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  inspector: z.string().min(1, "Inspector name is required"),
  date: z.string().min(1, "Inspection date is required"),

  notes: z.string().min(1, "Notes are required"),

  propertyType: z.string().min(1, "Select property type"),

  propertyUse: z.string().min(1, "Property type is required"),

  subjectCondition: z.string().min(1, "Subject condition is required"),
  occupancy: z.string().min(1, "Occupancy is required"),
  occupiedBy: z.string().min(1, "Occupied by is required"),


  stories: z.string().min(1, "Stories is required"),

  significantDamages: z.string().min(1, "Significant damages is required"),

  structuralIssues: z.array(z.string()).min(1, "Select at least one structural issue"),
  structuralIssuesNotes: z.string().optional(),

  neighborhoodConformity: z.string().min(1, "Neighborhood conformity is required"),
  neighborhoodCondition: z.string().min(1, "Neighborhood condition is required"),

  signage: z.array(z.string()).min(1, "Select at least one item present"),
  signageNotes: z.string().optional(),

  detachStructures: z.string().min(1, "Detached structures is required"),
})

const items = [
  { id: "Single Family", label: "Single Family" },
  { id: "Multi Family", label: "Multi Family" },
  { id: "Condo", label: "Condo" },
  { id: "Vacant Land", label: "Vacant Land" },
  { id: "Mixed Use", label: "Mixed Use" },
];

export default function NewForm30({ OrderDetails, session }) {
  
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
      propertyUse: '',
      propertyType: '',
      subjectCondition: '',
      occupancy: '',
      occupiedBy: '',
      stories: '',
      significantDamages: '',
      structuralIssues: [],
      structuralIssuesNotes: '',
      neighborhoodConformity: '',
      neighborhoodCondition: '',
      signage: [],
      signageNotes: '',
      detachStructures: '',
    },
  })
  const structuralOptions = [
  { id: "Boarded Up Windows", label: "Boarded Up Windows" },
  { id: "Boarded Up Doors", label: "Boarded Up Doors" },
  { id: "Damage to Foundation", label: "Damage to Foundation" },
  { id: "Disconnected Gutters", label: "Disconnected Gutters" },
  { id: "Tarp on Roof", label: "Tarp on Roof" },
  { id: "No Issues Visible", label: "None" },
]
const signageOptions = [
  { id: "For Sale Sign", label: "For Sale Sign" },
  { id: "Exterior Damage", label: "Exterior Damage" },
  { id: "Deferred Lawn Maintenance", label: "Deferred Lawn Maintenance" },
  { id: "Abandoned Vehicles", label: "Abandoned Vehicles" },
  { id: "None Noted", label: "None" },
]


  async function onSubmit(values: z.infer<typeof FormSchema>) {
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
      toast.success("Order Submitted! ");
      await fetch(`/api/order/${OrderDetails.orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      router.push('/broker/dashboard/order')
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit order");
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
      toast.error("Failed to save order");
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-4xl font-bold text-center py-12">Property Condition Report</h2>

      {/* Address Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-3">Address</h3>
        <p className="font-medium text-lg">
          {OrderDetails.propertyAddress} {OrderDetails.propertyCity}, {OrderDetails.propertyState} {OrderDetails.propertyZip}
        </p>
      </div>

      {/* Other Details Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-3">Other Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="font-bold text-gray-600">Property</p>
            <p className="font-medium text-lg">{OrderDetails.orderType || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-gray-600">Due Date</p>
            <p className="font-medium text-lg">{OrderDetails.requestedDueDate || "N/A"}</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form id="reportForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Inspector Information Section */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-6">Inspector Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="inspector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-lg'>Vendor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-lg'>Inspection Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Property Classification Section */}
<div className="bg-white border-2 border-gray-200 rounded-lg p-6">
  <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-6">
    Property Classification
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Property Type (single select) */}
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">Property Type</FormLabel>
              <FormDescription>Select one type</FormDescription>

              <div className="space-y-3 mt-2">
                {items.map((item) => (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value === item.id}
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? item.id : "")
                        }}
                      />
                    </FormControl>

                    <FormLabel
                      className="text-sm font-normal cursor-pointer"
                      onClick={() => field.onChange(item.id)}
                    >
                      {item.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

    {/* Property Use (different field name) */}
    <FormField
      control={form.control}
      name="propertyUse"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold text-lg">Property Use</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col space-y-2"
            >
              {["Residential", "Commercial", "Industrial", "Agricultural", "Mixed Use"].map(
                (v) => (
                  <FormItem key={v} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={v} />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">{v}</FormLabel>
                  </FormItem>
                )
              )}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Stories */}
    <FormField
      control={form.control}
      name="stories"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold text-lg">Number of Stories</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col space-y-2"
            >
              {["1", "2", "3+"].map((v) => (
                <FormItem key={v} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={v} />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">{v}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
</div>


          {/* Property Condition Section */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-6">Property Condition</h3>
            
            <FormField
              control={form.control}
              name="subjectCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-lg'>General Condition</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2 mt-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="C1: New or like-new with no wear or repairs needed" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">C1: New or like-new with no wear or repairs needed</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="C2: Minimal wear and no significant deferred maintenance" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">C2: Minimal wear and no significant deferred maintenance</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="C3: Normal wear and tear and all components functional " />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">C3: Normal wear and tear and all components functional</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="C4: Livable but shows deferred maintenance" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">C4: Livable but shows deferred maintenance</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="C5: Major repairs needed; condition impacts livability" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">C5: Major repairs needed; condition impacts livability</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="C6: Severely damaged or uninhabitable" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">C6: Severely damaged or uninhabitable</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Occupancy Information Section */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-6">Occupancy Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <FormField
                control={form.control}
                name="occupancy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-lg'>Occupancy Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Occupied" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Occupied</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Vacant" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Vacant</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Abandoned" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Abandoned</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupiedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-lg'>Occupied By</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Owner" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Owner</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Tenant" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Tenant</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Unknown" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Unknown</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Property Features Section */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-6">Property Features</h3>
            
            <div className="space-y-6">
              <FormField
                  control={form.control}
                  name="signage"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        {signageOptions.map((opt) => (
                          <div key={opt.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={opt.id}
                              checked={(field.value ?? []).includes(opt.id)}
                              onCheckedChange={(checked) => {
                                const cur = field.value ?? []
                                field.onChange(
                                  checked ? [...cur, opt.id] : cur.filter((v) => v !== opt.id)
                                )
                              }}
                            />
                            <Label htmlFor={opt.id} className="font-normal cursor-pointer">
                              {opt.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
              control={form.control}
              name="signageNotes"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormControl>
                    <Textarea rows={2} placeholder="Additional comments..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                control={form.control}
                name="detachStructures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-lg'>Detached Structures</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Shed" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Shed</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Garage" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Garage</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Barn" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Barn</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Other" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Other</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="None" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">N/A</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Structural Assessment Section */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-6">Structural Assessment</h3>
            
            <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="significantDamages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-lg">
                        Significant Damages
                      </FormLabel>
                      <FormDescription>Select one</FormDescription>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                        {["Fire", "Vandalism", "Wind", "Water", "None"].map((item) => (
                          <div key={item} className="flex items-center space-x-3">
                            <Checkbox
                              checked={field.value === item}
                              onCheckedChange={(checked) => {
                                field.onChange(checked ? item : "")
                              }}
                            />
                            <Label className="font-normal cursor-pointer">
                              {item}
                            </Label>
                          </div>
                        ))}
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
             <FormField
                control={form.control}
                name="structuralIssues" // string[]
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-lg">Structural Issues</FormLabel>
                    <FormDescription>Check all that apply</FormDescription>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {structuralOptions.map((opt) => (
                        <div key={opt.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={opt.id}
                            checked={field.value?.includes(opt.id)}
                            onCheckedChange={(checked) => {
                              const next = checked
                                ? [...(field.value ?? []), opt.id]
                                : (field.value ?? []).filter((v) => v !== opt.id)

                              // optional: make "None" exclusive
                              if (opt.id === "noIssues" && checked) field.onChange(["noIssues"])
                              else if (checked && next.includes("noIssues"))
                                field.onChange(next.filter((v) => v !== "noIssues"))
                              else field.onChange(next)
                            }}
                          />
                          <Label htmlFor={opt.id} className="font-normal cursor-pointer">
                            {opt.label}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="structuralIssuesNotes"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormControl>
                      <Textarea rows={3} placeholder="Additional structural comments..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Neighborhood Assessment Section */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-6">Neighborhood Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <FormField
                control={form.control}
                name="neighborhoodConformity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-lg'>Neighborhood Conformity</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Above" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Above</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Median" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Median</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Below" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Below</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neighborhoodCondition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-lg'>Neighborhood Condition</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Improving" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Improving</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Stable" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Stable</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Declining" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Declining</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-6">Additional Notes</h3>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-lg'>Comments</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Enter any additional notes or observations..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>

      {/* Image Upload Section */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-6">Property Images</h3>
        <FetchImages userId={session?.user?.id!} propId={OrderDetails.orderId} />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <Button 
          type="button" 
          variant="outline"
          className="px-8 py-2 font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50" 
          onClick={() => onSave()}
        >
          Save Draft
        </Button>
        <Button 
          type="submit" 
          className="px-8 py-2 font-semibold bg-blue-600 text-white hover:bg-blue-700" 
          form="reportForm"
        >
          Submit Report
        </Button>
      </div>
    </div>
  );
}