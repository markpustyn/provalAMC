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
  notes: z.string().optional(),
  items: z.array(z.string()).min(1, "Select at least one property type"),
  subjectCondition: z.string().optional(),
  occupancy: z.string().optional(),
  occupiedBy: z.string().optional(),
  propertyType: z.string().optional(),
  stories: z.string().optional(),
  neighborhood: z.array(z.string()).optional(),
  neighborhoodConformity: z.string().optional(),
  neighborhoodCondition: z.string().optional(),
  viewFactors: z.string().optional(),
  commonElements: z.string().optional(),
  signage: z.string().optional(),
  detachStructures: z.string().optional(),
});

const items = [
  { id: "single", label: "Single Family" },
  { id: "mfr", label: "Multi Family" },
  { id: "condo", label: "Condo" },
  { id: "land", label: "Vacant Land" },
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
      items: [],
      subjectCondition: '',
      occupancy: '',
      occupiedBy: '',
      signage: '',
      propertyType: '',
      stories: '',
      neighborhood: [],
      neighborhoodConformity: '',
      neighborhoodCondition: '',
      viewFactors: '',
      commonElements: '',
      detachStructures: '',
    },
  })

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
                    <FormLabel className='font-bold text-lg'>Inspector Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter inspector name" {...field} />
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
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-6">Property Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <FormField
                control={form.control}
                name="items"
                render={() => (
                  <FormItem>
                    <FormLabel className='font-bold text-lg'>Property Type</FormLabel>
                    <FormDescription>Select all applicable types</FormDescription>
                    <div className="space-y-3 mt-2">
                      {items.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="items"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
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
                              <FormLabel className="text-sm font-normal cursor-pointer">{item.label}</FormLabel>
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
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-lg'>Property Use</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Residential" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Residential</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Commercial" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Commercial</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Industrial" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Industrial</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Agricultural" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Agricultural</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="Mixed Use" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Mixed Use</FormLabel>
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
                  <FormItem>
                    <FormLabel className='font-bold text-lg'>Number of Stories</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="1" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">1</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="2" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">2</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="3+" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">3+</FormLabel>
                        </FormItem>
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
                          <RadioGroupItem value="C1: New or like-new with no signs of wear." />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">C1: New with no signs of wear.</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="C2: Recently renovated with no deferred maintenance." />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">C2: Recently renovated with no deferred maintenance.</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="C3: Well-maintained with limited wear from normal use." />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">C3: Well-maintained with limited wear from normal use.</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="C4: Adequately maintained, needing minor repairs." />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">C4: Adequately maintained, needing minor repairs.</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="C5: Significant repairs needed due to deferred maintenance." />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">C5: Significant repairs needed due to deferred maintenance.</FormLabel>
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
                    <FormLabel className='font-bold text-lg'>Items Present (Observations)</FormLabel>
                    <FormDescription>Check all that apply</FormDescription>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="forSaleSign" />
                        <Label htmlFor="forSaleSign" className="font-normal cursor-pointer">For Sale Sign</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="exteriorDamage" />
                        <Label htmlFor="exteriorDamage" className="font-normal cursor-pointer">Exterior Damage</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="lawnMaintenance" />
                        <Label htmlFor="lawnMaintenance" className="font-normal cursor-pointer">Deferred Lawn Maintenance</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="abandonedVehicles" />
                        <Label htmlFor="abandonedVehicles" className="font-normal cursor-pointer">Abandoned Vehicles</Label>
                      </div>
                    </div>
                    <FormControl>
                      <Textarea rows={2} placeholder="Additional comments..." {...field} className="mt-3" />
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
                          <FormControl><RadioGroupItem value="N/A" /></FormControl>
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
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-lg'>Significant Damages</FormLabel>
                    <FormDescription>Check all that apply</FormDescription>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="fire" />
                        <Label htmlFor="fire" className="font-normal cursor-pointer">Fire</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="vandalism" />
                        <Label htmlFor="vandalism" className="font-normal cursor-pointer">Vandalism</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="wind" />
                        <Label htmlFor="wind" className="font-normal cursor-pointer">Wind</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="water" />
                        <Label htmlFor="water" className="font-normal cursor-pointer">Water</Label>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="viewFactors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-lg'>Structural Issues</FormLabel>
                    <FormDescription>Check all that apply</FormDescription>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="boardedWindows" />
                        <Label htmlFor="boardedWindows" className="font-normal cursor-pointer">Boarded Up Windows</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="boardedDoors" />
                        <Label htmlFor="boardedDoors" className="font-normal cursor-pointer">Boarded Up Doors</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="foundationDamage" />
                        <Label htmlFor="foundationDamage" className="font-normal cursor-pointer">Damage to Foundation</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="gutters" />
                        <Label htmlFor="gutters" className="font-normal cursor-pointer">Disconnected Gutters</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="tarp" />
                        <Label htmlFor="tarp" className="font-normal cursor-pointer">Tarp on Roof</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="noIssues" />
                        <Label htmlFor="noIssues" className="font-normal cursor-pointer">None</Label>
                      </div>
                    </div>
                    <FormControl>
                      <Textarea rows={3} placeholder="Additional structural comments..." {...field} className="mt-3" />
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