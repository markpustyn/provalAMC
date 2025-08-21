import { pgTable, text, uuid, varchar, date, timestamp, serial, char, unique, jsonb} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  fname: varchar('first_name', { length: 255 }).notNull(),
  lname: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone_number', { length: 30 }).notNull(),
  password: text('password').notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  licenseNum: varchar('license_number', { length: 50 }).notNull(),
  street: varchar('street', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  state: varchar('state', { length: 15 }).notNull(),
  zip: varchar('zip_code', { length: 10 }).notNull(),
  role: varchar('role', { length: 50 }),
  statued: varchar('statued', { length: 50 }),
  lastActivityDate: date('last_activity_date').defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const order = pgTable("order", {
  orderId: uuid('id').notNull().primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => users.id).notNull(),
  loanNumber: varchar('loan_number', { length: 50 }),
  loanOfficer: varchar('loan_officer', { length: 255 }),
  loanOfficerEmail: varchar('loan_officer_email', { length: 255 }),
  lender: varchar('lender', { length: 255 }),
  lenderAddress: varchar('lender_address', { length: 255 }),
  lenderCity: varchar('lender_city', { length: 255 }),
  lenderZip: varchar('lender_zip', { length: 10 }),
  borrowerName: varchar('borrower_name', { length: 255 }),
  borrowerEmail: varchar('borrower_email', { length: 255 }),
  borrowerPhoneType: varchar('borrower_phone_type', { length: 50 }),
  borrowerPhoneNumber: varchar('borrower_phone_number', { length: 30 }),
  propertyAddress: varchar('property_address', { length: 255 }),
  propertyCity: varchar('property_city', { length: 255 }),
  propertyState: varchar('property_state', { length: 50 }),
  propertyZip: varchar('property_zip', { length: 10 }),
  orderType: varchar('order_type', { length: 255 }),
  propertyType: varchar('property_type', { length: 255 }),
  presentOccupancy: varchar('present_occupancy', { length: 255 }),
  loanPurpose: varchar('loan_purpose', { length: 255 }),
  loanType: varchar('loan_type', { length: 255 }),
  mainProduct: varchar('main_product', { length: 255 }),
  requestedDueDate: varchar('requested_due_date', { length: 50 }),
  description: text('description'),
  status: varchar('order_status'),
});

export const statusOrder = pgTable("statusOrder", {
  statusId: uuid('status_id').notNull().primaryKey().defaultRandom(),
  propStatus: varchar('prop_status', { length: 25 }),
  reason: varchar('reason', { length: 255 }),
  propOrderId: uuid('prop_id').references(() => order.orderId).notNull(),
  vendorId: uuid('vendor_id').references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});

export const billing = pgTable("billing", {
  statusId: uuid('id').notNull().primaryKey().defaultRandom(),
  vendorId: uuid('vendor_id').references(() => users.id),
  propOrderId: uuid('prop_id').references(() => order.orderId).notNull(),
  clientId: uuid('client_id').references(() => users.id).notNull(),
  amount: varchar('amount', { length: 25 }),
  vendorFee: varchar('vendor_fee', { length: 25 }),
  billingStatus: varchar('billing_status', { length: 50 }).default('pending'),
  paymentDate: timestamp('payment_date').defaultNow(),
});

export const zipCodes = pgTable('zip_codes', {
  id: serial('id').primaryKey(),
  zip: varchar('zip', { length: 50 }),
  lat: varchar('lat', { length: 50 }),
  lng: varchar('lng', { length: 50 }),
  city: varchar('city', { length: 100 }),
  stateId: char('state_id', { length: 2 }),
  stateName: varchar('state_name', { length: 100 }),
  countyFips: varchar('county_fips', { length: 100 }),
  countyName: varchar('county_name', { length: 100 }),
});

export const vendorZipCodes = pgTable("user_zip_codes", {
  userId: uuid("user_id").references(() => users.id),
   county: varchar('county', {length: 255}),
   zipCode: varchar("zip_code", { length: 10 }).notNull(),
}, (table) => ({
  uniq_user_zip: unique().on(table.userId, table.zipCode),
}));

export const s3AmcUploads = pgTable("s3_amc_uploads", {
  uploadId: uuid('upload_id').primaryKey().defaultRandom(),
  propertyId: uuid("property_id").references(() => order.orderId),
  objectKey: varchar("object_key"),
  imgTag: varchar("image_tag", {length: 100}),
  fileUrl: text("file_url"),
  userId: uuid("user_id").references(() => users.id),
  uploadTimestamp: timestamp("upload_timestamp", { withTimezone: true }).defaultNow()
});

export const pcrForms = pgTable("pcr_forms", {
  orderId: uuid('order_id').references(() => order.orderId).notNull().primaryKey(),
  data: jsonb("data").notNull(),
  vendorId: uuid('vendor_id').references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vendorFiles = pgTable("vendor_files", {
  uploadId: uuid('upload_id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  objectKey: varchar("object_key"),
  fileTag: varchar("file_tag", {length: 100}),
  fileUrl: text("file_url"),
  uploadTimestamp: timestamp("upload_timestamp", { withTimezone: true }).defaultNow()
});

