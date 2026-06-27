import { NextResponse } from "next/server";
import { createOrder, readOrders } from "@/lib/server/orders";
import type { Order } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const orders = await readOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const order = (await request.json()) as Order;
  if (!order?.id || !order.hotelId || !order.customerName) {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }
  const created = await createOrder(order);
  return NextResponse.json(created, { status: 201 });
}
