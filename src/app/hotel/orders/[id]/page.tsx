"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft, Phone, Clock, CreditCard, CheckCircle,
  XCircle, ChefHat, Package, AlertCircle, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { formatCurrency, getRelativeTime } from "@/lib/utils";
import { useOrderStore } from "@/store/orderStore";
import { useHotelStore } from "@/store/hotelStore";
import toast from "react-hot-toast";

export default function HotelOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { getOrderById, updateOrderStatus } = useOrderStore();
  const { loggedInHotel, updateHotel } = useHotelStore();

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [upiId, setUpiId] = useState(loggedInHotel?.upiId || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const order = getOrderById(id);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl">😕</span>
          <p className="text-gray-500 mt-4">Order not found</p>
          <Link href="/hotel/orders" className="text-primary font-semibold mt-2 block">
            Go back
          </Link>
        </div>
      </div>
    );
  }

  const handleAccept = () => {
    if (!loggedInHotel?.upiId && !loggedInHotel?.upiQrUrl) {
      setShowPaymentDialog(true);
    } else {
      doAccept();
    }
  };

  const doAccept = async () => {
    setIsUpdating(true);
    await new Promise((r) => setTimeout(r, 600));
    await updateOrderStatus(order.id, "ACCEPTED");
    toast.success("Order accepted!");
    setIsUpdating(false);
  };

  const handleSavePaymentAndAccept = async () => {
    if (!upiId.trim()) {
      toast.error("Please enter UPI ID");
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    if (loggedInHotel) {
      updateHotel(loggedInHotel.id, { upiId });
    }
    setShowPaymentDialog(false);
    await doAccept();
    setIsSaving(false);
  };

  const handleAction = async (action: string) => {
    setIsUpdating(true);
    await new Promise((r) => setTimeout(r, 500));
    switch (action) {
      case "reject":
        await updateOrderStatus(order.id, "REJECTED");
        toast.error("Order rejected");
        router.push("/hotel/orders");
        break;
      case "payment_received":
        await updateOrderStatus(order.id, "PAYMENT_VERIFIED");
        toast.success("Payment verified!");
        break;
      case "payment_not_received":
        await updateOrderStatus(order.id, "WAITING_FOR_PAYMENT");
        toast.error("Payment not received. Customer notified.");
        break;
      case "preparing":
        await updateOrderStatus(order.id, "PREPARING");
        toast.success("Order is being prepared!");
        break;
      case "ready":
        await updateOrderStatus(order.id, "READY");
        toast.success("Order is ready for pickup!");
        break;
      case "complete":
        await updateOrderStatus(order.id, "COLLECTED");
        toast.success("Order completed!");
        break;
    }
    setIsUpdating(false);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-soft px-4 py-4 flex items-center gap-3">
        <Link href="/hotel/orders" className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-black text-gray-900">Order Details</h1>
          <p className="text-xs text-gray-500">#{order.id.slice(-8).toUpperCase()}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Customer Info */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-lg">👤</span>
            Customer Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Name</span>
              <span className="text-sm font-semibold text-gray-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Mobile</span>
              <a
                href={`tel:${order.customerMobile}`}
                className="flex items-center gap-1 text-sm font-semibold text-primary"
              >
                <Phone className="h-3.5 w-3.5" />
                {order.customerMobile}
              </a>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Pickup Time</span>
              <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                {order.pickupTime}
              </span>
            </div>
            {order.notes && (
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <p className="text-xs text-amber-700 font-medium">Special Instructions:</p>
                <p className="text-sm text-amber-900 mt-0.5">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <span className="text-sm text-gray-900 font-medium">{item.productName}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-xl font-black text-primary">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Payment Submitted Alert */}
        {order.status === "PAYMENT_SUBMITTED" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-50 rounded-2xl border border-purple-200 p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-purple-900">Payment Submitted</h3>
                <p className="text-xs text-purple-600">Customer says they have paid</p>
              </div>
            </div>
            <p className="text-sm text-purple-700 mb-4">
              Check your UPI app for ₹{order.totalAmount.toFixed(0)} from {order.customerName}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="success"
                onClick={() => handleAction("payment_received")}
                loading={isUpdating}
                className="text-sm"
              >
                <CheckCircle className="h-4 w-4" />
                Received
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction("payment_not_received")}
                loading={isUpdating}
                className="text-sm"
              >
                <XCircle className="h-4 w-4" />
                Not Received
              </Button>
            </div>
          </motion.div>
        )}

        {/* Order meta */}
        <p className="text-center text-xs text-gray-400">
          Placed {getRelativeTime(order.createdAt)}
        </p>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 safe-bottom">
        <AnimatePresence mode="wait">
          {order.status === "PENDING" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-3"
            >
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleAction("reject")}
                loading={isUpdating}
              >
                <XCircle className="h-4 w-4" /> Reject
              </Button>
              <Button
                className="flex-1 flex-grow-2"
                onClick={handleAccept}
                loading={isUpdating}
              >
                <CheckCircle className="h-4 w-4" /> Accept Order
              </Button>
            </motion.div>
          )}

          {order.status === "PAYMENT_VERIFIED" && (
            <motion.div key="payment_verified" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleAction("preparing")}
                loading={isUpdating}
              >
                <ChefHat className="h-5 w-5" /> Start Preparing
              </Button>
            </motion.div>
          )}

          {order.status === "PREPARING" && (
            <motion.div key="preparing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                className="w-full"
                size="lg"
                variant="success"
                onClick={() => handleAction("ready")}
                loading={isUpdating}
              >
                <Package className="h-5 w-5" /> Mark as Ready
              </Button>
            </motion.div>
          )}

          {order.status === "READY" && (
            <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <Button
                className="w-full"
                variant="muted"
                onClick={() => {
                  toast.success("Customer notified!");
                }}
              >
                <Bell className="h-4 w-4" /> Notify Customer
              </Button>
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleAction("complete")}
                loading={isUpdating}
              >
                ✅ Mark as Collected
              </Button>
            </motion.div>
          )}

          {(order.status === "COLLECTED" || order.status === "REJECTED") && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                variant="muted"
                className="w-full"
                onClick={() => router.push("/hotel/orders")}
              >
                Back to Orders
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Payment Required Dialog */}
      <Dialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        title="Payment Info Missing"
        description="Add your UPI ID to accept orders"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-3 border border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Configure at least one payment method (UPI ID or QR Code) to accept this order.
            </p>
          </div>
          <Input
            label="UPI ID"
            placeholder="yourname@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            icon={<CreditCard className="h-4 w-4" />}
          />
          <div className="flex gap-3 mt-2">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSavePaymentAndAccept}
              loading={isSaving}
              className="flex-1"
            >
              Save & Accept
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
