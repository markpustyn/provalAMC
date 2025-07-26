import { pgTable, unique, uuid, varchar, text, date, timestamp, foreignKey, serial, char } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 30 }).notNull(),
	password: text().notNull(),
	companyName: varchar("company_name", { length: 255 }).notNull(),
	licenseNumber: varchar("license_number", { length: 50 }).notNull(),
	street: varchar({ length: 255 }).notNull(),
	city: varchar({ length: 255 }).notNull(),
	state: varchar({ length: 15 }).notNull(),
	zipCode: varchar("zip_code", { length: 10 }).notNull(),
	role: varchar({ length: 50 }).default('broker'),
	statued: varchar({ length: 50 }).default('active'),
	lastActivityDate: date("last_activity_date").defaultNow(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const billing = pgTable("billing", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	vendorId: uuid("vendor_id"),
	propId: uuid("prop_id").notNull(),
	amount: varchar({ length: 25 }),
	vendorFee: varchar("vendor_fee", { length: 25 }),
	billingStatus: varchar("billing_status", { length: 50 }).default('pending'),
	paymentDate: timestamp("payment_date", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.vendorId],
			foreignColumns: [users.id],
			name: "billing_vendor_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.propId],
			foreignColumns: [order.id],
			name: "billing_prop_id_order_id_fk"
		}),
]);

export const order = pgTable("order", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	loanNumber: varchar("loan_number", { length: 50 }),
	loanOfficer: varchar("loan_officer", { length: 255 }),
	loanOfficerEmail: varchar("loan_officer_email", { length: 255 }),
	lender: varchar({ length: 255 }),
	lenderAddress: varchar("lender_address", { length: 255 }),
	lenderCity: varchar("lender_city", { length: 255 }),
	lenderZip: varchar("lender_zip", { length: 10 }),
	borrowerName: varchar("borrower_name", { length: 255 }),
	borrowerEmail: varchar("borrower_email", { length: 255 }),
	borrowerPhoneType: varchar("borrower_phone_type", { length: 50 }),
	borrowerPhoneNumber: varchar("borrower_phone_number", { length: 30 }),
	propertyAddress: varchar("property_address", { length: 255 }),
	propertyCity: varchar("property_city", { length: 255 }),
	propertyState: varchar("property_state", { length: 50 }),
	propertyZip: varchar("property_zip", { length: 10 }),
	orderType: varchar("order_type", { length: 255 }),
	propertyType: varchar("property_type", { length: 255 }),
	presentOccupancy: varchar("present_occupancy", { length: 255 }),
	loanPurpose: varchar("loan_purpose", { length: 255 }),
	loanType: varchar("loan_type", { length: 255 }),
	mainProduct: varchar("main_product", { length: 255 }),
	requestedDueDate: varchar("requested_due_date", { length: 50 }),
	description: text(),
	orderStatus: varchar("order_status"),
});

export const statusOrder = pgTable("statusOrder", {
	statusId: uuid("status_id").defaultRandom().primaryKey().notNull(),
	propStatus: varchar("prop_status", { length: 25 }),
	propId: uuid("prop_id").notNull(),
	vendorId: uuid("vendor_id"),
}, (table) => [
	foreignKey({
			columns: [table.propId],
			foreignColumns: [order.id],
			name: "statusOrder_prop_id_order_id_fk"
		}),
	foreignKey({
			columns: [table.vendorId],
			foreignColumns: [users.id],
			name: "statusOrder_vendor_id_users_id_fk"
		}),
]);

export const zipCodes = pgTable("zip_codes", {
	id: serial().primaryKey().notNull(),
	zip: varchar({ length: 50 }),
	lat: varchar({ length: 50 }),
	lng: varchar({ length: 50 }),
	city: varchar({ length: 100 }),
	stateId: char("state_id", { length: 2 }),
	stateName: varchar("state_name", { length: 100 }),
	countyFips: varchar("county_fips", { length: 100 }),
	countyName: varchar("county_name", { length: 100 }),
});
