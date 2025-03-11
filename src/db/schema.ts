import { pgTable, text, uuid, varchar, date, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["active", "disabled"]);
export const rolesEnum = pgEnum("roles", ["guest", "user", "admin"]);


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
  state: varchar('state', { length: 2 }).notNull(),
  zip: varchar('zip_code', { length: 10 }).notNull(),
  role: rolesEnum().default("guest"),
  statued: statusEnum().default("active"),
  lastActivityDate: date('last_activity_date').defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
