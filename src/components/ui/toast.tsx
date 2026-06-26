"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "12px",
          background: "#1A1A2E",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "500",
          padding: "12px 16px",
        },
        success: {
          iconTheme: { primary: "#10B981", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#EF4444", secondary: "#fff" },
        },
      }}
    />
  );
}
