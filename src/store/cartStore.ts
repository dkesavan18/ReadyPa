import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  hotelId: string | null;
  hotelName: string | null;
  customerName: string;
  customerMobile: string;
  pickupTime: string;
  notes: string;

  addItem: (product: Product, hotelId: string, hotelName: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCustomerInfo: (name: string, mobile: string) => void;
  setPickupTime: (time: string) => void;
  setNotes: (notes: string) => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      hotelId: null,
      hotelName: null,
      customerName: "",
      customerMobile: "",
      pickupTime: "",
      notes: "",

      addItem: (product, hotelId, hotelName) => {
        const { items, hotelId: currentHotelId } = get();

        if (currentHotelId && currentHotelId !== hotelId) {
          set({
            items: [{ product, quantity: 1 }],
            hotelId,
            hotelName,
          });
          return;
        }

        const existing = items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { product, quantity: 1 }],
            hotelId,
            hotelName,
          });
        }
      },

      removeItem: (productId) => {
        const { items } = get();
        const newItems = items.filter((i) => i.product.id !== productId);
        set({
          items: newItems,
          hotelId: newItems.length === 0 ? null : get().hotelId,
          hotelName: newItems.length === 0 ? null : get().hotelName,
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () =>
        set({
          items: [],
          hotelId: null,
          hotelName: null,
          pickupTime: "",
          notes: "",
        }),

      setCustomerInfo: (name, mobile) =>
        set({ customerName: name, customerMobile: mobile }),

      setPickupTime: (time) => set({ pickupTime: time }),
      setNotes: (notes) => set({ notes }),

      getTotalAmount: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "readypa-cart",
      skipHydration: true,
    }
  )
);
