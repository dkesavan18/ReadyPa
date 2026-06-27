"use client";

import { useEffect } from "react";
import { mockCategories, mockHotels, mockProducts } from "@/data/mockData";
import { useCartStore } from "@/store/cartStore";
import { useHotelStore } from "@/store/hotelStore";
import { useLocationStore } from "@/store/locationStore";

function mergeMockHotelData() {
  const state = useHotelStore.getState();
  const newHotels = mockHotels.filter((h) => !state.hotels.some((x) => x.id === h.id));
  const newCategories = mockCategories.filter(
    (c) => !state.categories.some((x) => x.id === c.id)
  );
  const newProducts = mockProducts.filter(
    (p) => !state.products.some((x) => x.id === p.id)
  );

  if (newHotels.length || newCategories.length || newProducts.length) {
    useHotelStore.setState({
      hotels: [...state.hotels, ...newHotels],
      categories: [...state.categories, ...newCategories],
      products: [...state.products, ...newProducts],
    });
  }
}

export function StoreHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useHotelStore.persist.rehydrate();
    useLocationStore.persist.rehydrate();

    const unsub = useHotelStore.persist.onFinishHydration(() => {
      mergeMockHotelData();
    });
    mergeMockHotelData();

    return unsub;
  }, []);

  return null;
}
