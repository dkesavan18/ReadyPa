"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { BottomSheet } from "@/components/ui/dialog";
import { LOCATIONS } from "@/data/locations";
import { useLocationStore } from "@/store/locationStore";
import type { LocationId } from "@/data/locations";
import { cn } from "@/lib/utils";

export function LocationSelect() {
  const [open, setOpen] = useState(false);
  const { selectedLocation, setLocation } = useLocationStore();
  const label =
    LOCATIONS.find((l) => l.id === selectedLocation)?.label ?? "All locations";

  const pick = (id: LocationId) => {
    setLocation(id);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Location: ${label}. Tap to change`}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-1 min-w-0 flex-1 min-h-[44px] py-2 text-left touch-manipulation active:opacity-70"
      >
        <span className="text-sm font-semibold text-gray-900 truncate">
          {label}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-500 flex-shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Select location"
      >
        <ul role="listbox" aria-label="Locations" className="space-y-1">
          {LOCATIONS.map((loc) => {
            const selected = selectedLocation === loc.id;
            return (
              <li key={loc.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => pick(loc.id)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-xl px-4 py-4 text-base font-medium transition-colors touch-manipulation",
                    selected
                      ? "bg-primary/10 text-primary"
                      : "text-gray-900 active:bg-gray-100"
                  )}
                >
                  {loc.label}
                  {selected && <Check className="h-5 w-5 flex-shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      </BottomSheet>
    </>
  );
}
