"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ClipboardList, IndianRupee, ChefHat, Package,
  Clock, UtensilsCrossed, LogOut, Settings, Bell,
  TrendingUp,
} from "lucide-react";
import { OrderCard } from "@/components/hotel/OrderCard";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { formatCurrency, getRelativeTime } from "@/lib/utils";
import { useHotelStore } from "@/store/hotelStore";
import { useOrderStore } from "@/store/orderStore";
import type { OrderStatus } from "@/types";

const STAT_STATUSES: { status: OrderStatus; label: string; color: string; icon: React.ReactNode }[] = [
  { status: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-5 w-5" /> },
  { status: "ACCEPTED", label: "Accepted", color: "bg-blue-100 text-blue-700", icon: <ClipboardList className="h-5 w-5" /> },
  { status: "PREPARING", label: "Preparing", color: "bg-cyan-100 text-cyan-700", icon: <ChefHat className="h-5 w-5" /> },
  { status: "READY", label: "Ready", color: "bg-green-100 text-green-700", icon: <Package className="h-5 w-5" /> },
];

export default function HotelDashboardPage() {
  const router = useRouter();
  const { loggedInHotel, logoutHotel } = useHotelStore();
  const { orders } = useOrderStore();

  const hotelOrders = useMemo(
    () => (loggedInHotel ? orders.filter((o) => o.hotelId === loggedInHotel.id) : []),
    [orders, loggedInHotel]
  );

  const todayOrders = useMemo(() => {
    const today = new Date().toDateString();
    return hotelOrders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    );
  }, [hotelOrders]);

  const todayRevenue = useMemo(
    () =>
      todayOrders
        .filter((o) => o.status === "COLLECTED")
        .reduce((sum, o) => sum + o.totalAmount, 0),
    [todayOrders]
  );

  const recentOrders = useMemo(
    () => hotelOrders.slice(0, 5),
    [hotelOrders]
  );

  if (!loggedInHotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <span className="text-5xl mb-4 block">🔒</span>
          <h2 className="text-xl font-black text-gray-900">Not logged in</h2>
          <Link href="/hotel/login">
            <button className="mt-4 bg-secondary text-white px-6 py-3 rounded-xl font-semibold">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white shadow-soft">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-xl">
              🏨
            </div>
            <div>
              <h1 className="text-base font-black text-gray-900 leading-tight">
                {loggedInHotel.name}
              </h1>
              <p className="text-xs text-gray-500">{loggedInHotel.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/hotel/settings"
              className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <Settings className="h-4.5 w-4.5 text-gray-600" />
            </Link>
            <button
              onClick={() => { logoutHotel(); router.push("/"); }}
              className="h-9 w-9 rounded-full hover:bg-red-50 flex items-center justify-center"
            >
              <LogOut className="h-4 w-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl gradient-primary p-5 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-200 text-sm font-medium">Today&apos;s Revenue</p>
              <p className="text-3xl font-black mt-1">{formatCurrency(todayRevenue)}</p>
              <p className="text-primary-200 text-xs mt-1">
                {todayOrders.length} orders today
              </p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Status Stats */}
        <div className="grid grid-cols-2 gap-3">
          {STAT_STATUSES.map((stat, i) => {
            const count = hotelOrders.filter((o) => o.status === stat.status).length;
            return (
              <motion.div
                key={stat.status}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/hotel/orders?status=${stat.status}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 hover:shadow-card-hover transition-all">
                    <div className={`h-10 w-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-black text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/hotel/orders">
            <div className="bg-white rounded-2xl border border-primary/20 shadow-card p-4 flex items-center gap-3 hover:shadow-card-hover transition-all">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">All Orders</p>
                <p className="text-xs text-gray-500">{hotelOrders.length} total</p>
              </div>
            </div>
          </Link>
          <Link href="/hotel/menu">
            <div className="bg-white rounded-2xl border border-secondary/20 shadow-card p-4 flex items-center gap-3 hover:shadow-card-hover transition-all">
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Menu</p>
                <p className="text-xs text-gray-500">Manage items</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/hotel/orders" className="text-xs text-primary font-semibold">
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 text-center">
              <span className="text-4xl">📭</span>
              <p className="text-gray-500 text-sm mt-3">No orders yet</p>
              <p className="text-xs text-gray-400 mt-1">Orders will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order, i) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  index={i}
                  onClick={() => router.push(`/hotel/orders/${order.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
