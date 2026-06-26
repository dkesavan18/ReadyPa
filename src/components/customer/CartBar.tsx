"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

export function CartBar() {
  const router = useRouter();
  const { items, getTotalAmount, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const totalAmount = getTotalAmount();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6"
        >
          <button
            onClick={() => router.push("/customer/cart")}
            className="w-full max-w-lg mx-auto flex items-center justify-between rounded-2xl bg-primary px-5 py-4 shadow-float text-white"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <span className="font-semibold text-sm">
                {totalItems} item{totalItems > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{formatCurrency(totalAmount)}</span>
              <span className="text-primary-200 text-sm">→ View Cart</span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
