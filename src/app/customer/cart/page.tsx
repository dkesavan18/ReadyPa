"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Plus, Minus, Trash2, ShoppingBag, Clock, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { formatCurrency, formatOrderNumber, generateId, PICKUP_TIMES } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const {
    items, hotelId, hotelName,
    customerName, customerMobile,
    pickupTime, notes,
    getTotalAmount, getTotalItems,
    updateQuantity, removeItem,
    setCustomerInfo, setPickupTime, setNotes,
    clearCart,
  } = useCartStore();

  const { addOrder } = useOrderStore();
  const [isPlacing, setIsPlacing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.name = "Name is required";
    if (!customerMobile.trim()) newErrors.mobile = "Mobile number is required";
    if (customerMobile && !/^[6-9]\d{9}$/.test(customerMobile))
      newErrors.mobile = "Enter valid 10-digit mobile number";
    if (!pickupTime) newErrors.pickupTime = "Select pickup time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setIsPlacing(true);
    try {
      const orderId = `order-${generateId()}`;
      const totalAmount = getTotalAmount();

      const created = await addOrder({
        id: orderId,
        customerId: `cust-${generateId()}`,
        customerName: customerName.trim(),
        customerMobile: customerMobile.trim(),
        hotelId: hotelId!,
        hotelName: hotelName!,
        status: "PENDING",
        pickupTime,
        notes: notes || undefined,
        totalAmount,
        paymentStatus: "UNPAID",
        items: items.map((i, idx) => ({
          id: `item-${generateId()}-${idx}`,
          orderId,
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      clearCart();
      toast.success(
        created.orderNumber != null
          ? `Order ${formatOrderNumber(created.orderNumber)} placed successfully!`
          : "Order placed successfully!"
      );
      router.push(`/customer/order/${created.id}`);
    } catch {
      toast.error("Could not place order. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="h-28 w-28 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-14 w-14 text-gray-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Cart is empty</h2>
          <p className="text-gray-500 mt-2 text-sm">Add items from a nearby hotel</p>
          <Link href="/customer/home">
            <Button className="mt-6">Browse Hotels</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-soft px-4 py-4 flex items-center gap-3">
        <Link href={`/customer/hotel/${hotelId}`} className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-black text-gray-900">Your Cart</h1>
          <p className="text-xs text-gray-500">{hotelName}</p>
        </div>
        <span className="text-sm text-gray-500">{getTotalItems()} items</span>
      </div>

      <div className="px-4 py-4 space-y-4 pb-32">
        {/* Cart Items */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">Order Items</h2>
          </div>
          <div className="divide-y divide-gray-50">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 flex items-center gap-3"
                >
                  {item.product.imageUrl && (
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" sizes="56px" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-primary/10 rounded-lg px-1">
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? removeItem(item.product.id)
                            : updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="h-7 w-7 flex items-center justify-center text-primary"
                      >
                        {item.quantity === 1 ? <Trash2 className="h-3.5 w-3.5 text-red-400" /> : <Minus className="h-3.5 w-3.5" />}
                      </button>
                      <span className="w-4 text-center text-sm font-bold text-primary">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="h-7 w-7 flex items-center justify-center text-primary"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-14 text-right">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-xl font-black text-primary">{formatCurrency(getTotalAmount())}</span>
          </div>
        </div>

        {/* Pickup Time */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-gray-900">Pickup Time</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PICKUP_TIMES.map((time) => (
              <button
                key={time}
                onClick={() => setPickupTime(time)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${
                  pickupTime === time
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/40"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {errors.pickupTime && (
            <p className="text-xs text-red-500 mt-2">{errors.pickupTime}</p>
          )}
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-4 space-y-4">
          <h2 className="font-bold text-gray-900">Your Details</h2>
          <Input
            label="Your Name"
            placeholder="Enter your name"
            value={customerName}
            onChange={(e) => setCustomerInfo(e.target.value, customerMobile)}
            error={errors.name}
          />
          <Input
            label="Mobile Number"
            placeholder="10-digit mobile number"
            type="tel"
            maxLength={10}
            value={customerMobile}
            onChange={(e) => setCustomerInfo(customerName, e.target.value)}
            error={errors.mobile}
          />
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <StickyNote className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-gray-900">Special Instructions</h2>
          </div>
          <textarea
            placeholder="E.g. Less spicy, no onion..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 safe-bottom">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">
            {getTotalItems()} item{getTotalItems() > 1 ? "s" : ""}
          </span>
          <span className="text-xl font-black text-gray-900">{formatCurrency(getTotalAmount())}</span>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={handlePlaceOrder}
          loading={isPlacing}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}
