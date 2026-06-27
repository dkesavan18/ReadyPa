"use client";

import { useState, useEffect, useRef } from "react";
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
import { formatCurrency, formatOrderNumber, getRelativeTime } from "@/lib/utils";
import { useOrderStore } from "@/store/orderStore";
import { useHotelStore } from "@/store/hotelStore";
import { OrderLoading } from "@/components/shared/OrderLoading";
import { ReasonSheet } from "@/components/hotel/ReasonSheet";
import {
  buildOrderRejectPresets,
  PAYMENT_REJECT_PRESETS,
} from "@/data/rejectReasons";
import toast from "react-hot-toast";

type ReasonFlow = "reject" | "payment_reject" | null;

export default function HotelOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { getOrderById, updateOrderStatus, updateOrder, syncOrders, isSyncing } = useOrderStore();
  const { loggedInHotel, updateHotel } = useHotelStore();

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [reasonFlow, setReasonFlow] = useState<ReasonFlow>(null);
  const [upiId, setUpiId] = useState(loggedInHotel?.upiId || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialSyncDone, setInitialSyncDone] = useState(false);
  const syncAttempted = useRef(false);

  const order = getOrderById(id);

  useEffect(() => {
    if (syncAttempted.current) return;
    syncAttempted.current = true;
    syncOrders().finally(() => setInitialSyncDone(true));
  }, [syncOrders]);

  if (!order && (!initialSyncDone || isSyncing)) {
    return <OrderLoading />;
  }

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
    await updateOrderStatus(order.id, "WAITING_FOR_PAYMENT");
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
      case "payment_received":
        await updateOrder(order.id, {
          status: "PAYMENT_VERIFIED",
          paymentRejectReason: null,
        });
        toast.success("Payment verified!");
        break;
      case "preparing":
        await updateOrderStatus(order.id, "PREPARING");
        toast.success("Order is being prepared!");
        break;
      case "ready":
        await updateOrderStatus(order.id, "READY");
        toast.success(
          order.orderNumber != null
            ? `${formatOrderNumber(order.orderNumber)} ready — ${order.customerName}`
            : `Order ready for ${order.customerName}`
        );
        break;
      case "complete":
        await updateOrderStatus(order.id, "COLLECTED");
        toast.success(
          order.orderNumber != null
            ? `${formatOrderNumber(order.orderNumber)} collected — ${order.customerName}`
            : `Order collected by ${order.customerName}`
        );
        break;
    }
    setIsUpdating(false);
  };

  const handleReasonConfirm = async (reason: string) => {
    setIsUpdating(true);
    try {
      if (reasonFlow === "reject") {
        await updateOrder(order.id, { status: "REJECTED", rejectReason: reason });
        toast.error("Order rejected");
        setReasonFlow(null);
        router.push("/hotel/orders");
      } else if (reasonFlow === "payment_reject") {
        await updateOrder(order.id, {
          status: "WAITING_FOR_PAYMENT",
          paymentRejectReason: reason,
        });
        toast.error("Customer notified about payment");
        setReasonFlow(null);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const reasonPresets =
    reasonFlow === "reject"
      ? buildOrderRejectPresets(order.items)
      : reasonFlow === "payment_reject"
      ? PAYMENT_REJECT_PRESETS
      : [];

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-soft px-4 py-4 flex items-center gap-3">
        <Link href="/hotel/orders" className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-black text-gray-900">Order Details</h1>
          <p className="text-xs text-gray-500">
            {order.orderNumber != null
              ? formatOrderNumber(order.orderNumber)
              : `#${order.id.slice(-8).toUpperCase()}`}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Customer Info */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
          {order.status === "READY" && order.orderNumber != null && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-3 py-3 text-center">
              <p className="text-xs text-green-700">
                Order number is{" "}
                <span className="text-2xl font-black text-green-800 tabular-nums">
                  {formatOrderNumber(order.orderNumber)}
                </span>
              </p>
              <p className="text-[11px] text-green-600 mt-1">Write on parcel — {order.customerName}</p>
            </div>
          )}
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

        {/* Waiting for Payment */}
        {(order.status === "WAITING_FOR_PAYMENT" || order.status === "ACCEPTED") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-orange-50 rounded-2xl border border-orange-200 p-5 text-center"
          >
            <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-bold text-orange-900">Waiting for Customer Payment</h3>
            <p className="text-sm text-orange-700 mt-1">
              Customer will pay via UPI and confirm. You will be notified when payment is submitted.
            </p>
          </motion.div>
        )}

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
                onClick={() => setReasonFlow("payment_reject")}
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
                onClick={() => setReasonFlow("reject")}
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

      <ReasonSheet
        open={reasonFlow !== null}
        onClose={() => setReasonFlow(null)}
        title={reasonFlow === "reject" ? "Reject order" : "Payment not received"}
        description="Pick a message or write your own. The customer will see this."
        presets={reasonPresets}
        confirmLabel={reasonFlow === "reject" ? "Reject order" : "Notify customer"}
        loading={isUpdating}
        onConfirm={handleReasonConfirm}
      />

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
