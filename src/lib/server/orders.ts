import fs from "fs";
import path from "path";
import type { Order, OrderStatus } from "@/types";
import { mockOrders } from "@/data/mockData";

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(mockOrders, null, 2), "utf-8");
  }
}

export function readOrders(): Order[] {
  ensureStore();
  const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
  return JSON.parse(raw) as Order[];
}

function writeOrders(orders: Order[]) {
  ensureStore();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export function getOrderById(id: string): Order | undefined {
  return readOrders().find((o) => o.id === id);
}

export function createOrder(order: Order): Order {
  const orders = readOrders();
  const next = [order, ...orders.filter((o) => o.id !== order.id)];
  writeOrders(next);
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const orders = readOrders();
  let updated: Order | null = null;
  const next = orders.map((o) => {
    if (o.id !== id) return o;
    updated = { ...o, status, updatedAt: new Date().toISOString() };
    return updated;
  });
  if (!updated) return null;
  writeOrders(next);
  return updated;
}
