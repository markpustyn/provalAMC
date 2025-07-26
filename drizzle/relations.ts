import { relations } from "drizzle-orm/relations";
import { users, billing, order, statusOrder } from "./schema";

export const billingRelations = relations(billing, ({one}) => ({
	user: one(users, {
		fields: [billing.vendorId],
		references: [users.id]
	}),
	order: one(order, {
		fields: [billing.propId],
		references: [order.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	billings: many(billing),
	statusOrders: many(statusOrder),
}));

export const orderRelations = relations(order, ({many}) => ({
	billings: many(billing),
	statusOrders: many(statusOrder),
}));

export const statusOrderRelations = relations(statusOrder, ({one}) => ({
	order: one(order, {
		fields: [statusOrder.propId],
		references: [order.id]
	}),
	user: one(users, {
		fields: [statusOrder.vendorId],
		references: [users.id]
	}),
}));