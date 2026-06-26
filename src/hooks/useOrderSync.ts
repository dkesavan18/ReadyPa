"use client";

import { useEffect, useRef } from "react";
import { useOrderStore } from "@/store/orderStore";

const SYNC_INTERVAL_MS = 5000;

export function useOrderSync() {
  const syncOrders = useOrderStore((s) => s.syncOrders);
  const syncingRef = useRef(false);

  useEffect(() => {
    const runSync = async () => {
      if (syncingRef.current || document.visibilityState === "hidden") return;
      syncingRef.current = true;
      try {
        await syncOrders();
      } finally {
        syncingRef.current = false;
      }
    };

    runSync();
    const interval = setInterval(runSync, SYNC_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") runSync();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [syncOrders]);
}
