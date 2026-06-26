import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Hotel, Category, Product } from "@/types";
import { mockHotels, mockCategories, mockProducts } from "@/data/mockData";

interface HotelStore {
  hotels: Hotel[];
  categories: Category[];
  products: Product[];
  loggedInHotel: Hotel | null;

  registerHotel: (hotel: Hotel) => void;
  updateHotel: (id: string, data: Partial<Hotel>) => void;
  loginHotel: (mobile: string, password: string) => Hotel | null;
  logoutHotel: () => void;

  addCategory: (category: Category) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;

  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;

  getHotelCategories: (hotelId: string) => Category[];
  getHotelProducts: (hotelId: string) => Product[];
}

export const useHotelStore = create<HotelStore>()(
  persist(
    (set, get) => ({
      hotels: mockHotels,
      categories: mockCategories,
      products: mockProducts,
      loggedInHotel: null,

      registerHotel: (hotel) =>
        set({ hotels: [...get().hotels, hotel] }),

      updateHotel: (id, data) =>
        set({
          hotels: get().hotels.map((h) =>
            h.id === id ? { ...h, ...data } : h
          ),
          loggedInHotel:
            get().loggedInHotel?.id === id
              ? { ...get().loggedInHotel!, ...data }
              : get().loggedInHotel,
        }),

      loginHotel: (mobile, password) => {
        const hotel = get().hotels.find(
          (h) => h.mobile === mobile
        );
        if (hotel) {
          set({ loggedInHotel: hotel });
          return hotel;
        }
        return null;
      },

      logoutHotel: () => set({ loggedInHotel: null }),

      addCategory: (category) =>
        set({ categories: [...get().categories, category] }),

      updateCategory: (id, name) =>
        set({
          categories: get().categories.map((c) =>
            c.id === id ? { ...c, name } : c
          ),
        }),

      deleteCategory: (id) =>
        set({ categories: get().categories.filter((c) => c.id !== id) }),

      addProduct: (product) =>
        set({ products: [...get().products, product] }),

      updateProduct: (id, data) =>
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        }),

      deleteProduct: (id) =>
        set({ products: get().products.filter((p) => p.id !== id) }),

      toggleProductAvailability: (id) =>
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
          ),
        }),

      getHotelCategories: (hotelId) =>
        get()
          .categories.filter((c) => c.hotelId === hotelId)
          .sort((a, b) => a.sortOrder - b.sortOrder),

      getHotelProducts: (hotelId) =>
        get().products.filter((p) => p.hotelId === hotelId),
    }),
    {
      name: "readypa-hotel",
      skipHydration: true,
    }
  )
);
