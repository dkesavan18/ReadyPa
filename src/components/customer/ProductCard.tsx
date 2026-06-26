"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  hotelId: string;
  hotelName: string;
}

export function ProductCard({ product, hotelId, hotelName }: ProductCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex gap-3 p-3 rounded-xl border transition-all duration-200 ${
        product.isAvailable
          ? "bg-white border-gray-100 hover:border-primary/20 hover:shadow-soft"
          : "bg-gray-50 border-gray-100 opacity-60"
      }`}
    >
      <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-2xl">
            🍽️
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-1.5">
            <span
              className={`mt-0.5 h-3 w-3 flex-shrink-0 rounded-sm border-2 ${
                product.isVeg
                  ? "border-green-600"
                  : "border-red-600"
              } flex items-center justify-center`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  product.isVeg ? "bg-green-600" : "bg-red-600"
                }`}
              />
            </span>
            <h4 className="text-sm font-semibold text-gray-900 leading-tight">
              {product.name}
            </h4>
          </div>
          {product.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>

          {product.isAvailable ? (
            quantity === 0 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => addItem(product, hotelId, hotelName)}
                className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-800 transition-colors"
              >
                <Plus className="h-3 w-3" /> Add
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-1"
              >
                <button
                  onClick={() =>
                    quantity === 1
                      ? removeItem(product.id)
                      : updateQuantity(product.id, quantity - 1)
                  }
                  className="h-7 w-7 flex items-center justify-center text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-sm font-bold text-primary w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => addItem(product, hotelId, hotelName)}
                  className="h-7 w-7 flex items-center justify-center text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </motion.div>
            )
          ) : (
            <span className="text-xs text-gray-400 font-medium">Unavailable</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
