import { db } from "@/db/drizzle";
import { order } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AuthCredentials } from "types";

type Props = { vendorDetails: AuthCredentials };

export default async function OrdersList({ vendorDetails }: Props) {
  if (!vendorDetails?.id) {
    return <div>No client ID provided.</div>;
  }

  const orders = await db
    .select()
    .from(order)
    .where(eq(order.clientId, vendorDetails.id));

  if (!orders.length) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Pending Orders</h2>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((o) => (
          <div
            key={o.orderId}
            className="p-5 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
          >
            <p className="text-xs text-gray-500 mb-1">
              <strong>Status:</strong> {o.status}
            </p>
            <p className="text-sm font-medium mb-2">
              <strong>Order ID:</strong> {o.orderId}
            </p>

            <p className="text-sm">
              <strong>Lender:</strong> {o.lender}
            </p>
            <p className="text-sm">
              <strong>Borrower:</strong> {o.borrowerName}
            </p>

            <p className="text-sm mt-2">
              <strong>Property:</strong>{" "}
              {`${o.propertyAddress}, ${o.propertyCity}`}
            </p>

            <p className="text-sm mt-2">
              <strong>Due:</strong> {o.requestedDueDate}
            </p>

            <p className="text-sm">
              <strong>Fee:</strong> ${o.orderFee}
            </p>

            {o.completeUrl && (
              <a
                href={o.completeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-blue-600 hover:underline text-sm"
              >
                View Report
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
