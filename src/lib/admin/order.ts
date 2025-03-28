"use server";

import { db } from "@/db/drizzle";
import { order, statusOrder } from "@/db/schema";
import { eq } from "drizzle-orm";
import { OpenOrder, StatusOrder } from "types";

export const createOrder = async (params: OpenOrder) => {
    try {
        const newOrder = await db.insert(order).values(params).returning();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(newOrder[0])),
        };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: "Failed to create order" };
    }
};
export const deleteOrder = async (__params: OpenOrder, id: any) => {
    try {
        const deleteOrder = await db.delete(order).where(eq(order.orderId, id))
        return {
            success: true,
        };
    } catch (error) {
        return { success: false, error: "Failed tp delete order" };
    }
};
export const acceptOrder = async (values) => {
    try {
        const acceptOrder = await db.insert(statusOrder).values(values);
        console.log("Inserted:", acceptOrder);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to process order" };
    }
  };