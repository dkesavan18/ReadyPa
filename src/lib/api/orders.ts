import type { Order, OrderStatus } from "@/types";
import type { OrderPatch } from "@/types";

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function postOrder(order: Order): Promise<Order> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function patchOrder(
  orderId: string,
  patch: OrderPatch
): Promise<Order> {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}

export async function patchOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order> {
  return patchOrder(orderId, { status });
}
