import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ALL_LOCATIONS_ID, type LocationId } from "@/data/locations";

interface LocationStore {
  selectedLocation: LocationId;
  setLocation: (location: LocationId) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      selectedLocation: ALL_LOCATIONS_ID,
      setLocation: (location) => set({ selectedLocation: location }),
    }),
    { name: "readypa-location" }
  )
);
