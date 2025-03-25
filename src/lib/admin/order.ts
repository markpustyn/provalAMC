"use server";

import { db } from "@/db/drizzle";
import { order } from "@/db/schema";
import { eq } from "drizzle-orm";
import { OpenOrder } from "types";

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
export const deleteOrder = async (params: OpenOrder, id: any) => {
    try {
        const deleteOrder = await db.delete(order).where(eq(order.loanNumber, `${id}`))
        return {
            success: true,
        };
    } catch (error) {
        return { success: false, error: "Failed tp delte order" };
    }
};