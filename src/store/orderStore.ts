import { create } from "zustand";
import type { Order, OrderStatus } from "@/types";
import { fetchOrders, patchOrderStatus, postOrder } from "@/lib/api/orders";

interface OrderStore {
  orders: Order[];
  isSyncing: boolean;
  setOrders: (orders: Order[]) => void;
  syncOrders: () => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByHotel: (hotelId: string) => Order[];
  getOrdersByCustomer: (mobile: string) => Order[];
}

export const useOrderStore = create<OrderStore>()((set, get) => ({
  orders: [],
  isSyncing: false,

  setOrders: (orders) => set({ orders }),

  syncOrders: async () => {
    set({ isSyncing: true });
    try {
      const orders = await fetchOrders();
      set({ orders });
    } finally {
      set({ isSyncing: false });
    }
  },

  addOrder: async (order) => {
    await postOrder(order);
    set({ orders: [order, ...get().orders.filter((o) => o.id !== order.id)] });
  },

  updateOrderStatus: async (orderId, status) => {
    const updated = await patchOrderStatus(orderId, status);
    set({
      orders: get().orders.map((o) => (o.id === orderId ? updated : o)),
    });
  },

  getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),

  getOrdersByHotel: (hotelId) =>
    get().orders.filter((o) => o.hotelId === hotelId),

  getOrdersByCustomer: (mobile) =>
    get().orders.filter((o) => o.customerMobile === mobile),
}));
