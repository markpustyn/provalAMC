import { pgTable, text, uuid, varchar, date, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["active", "disabled"]);
export const rolesEnum = pgEnum("roles", ["broker", "client", "admin"]);
export const orderEnum = pgEnum("orderStaus", ["pending", "assigned", "completed", "canceled"]);


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
  role: rolesEnum().default("broker"),
  statued: statusEnum().default("active"),
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
});

export const statusOrder = pgTable("statusOrder", {
  statusId: uuid('id').notNull().primaryKey().defaultRandom(),
  orderId: uuid().references(() => order.orderId).notNull(),
  vendorId: uuid().references(() => users.id),
  orderStatus: orderEnum().default('pending'),
})