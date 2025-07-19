"use client";

import { useEffect, useState } from "react";

export default function OrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/order");
        const data = await res.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Orders:</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      <ul>
        {orders.map((order, idx) => (
          <li key={idx} className="border p-2 my-1">
            <pre>{JSON.stringify(order, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
