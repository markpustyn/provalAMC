import { z } from "zod"

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];


export const OrderSchema = z.object({
  // image: z
  //   .any()
  //   .optional() // Make image optional
  //   .refine(
  //     (files) => !files || files?.[0]?.size <= MAX_FILE_SIZE,
  //     `Max file size is 5MB.`
  //   )
  //   .refine(
  //     (files) => !files || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  //     '.jpg, .jpeg, .png and .webp files are accepted.'
  //   ),
  // id: z.string().optional(),
  loanNumber: z.string().optional(),
  clientId: z.string().optional(),
  loanOfficer: z.string().optional(),
  loanOfficerEmail: z.string().email().optional(),
  lender: z.string().optional(),
  lenderAddress: z.string().optional(),
  lenderCity: z.string().optional(),
  lenderZip: z.string().optional(),
  borrowerName: z.string().optional(),
  borrowerEmail: z.string().email().optional(),
  borrowerPhoneType: z.string().optional(),
  borrowerPhoneNumber: z.string().optional(),
  propertyAddress: z.string().optional(),
  propertyCity: z.string().optional(),
  propertyState: z.string().optional(), // ✅ Added
  propertyZip: z.string().optional(),
  orderType: z.string().optional(),
  propertyType: z.string().optional(),
  presentOccupancy: z.string().optional(),
  loanPurpose: z.string().optional(),
  loanType: z.string().optional(),
  mainProduct: z.string().optional(),
  requestedDueDate: z.string().optional(), // ✅ Matches SQL Date
  description: z.string().optional(),
  propStatus: z.string().optional(),
  propOrderId: z.string().optional(),
  vendorId: z.string().optional(),
  status: z.string().optional(),
  unitNumber: z.string().optional(),

  // services: z.string().optional(),
  // dbaName: z.string().optional(),
  // accContact: z.string().optional(),
  // accMobile: z.string().optional(),
  // accHome: z.string().optional(),
  // accWork: z.string().optional(),
  // accEmail: z.string().email().optional(),
  // callbackReference: z.string().optional(),
  // notes: z.string().optional(),
  // reportHtml: z.string().optional(),
  // status: z.string().optional(),
  // isDone: z.boolean().default(false),
})