import { prisma } from "@/lib/prisma";
import type { Order, OrderItem, OrderPatch, OrderStatus, PaymentStatus } from "@/types";
import { ORDER_NUMBER_START } from "@/lib/utils";

type DbOrder = {
  id: string;
  orderNumber: number | null;
  customerId: string;
  customerName: string;
  customerMobile: string;
  hotelId: string;
  hotelName: string;
  status: string;
  pickupTime: string;
  notes: string | null;
  totalAmount: number;
  paymentStatus: string;
  rejectReason: string | null;
  paymentRejectReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: DbOrderItem[];
};

type DbOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

function dbToOrder(row: DbOrder): Order {
  return {
    id: row.id,
    orderNumber: row.orderNumber ?? undefined,
    customerId: row.customerId,
    customerName: row.customerName,
    customerMobile: row.customerMobile,
    hotelId: row.hotelId,
    hotelName: row.hotelName,
    status: row.status as OrderStatus,
    pickupTime: row.pickupTime,
    notes: row.notes ?? undefined,
    totalAmount: row.totalAmount,
    paymentStatus: row.paymentStatus as PaymentStatus,
    rejectReason: row.rejectReason ?? undefined,
    paymentRejectReason: row.paymentRejectReason ?? undefined,
    items: row.items.map(
      (item): OrderItem => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })
    ),
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : row.createdAt,
    updatedAt:
      row.updatedAt instanceof Date
        ? row.updatedAt.toISOString()
        : row.updatedAt,
  };
}

async function nextOrderNumberForHotel(hotelId: string): Promise<number> {
  const result = await prisma.order.aggregate({
    where: { hotelId },
    _max: { orderNumber: true },
  });
  return (result._max.orderNumber ?? ORDER_NUMBER_START - 1) + 1;
}

export async function readOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(dbToOrder);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const row = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  return row ? dbToOrder(row) : undefined;
}

export async function createOrder(order: Order): Promise<Order> {
  const orderNumber =
    order.orderNumber != null && order.orderNumber >= ORDER_NUMBER_START
      ? order.orderNumber
      : await nextOrderNumberForHotel(order.hotelId);

  const row = await prisma.order.create({
    data: {
      id: order.id,
      orderNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      customerMobile: order.customerMobile,
      hotelId: order.hotelId,
      hotelName: order.hotelName,
      status: order.status,
      pickupTime: order.pickupTime,
      notes: order.notes ?? null,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      items: {
        create: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });

  return dbToOrder(row);
}

export async function updateOrder(
  id: string,
  patch: OrderPatch
): Promise<Order | null> {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return null;

  const data: Record<string, unknown> = {};

  if (patch.status !== undefined) data.status = patch.status;

  if (patch.rejectReason === null) {
    data.rejectReason = null;
  } else if (patch.rejectReason !== undefined) {
    data.rejectReason = patch.rejectReason;
  }

  if (patch.paymentRejectReason === null) {
    data.paymentRejectReason = null;
  } else if (patch.paymentRejectReason !== undefined) {
    data.paymentRejectReason = patch.paymentRejectReason;
  }

  // Clear paymentRejectReason when payment is resubmitted
  if (patch.status === "PAYMENT_SUBMITTED") {
    data.paymentRejectReason = null;
  }

  const row = await prisma.order.update({
    where: { id },
    data,
    include: { items: true },
  });

  return dbToOrder(row);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  return updateOrder(id, { status });
}
