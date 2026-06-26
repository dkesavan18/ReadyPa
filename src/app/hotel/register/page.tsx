"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft, Building2, User, Phone, Lock, MapPin,
  Clock, Tag, CreditCard, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHotelStore } from "@/store/hotelStore";
import { generateId } from "@/lib/utils";
import { HOTEL_CATEGORIES as CAT_LIST } from "@/types";
import toast from "react-hot-toast";

const STEPS = ["Basic Info", "Location & Hours", "Payment", "Review"];

export default function HotelRegisterPage() {
  const router = useRouter();
  const { registerHotel, loginHotel } = useHotelStore();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    address: "",
    mapLocation: "",
    category: "",
    openTime: "08:00",
    closeTime: "22:00",
    upiId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.name.trim()) e.name = "Hotel name is required";
      if (!form.ownerName.trim()) e.ownerName = "Owner name is required";
      if (!form.mobile || !/^[6-9]\d{9}$/.test(form.mobile))
        e.mobile = "Valid 10-digit mobile required";
      if (!form.password || form.password.length < 6)
        e.password = "Password must be at least 6 characters";
      if (form.password !== form.confirmPassword)
        e.confirmPassword = "Passwords do not match";
    }
    if (s === 1) {
      if (!form.address.trim()) e.address = "Address is required";
      if (!form.category) e.category = "Select a category";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const hotel = {
      id: `hotel-${generateId()}`,
      name: form.name,
      ownerName: form.ownerName,
      mobile: form.mobile,
      address: form.address,
      mapLocation: form.mapLocation,
      category: form.category,
      openTime: form.openTime,
      closeTime: form.closeTime,
      upiId: form.upiId || undefined,
      isActive: true,
      rating: 0,
      totalRatings: 0,
      createdAt: new Date().toISOString(),
    };

    registerHotel(hotel);
    loginHotel(form.mobile, form.password);
    toast.success("Hotel registered successfully! 🎉");
    router.push("/hotel/dashboard");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-soft px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => (step > 0 ? prev() : router.push("/hotel/login"))}
          className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-black text-gray-900">Register Hotel</h1>
          <p className="text-xs text-gray-500">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-secondary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`text-[10px] font-medium ${
                i === step ? "text-secondary" : i < step ? "text-gray-400" : "text-gray-300"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Step 0 - Basic Info */}
          {step === 0 && (
            <>
              <Input
                label="Hotel Name"
                placeholder="e.g. Murugan Mess"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                icon={<Building2 className="h-4 w-4" />}
                error={errors.name}
              />
              <Input
                label="Owner Name"
                placeholder="Your full name"
                value={form.ownerName}
                onChange={(e) => update("ownerName", e.target.value)}
                icon={<User className="h-4 w-4" />}
                error={errors.ownerName}
              />
              <Input
                label="Mobile Number"
                placeholder="10-digit mobile"
                type="tel"
                maxLength={10}
                value={form.mobile}
                onChange={(e) => update("mobile", e.target.value)}
                icon={<Phone className="h-4 w-4" />}
                error={errors.mobile}
              />
              <Input
                label="Password"
                placeholder="Minimum 6 characters"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                error={errors.password}
              />
              <Input
                label="Confirm Password"
                placeholder="Re-enter password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                error={errors.confirmPassword}
              />
            </>
          )}

          {/* Step 1 - Location */}
          {step === 1 && (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Hotel Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CAT_LIST.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => update("category", cat)}
                      className={`py-2.5 px-3 rounded-xl text-sm font-medium text-left border transition-all ${
                        form.category === cat
                          ? "bg-secondary text-white border-secondary"
                          : "bg-white text-gray-700 border-gray-200 hover:border-secondary/40"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-xs text-red-500">{errors.category}</p>
                )}
              </div>

              <Input
                label="Hotel Address"
                placeholder="Street, City, Pincode"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                icon={<MapPin className="h-4 w-4" />}
                error={errors.address}
              />

              <Input
                label="Google Maps Link (optional)"
                placeholder="https://maps.google.com/..."
                value={form.mapLocation}
                onChange={(e) => update("mapLocation", e.target.value)}
                icon={<MapPin className="h-4 w-4" />}
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" /> Opening Time
                  </label>
                  <input
                    type="time"
                    value={form.openTime}
                    onChange={(e) => update("openTime", e.target.value)}
                    className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" /> Closing Time
                  </label>
                  <input
                    type="time"
                    value={form.closeTime}
                    onChange={(e) => update("closeTime", e.target.value)}
                    className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2 - Payment */}
          {step === 2 && (
            <>
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                <p className="text-sm text-primary font-medium">
                  Payment info is required to accept orders. You can add this later from settings.
                </p>
              </div>
              <Input
                label="UPI ID (optional)"
                placeholder="yourname@upi"
                value={form.upiId}
                onChange={(e) => update("upiId", e.target.value)}
                icon={<CreditCard className="h-4 w-4" />}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  UPI QR Code (optional)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-sm text-gray-500">Tap to upload QR code image</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>
            </>
          )}

          {/* Step 3 - Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 divide-y divide-gray-100">
                {[
                  { label: "Hotel Name", value: form.name },
                  { label: "Owner", value: form.ownerName },
                  { label: "Mobile", value: form.mobile },
                  { label: "Category", value: form.category },
                  { label: "Address", value: form.address },
                  { label: "Hours", value: `${form.openTime} – ${form.closeTime}` },
                  { label: "UPI ID", value: form.upiId || "Not set" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%] truncate">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="text-sm text-amber-800 font-medium">
                  Add at least one menu item after registration to start receiving orders.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 safe-bottom">
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={prev} className="flex-1">
              Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="flex-1">
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              variant="secondary"
              className="flex-1"
            >
              Register Hotel 🎉
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
