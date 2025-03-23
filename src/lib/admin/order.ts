"use server";

import { db } from "@/db/drizzle";
import { order } from "@/db/schema";
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