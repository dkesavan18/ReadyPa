"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, ChevronLeft } from "lucide-react";
import { HotelCard } from "@/components/customer/HotelCard";
import { HotelCardSkeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/Logo";
import { useHotelStore } from "@/store/hotelStore";

const CATEGORY_FILTERS = [
  { label: "All", value: "all", emoji: "🍽️" },
  { label: "Veg", value: "veg", emoji: "🥦" },
  { label: "Non Veg", value: "nonveg", emoji: "🍗" },
  { label: "Biryani", value: "biryani", emoji: "🍚" },
  { label: "Bakery", value: "bakery", emoji: "🍞" },
  { label: "Tea Shop", value: "tea", emoji: "☕" },
  { label: "Fast Food", value: "fastfood", emoji: "🍔" },
  { label: "Juice", value: "juice", emoji: "🥤" },
];

export default function CustomerHomePage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading] = useState(false);
  const { hotels } = useHotelStore();

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      if (!h.isActive) return false;
      const matchesSearch =
        !search ||
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.address.toLowerCase().includes(search.toLowerCase()) ||
        h.category.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "all") return true;
      if (activeFilter === "biryani") return h.category.toLowerCase().includes("biryani");
      if (activeFilter === "bakery") return h.category.toLowerCase().includes("bakery");
      if (activeFilter === "tea") return h.category.toLowerCase().includes("tea");
      if (activeFilter === "fastfood") return h.category.toLowerCase().includes("fast");
      if (activeFilter === "juice") return h.category.toLowerCase().includes("juice");
      return true;
    });
  }, [hotels, search, activeFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-soft">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link href="/" className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-black text-gray-900">Find Hotels</h1>
            <p className="text-xs text-gray-500">Order before you arrive</p>
          </div>
          <Logo showText={false} iconWidth={28} iconHeight={25} />
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <Input
            placeholder="Search hotels, food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="bg-gray-50 border-gray-200"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
          {CATEGORY_FILTERS.map((cat) => (
            <motion.button
              key={cat.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(cat.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                activeFilter === cat.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4 pb-24">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <HotelCardSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <span className="text-6xl mb-4">🔍</span>
            <h3 className="text-lg font-bold text-gray-700">No hotels found</h3>
            <p className="text-sm text-gray-500 mt-1">Try a different search or filter</p>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">
                {filtered.length} hotel{filtered.length !== 1 ? "s" : ""} nearby
              </p>
            </div>
            {filtered.map((hotel, i) => (
              <HotelCard key={hotel.id} hotel={hotel} index={i} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
