"use client";

import { motion } from "framer-motion";
import { Phone, Clock, ChevronRight } from "lucide-react";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { formatCurrency, getRelativeTime } from "@/lib/utils";
import type { Order } from "@/types";

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
  index?: number;
}

export function OrderCard({ order, onClick, index = 0 }: OrderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 cursor-pointer hover:shadow-card-hover transition-all duration-200 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-sm truncate">
              {order.customerName}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
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
        <div className="flex items-center gap-1 text-gray-400">
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
