"use client";

import { motion } from "framer-motion";
import { Phone, Clock, ChevronRight } from "lucide-react";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { formatCurrency, formatOrderNumber, getRelativeTime } from "@/lib/utils";
import type { Order } from "@/types";

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
  index?: number;
}

export function OrderCard({ order, onClick, index = 0 }: OrderCardProps) {
  const isReady = order.status === "READY";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`bg-white rounded-2xl border shadow-card p-4 cursor-pointer hover:shadow-card-hover transition-all duration-200 active:scale-[0.99] ${
        isReady ? "border-green-300 ring-1 ring-green-200" : "border-gray-100"
      }`}
    >
      {isReady && order.orderNumber != null && (
        <div className="mb-3 rounded-xl bg-green-50 border border-green-200 px-3 py-2.5 text-center">
          <p className="text-xs text-green-700">
            Order number is{" "}
            <span className="text-xl font-black text-green-800 tabular-nums">
              {formatOrderNumber(order.orderNumber)}
            </span>
          </p>
          <p className="text-[11px] text-green-600 mt-0.5">
            Write on parcel — {order.customerName}
          </p>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {order.orderNumber != null && !isReady && (
              <span className="text-xs font-bold text-primary">
                {formatOrderNumber(order.orderNumber)}
              </span>
            )}
            <h3 className="font-bold text-gray-900 text-sm truncate">
              {order.customerName}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {order.customerMobile}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Pickup: {order.pickupTime}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
          <span className="text-sm font-bold text-gray-900">
            {formatCurrency(order.totalAmount)}
          </span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 border-t border-gray-50 pt-3">
        <p className="text-xs text-gray-500">
          {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")}
        </p>
        <p className="text-xs text-gray-400 mt-1">{getRelativeTime(order.createdAt)}</p>
      </div>
    </motion.div>
  );
}
