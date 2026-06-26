"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle, Clock, ChefHat, Package, Phone,
  QrCode, AlertCircle, Home, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { formatCurrency, getRelativeTime } from "@/lib/utils";
import { useOrderStore } from "@/store/orderStore";
import { useHotelStore } from "@/store/hotelStore";
import { useNotifications } from "@/hooks/useNotifications";
import type { OrderStatus } from "@/types";
import toast from "react-hot-toast";

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: "PENDING", label: "Order Placed", icon: <Clock className="h-4 w-4" /> },
  { status: "ACCEPTED", label: "Accepted", icon: <CheckCircle className="h-4 w-4" /> },
  { status: "PAYMENT_VERIFIED", label: "Payment OK", icon: <CheckCircle className="h-4 w-4" /> },
  { status: "PREPARING", label: "Preparing", icon: <ChefHat className="h-4 w-4" /> },
  { status: "READY", label: "Ready", icon: <Package className="h-4 w-4" /> },
  { status: "COLLECTED", label: "Collected", icon: <CheckCircle className="h-4 w-4" /> },
];

const STATUS_ORDER: OrderStatus[] = [
  "PENDING", "ACCEPTED", "WAITING_FOR_PAYMENT", "PAYMENT_SUBMITTED",
  "PAYMENT_VERIFIED", "PREPARING", "READY", "COLLECTED",
];

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, updateOrderStatus } = useOrderStore();
  const { hotels } = useHotelStore();
  const { requestPermission, sendNotification } = useNotifications();
  const [hasPaid, setHasPaid] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const order = getOrderById(id);
  const hotel = order ? hotels.find((h) => h.id === order.hotelId) : null;

  useEffect(() => {
    requestPermission();
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <span className="text-6xl mb-4">😕</span>
        <h2 className="text-xl font-black text-gray-900">Order not found</h2>
        <Link href="/customer">
          <Button className="mt-4">Go Home</Button>
        </Link>
      </div>
    );
  }

  const currentStatusIdx = STATUS_ORDER.indexOf(order.status);

  const handlePaymentSubmit = async () => {
    setIsSubmittingPayment(true);
    await new Promise((r) => setTimeout(r, 800));
    await updateOrderStatus(order.id, "PAYMENT_SUBMITTED");
    setHasPaid(true);
    toast.success("Payment confirmed! Hotel will verify shortly.");
    setIsSubmittingPayment(false);
  };

  const showPaymentSection =
    order.status === "WAITING_FOR_PAYMENT" || order.status === "ACCEPTED";

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-white shadow-soft px-4 py-4 flex items-center gap-3 sticky top-0 z-20">
        <Link href="/customer" className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <Home className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-black text-gray-900">Order Status</h1>
          <p className="text-xs text-gray-500">#{order.id.slice(-8).toUpperCase()}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Status Banner */}
        <motion.div
          key={order.status}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl p-5 text-center ${
            order.status === "REJECTED"
              ? "bg-red-50 border border-red-200"
              : order.status === "READY"
              ? "bg-green-50 border border-green-200"
              : "bg-primary/5 border border-primary/20"
          }`}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-5xl mb-3"
          >
            {order.status === "PENDING" && "⏳"}
            {order.status === "ACCEPTED" && "✅"}
            {order.status === "WAITING_FOR_PAYMENT" && "💸"}
            {order.status === "PAYMENT_SUBMITTED" && "🔄"}
            {order.status === "PAYMENT_VERIFIED" && "✅"}
            {order.status === "PREPARING" && "👨‍🍳"}
            {order.status === "READY" && "🎉"}
            {order.status === "COLLECTED" && "🙌"}
            {order.status === "REJECTED" && "❌"}
          </motion.div>
          <h2 className="font-black text-xl text-gray-900">
            {order.status === "PENDING" && "Waiting for hotel..."}
            {order.status === "ACCEPTED" && "Order Accepted!"}
            {order.status === "WAITING_FOR_PAYMENT" && "Complete Payment"}
            {order.status === "PAYMENT_SUBMITTED" && "Verifying payment..."}
            {order.status === "PAYMENT_VERIFIED" && "Payment Verified!"}
            {order.status === "PREPARING" && "Hotel is preparing..."}
            {order.status === "READY" && "Your order is Ready!"}
            {order.status === "COLLECTED" && "Order Collected 🎊"}
            {order.status === "REJECTED" && "Order Rejected"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {order.status === "PENDING" && "Usually takes 1-2 minutes"}
            {order.status === "ACCEPTED" && "Please complete your payment"}
            {order.status === "WAITING_FOR_PAYMENT" && "Scan QR or pay via UPI"}
            {order.status === "PAYMENT_SUBMITTED" && "Hotel is checking payment"}
            {order.status === "PAYMENT_VERIFIED" && "Food will be prepared now"}
            {order.status === "PREPARING" && `Pickup at ${order.pickupTime}`}
            {order.status === "READY" && "Head to hotel now!"}
            {order.status === "COLLECTED" && (
              <>
                Thank you for using{" "}
                <span className="font-poetsen">
                  <span className="text-brand-ready">Ready</span>
                  <span className="text-brand-pa">Pa</span>
                </span>
              </>
            )}
            {order.status === "REJECTED" && "Please contact hotel for info"}
          </p>
        </motion.div>

        {/* Progress Tracker */}
        {order.status !== "REJECTED" && (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Order Progress</h3>
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" />
              <div className="space-y-4">
                {STATUS_STEPS.map((step, idx) => {
                  const stepIdx = STATUS_ORDER.indexOf(step.status);
                  const done = stepIdx < currentStatusIdx || step.status === order.status;
                  const active = step.status === order.status;
                  return (
                    <div key={step.status} className="flex items-center gap-4 relative">
                      <motion.div
                        initial={false}
                        animate={{
                          backgroundColor: done ? "#6D28D9" : "#F3F4F6",
                          scale: active ? 1.15 : 1,
                        }}
                        className="h-8 w-8 rounded-full flex items-center justify-center z-10 flex-shrink-0"
                      >
                        <span className={done ? "text-white" : "text-gray-400"}>
                          {step.icon}
                        </span>
                      </motion.div>
                      <div>
                        <p className={`text-sm font-semibold ${done ? "text-gray-900" : "text-gray-400"}`}>
                          {step.label}
                        </p>
                        {active && (
                          <p className="text-xs text-primary animate-pulse">In progress...</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Payment Section */}
        <AnimatePresence>
          {showPaymentSection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-card border border-primary/20 p-5"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                Complete Payment
              </h3>

              {hotel?.upiId || hotel?.upiQrUrl ? (
                <>
                  <div className="bg-primary/5 rounded-xl p-4 text-center mb-4">
                    <p className="text-3xl font-black text-primary">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    {hotel.upiId && (
                      <p className="text-sm text-gray-600 mt-2">
                        UPI ID: <span className="font-semibold text-gray-900">{hotel.upiId}</span>
                      </p>
                    )}
                  </div>

                  {hotel.upiQrUrl && (
                    <div className="flex justify-center mb-4">
                      <div className="h-44 w-44 bg-gray-100 rounded-xl overflow-hidden border-2 border-primary/20 flex items-center justify-center">
                        <QrCode className="h-24 w-24 text-gray-400" />
                        <span className="sr-only">QR Code</span>
                      </div>
                    </div>
                  )}

                  {!hasPaid && order.status !== "PAYMENT_SUBMITTED" ? (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePaymentSubmit}
                      loading={isSubmittingPayment}
                    >
                      ✅ I Have Paid
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-xl border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-700 font-semibold text-sm">
                        Payment submitted – waiting for hotel confirmation
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-orange-800">
                        Online payment not set up
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        Please call the hotel to arrange payment
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${hotel?.mobile}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl font-semibold"
                  >
                    <Phone className="h-4 w-4" />
                    Call Hotel: {hotel?.mobile}
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.productName} × {item.quantity}
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-lg font-black text-primary">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
          {order.notes && (
            <div className="mt-3 bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 font-medium">Special instructions:</p>
              <p className="text-sm text-gray-700 mt-0.5">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Hotel Info */}
        {hotel && (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-3">{hotel.name}</h3>
            <p className="text-sm text-gray-500">{hotel.address}</p>
            <a
              href={`tel:${hotel.mobile}`}
              className="mt-3 flex items-center gap-2 text-primary font-semibold text-sm"
            >
              <Phone className="h-4 w-4" />
              {hotel.mobile}
            </a>
          </div>
        )}

        <p className="text-center text-xs text-gray-400">
          Placed {getRelativeTime(order.createdAt)} • Pickup at {order.pickupTime}
        </p>
      </div>
    </div>
  );
}
