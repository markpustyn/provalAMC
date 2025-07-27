"use server";

import { db } from "@/db/drizzle";
import { billing, order, statusOrder, users, vendorZipCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Session } from "next-auth";
import { BillingStatus, OpenOrder, StatusOrder, UpdateZip } from "types";

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

// export const updateZip = async (params: UpdateZip) => {
//   try {
//     const update = await db.insert(vendorZipCodes).values(params).returning();
//     return {
//       success: true,
//       data: JSON.parse(JSON.stringify(update)),
//     };
//   } catch (error) {
//     console.error("Error updating zips:", error);
//     return { success: false, error: "Failed to update zips" };
//   }
// };

export const deleteOrder = async (__params: OpenOrder, id: any) => {
    try {
        const deleteOrder = await db.delete(order).where(eq(order.orderId, id))
        return {
            success: true,
        };
    } catch (error) {
        return { success: false, error: "Failed to delete order" };
    }
};
export const acceptOrder = async (params: StatusOrder) => {
    try {
        const acceptOrder = await db.insert(statusOrder).values(params);

        // Update the related order status
        await db
            .update(order)
            .set({ status: params.propStatus })
            .where(eq(order.orderId, params.propOrderId));

        return { success: true };
    } catch (error) {
        console.log("Error:", error);
        return { success: false, error: "Failed to process order" };
    }
};
// export const billOrder = async (bill: BillingStatus) => {
//     try {
//         console.log(bill)
//         const billOrder = await db.insert(billing).values(bill)
//         return {
//             success: true,
//         };
//     } catch (error) {
//         console.error("Error creating order:", error);
//         return { success: false, error: "Failed to create order" };
//     }
// };
export async function getUserProfile(session: Session) {
  if (!session.user?.email) return null;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  return result[0] || null;
}