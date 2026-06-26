"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft, Building2, MapPin, Clock, CreditCard,
  Phone, User, Save, LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHotelStore } from "@/store/hotelStore";
import { HOTEL_CATEGORIES as CAT_LIST } from "@/types";
import toast from "react-hot-toast";

export default function HotelSettingsPage() {
  const router = useRouter();
  const { loggedInHotel, updateHotel, logoutHotel } = useHotelStore();

  const [form, setForm] = useState({
    name: loggedInHotel?.name || "",
    ownerName: loggedInHotel?.ownerName || "",
    address: loggedInHotel?.address || "",
    category: loggedInHotel?.category || "",
    openTime: loggedInHotel?.openTime || "08:00",
    closeTime: loggedInHotel?.closeTime || "22:00",
    upiId: loggedInHotel?.upiId || "",
    mobile: loggedInHotel?.mobile || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  if (!loggedInHotel) {
    router.push("/hotel/login");
    return null;
  }

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    updateHotel(loggedInHotel.id, {
      name: form.name,
      ownerName: form.ownerName,
      address: form.address,
      category: form.category,
      openTime: form.openTime,
      closeTime: form.closeTime,
      upiId: form.upiId || undefined,
    });
    toast.success("Settings saved!");
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-soft px-4 py-4 flex items-center gap-3">
        <Link href="/hotel/dashboard" className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-black text-gray-900 flex-1">Settings</h1>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 space-y-4"
        >
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-4.5 w-4.5 text-primary" />
            Hotel Information
          </h2>
          <Input
            label="Hotel Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            icon={<Building2 className="h-4 w-4" />}
          />
          <Input
            label="Owner Name"
            value={form.ownerName}
            onChange={(e) => update("ownerName", e.target.value)}
            icon={<User className="h-4 w-4" />}
          />
          <Input
            label="Mobile (cannot change)"
            value={form.mobile}
            disabled
            icon={<Phone className="h-4 w-4" />}
          />
          <Input
            label="Address"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            icon={<MapPin className="h-4 w-4" />}
          />
        </motion.div>

        {/* Category */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-900">Business Category</h2>
          <div className="grid grid-cols-2 gap-2">
            {CAT_LIST.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => update("category", cat)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium text-left border transition-all ${
                  form.category === cat
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Timings */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-primary" />
            Operating Hours
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Opening Time</label>
              <input
                type="time"
                value={form.openTime}
                onChange={(e) => update("openTime", e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Closing Time</label>
              <input
                type="time"
                value={form.closeTime}
                onChange={(e) => update("closeTime", e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-4.5 w-4.5 text-primary" />
            Payment Settings
          </h2>

          {!form.upiId && (
            <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
              <p className="text-xs text-orange-700 font-medium">
                ⚠️ Add UPI ID to accept orders. Required to accept customer payments.
              </p>
            </div>
          )}

          <Input
            label="UPI ID"
            placeholder="yourname@upi"
            value={form.upiId}
            onChange={(e) => update("upiId", e.target.value)}
            icon={<CreditCard className="h-4 w-4" />}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">UPI QR Code</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
              <div className="text-3xl mb-2">📸</div>
              <p className="text-sm text-gray-500">Upload QR code image</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG – max 5MB</p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
          <h2 className="font-bold text-red-800 mb-3">Account</h2>
          <Button
            variant="destructive"
            onClick={() => {
              logoutHotel();
              router.push("/");
              toast.success("Logged out");
            }}
            className="w-full"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 safe-bottom">
        <Button
          className="w-full"
          size="lg"
          onClick={handleSave}
          loading={isSaving}
        >
          <Save className="h-5 w-5" /> Save Settings
        </Button>
      </div>
    </div>
  );
}
