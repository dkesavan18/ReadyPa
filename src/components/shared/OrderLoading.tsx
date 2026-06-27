"use client";

import { RefreshCw } from "lucide-react";

export function OrderLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <RefreshCw className="h-7 w-7 text-primary animate-spin" />
      </div>
      <p className="text-sm font-semibold text-gray-900">Loading order...</p>
      <p className="text-xs text-gray-500 mt-1">Syncing latest status</p>
    </div>
  );
}
