import { pgTable, text, uuid, varchar, date, timestamp, serial, char} from "drizzle-orm/pg-core";

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
  role: varchar('role', { length: 50 }).default('broker'),
  statued: varchar('statued', { length: 50 }).default('active'),
  lastActivityDate: date('last_activity_date').defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const order = pgTable("order", {
  orderId: uuid('id').notNull().primaryKey().defaultRandom(),
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
  propOrderId: uuid('prop_id').references(() => order.orderId).notNull(),
  vendorId: uuid('vendor_id').references(() => users.id),
});

export const billing = pgTable("billing", {
  statusId: uuid('id').notNull().primaryKey().defaultRandom(),
  vendorId: uuid('vendor_id').references(() => users.id),
  propOrderId: uuid('prop_id').references(() => order.orderId).notNull(),
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