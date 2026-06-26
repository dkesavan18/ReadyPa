import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/server/orders";
import type { OrderStatus } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const order = getOrderById(params.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as { status?: OrderStatus };
  if (!body.status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }
  const updated = updateOrderStatus(params.id, body.status);
  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
