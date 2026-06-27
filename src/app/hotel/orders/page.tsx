"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { OrderCard } from "@/components/hotel/OrderCard";
import { useHotelStore } from "@/store/hotelStore";
import { useOrderStore } from "@/store/orderStore";

const FILTER_TABS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Ready", value: "READY" },
  { label: "Completed", value: "COLLECTED" },
  { label: "Rejected", value: "REJECTED" },
];

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";
  const [activeTab, setActiveTab] = useState(initialStatus);

  const { loggedInHotel } = useHotelStore();
  const { orders } = useOrderStore();

  const filtered = useMemo(() => {
    if (!loggedInHotel) return [];
    const hotelOrders = orders.filter((o) => o.hotelId === loggedInHotel.id);
    if (activeTab === "all") return hotelOrders;
    return hotelOrders.filter((o) => o.status === activeTab);
  }, [orders, loggedInHotel, activeTab]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-soft px-4 py-4 flex items-center gap-3">
        <Link href="/hotel/dashboard" className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-black text-gray-900 flex-1">All Orders</h1>
        <span className="text-sm text-gray-500">{filtered.length}</span>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex gap-1 px-3 py-2.5 overflow-x-auto overflow-y-hidden scrollbar-hide">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.value
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <span className="text-5xl mb-4">📭</span>
            <p className="text-gray-500 font-semibold">No orders found</p>
          </motion.div>
        ) : (
          filtered.map((order, i) => (
            <OrderCard
              key={order.id}
              order={order}
              index={i}
              onClick={() => router.push(`/hotel/orders/${order.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function HotelOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <OrdersContent />
    </Suspense>
  );
}
