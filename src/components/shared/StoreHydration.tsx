"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useHotelStore } from "@/store/hotelStore";
import { useLocationStore } from "@/store/locationStore";

export function StoreHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useHotelStore.persist.rehydrate();
    useLocationStore.persist.rehydrate();
  }, []);

  return null;
}
