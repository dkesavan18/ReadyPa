"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHotelStore } from "@/store/hotelStore";
import toast from "react-hot-toast";

export default function HotelLoginPage() {
  const router = useRouter();
  const { loginHotel } = useHotelStore();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!mobile) e.mobile = "Mobile number is required";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const hotel = loginHotel(mobile, password);
    if (hotel) {
      toast.success(`Welcome back, ${hotel.ownerName}!`);
      router.push("/hotel/dashboard");
    } else {
      toast.error("Invalid credentials. Try any demo hotel mobile.");
      setErrors({ mobile: "Check your mobile number", password: "Check your password" });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex flex-col">
      <div className="flex items-center px-4 py-5">
        <Link href="/" className="h-9 w-9 rounded-full hover:bg-white/80 flex items-center justify-center">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 text-3xl">
              🏨
            </div>
            <h1 className="text-2xl font-black text-gray-900">Hotel Login</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your orders and menu
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Mobile Number"
              placeholder="Registered mobile number"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              icon={<Phone className="h-4 w-4" />}
              error={errors.mobile}
            />

            <div className="relative">
              <Input
                label="Password"
                placeholder="Your password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full mt-6" size="lg" loading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-xs font-semibold text-amber-800 mb-2">Demo Login</p>
            <p className="text-xs text-amber-700">
              Mobile: <span className="font-mono font-bold">9876543210</span>
              <br />
              Password: <span className="font-mono font-bold">any password</span>
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            New hotel?{" "}
            <Link href="/hotel/register" className="text-secondary font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
