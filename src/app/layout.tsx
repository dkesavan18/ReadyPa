import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { StoreHydration } from "@/components/shared/StoreHydration";

export const metadata: Metadata = {
  title: "ReadyZo – Order Food Before You Arrive",
  description:
    "Order food from nearby hotels before reaching. Skip the wait. Pick up fresh.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ReadyZo",
  },
  openGraph: {
    title: "ReadyZo",
    description: "Order food before you arrive. Skip the wait.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#6D28D9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body>
        <StoreHydration />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
