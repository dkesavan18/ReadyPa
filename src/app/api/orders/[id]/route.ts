import { NextResponse } from "next/server";
import { getOrderById, updateOrder } from "@/lib/server/orders";
import type { OrderPatch } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const order = await getOrderById(params.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as OrderPatch;
  if (
    !body.status &&
    body.rejectReason === undefined &&
    body.paymentRejectReason === undefined
  ) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }
  const updated = await updateOrder(params.id, body);
  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
