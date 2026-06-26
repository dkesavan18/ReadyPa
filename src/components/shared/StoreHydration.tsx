"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useHotelStore } from "@/store/hotelStore";

export function StoreHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useHotelStore.persist.rehydrate();
  }, []);

  return null;
}
