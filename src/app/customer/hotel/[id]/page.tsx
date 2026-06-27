"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Search, MapPin, Clock, Phone } from "lucide-react";
import { ProductCard } from "@/components/customer/ProductCard";
import { CartBar } from "@/components/customer/CartBar";
import { RatingStars } from "@/components/shared/RatingStars";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { formatTime, isHotelOpen } from "@/lib/utils";
import { useHotelStore } from "@/store/hotelStore";

export default function HotelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { hotels, getHotelCategories, getHotelProducts } = useHotelStore();
  const hotel = hotels.find((h) => h.id === id);
  const categories = useMemo(() => getHotelCategories(id), [id]);
  const allProducts = useMemo(() => getHotelProducts(id), [id]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesCat = !activeCategory || p.categoryId === activeCategory;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
      return matchesCat && matchesSearch;
    });
  }, [allProducts, activeCategory, search]);

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl">🏨</span>
          <p className="text-gray-500 mt-4">Hotel not found</p>
          <Link href="/customer/home" className="text-primary font-semibold mt-2 block">
            Go back
          </Link>
        </div>
      </div>
    );
  }

  const isOpen = isHotelOpen(hotel.openTime, hotel.closeTime);

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Cover Image */}
      <div className="relative h-52 w-full">
        {hotel.coverUrl ? (
          <Image
            src={hotel.coverUrl}
            alt={hotel.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary-100 to-secondary-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <Link
          href="/customer/home"
          className="absolute top-4 left-4 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </Link>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end gap-3">
            {hotel.logoUrl && (
              <div className="h-14 w-14 rounded-xl border-2 border-white overflow-hidden bg-white shadow-lg flex-shrink-0">
                <Image src={hotel.logoUrl} alt={hotel.name} width={56} height={56} className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-black text-white leading-tight">{hotel.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <RatingStars rating={hotel.rating} totalRatings={hotel.totalRatings} />
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isOpen ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                  }`}
                >
                  {isOpen ? "Open" : "Closed"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Info */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {hotel.address}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {formatTime(hotel.openTime)} – {formatTime(hotel.closeTime)}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-primary" />
            {hotel.mobile}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 bg-white sticky top-0 z-20 border-b border-gray-100 shadow-soft">
        <Input
          placeholder="Search in menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="h-4 w-4" />}
          className="bg-gray-50"
        />
      </div>

      {/* Category Tabs */}
      {categories.length > 0 && (
        <div className="bg-white sticky top-16 z-20 border-b border-gray-100">
          <div className="flex gap-1 px-4 py-3 overflow-x-auto overflow-y-hidden scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === null
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products by Category */}
      <div className="px-4 py-4 space-y-6">
        {categories.map((cat) => {
          const catProducts = filteredProducts.filter((p) => p.categoryId === cat.id);
          if (catProducts.length === 0) return null;
          return (
            <motion.section
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-base font-bold text-gray-900 mb-3">
                {cat.name}
              </h2>
              <div className="space-y-3">
                {catProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    hotelId={hotel.id}
                    hotelName={hotel.name}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <span className="text-5xl">🔍</span>
            <p className="text-gray-500 mt-4">No items found</p>
          </motion.div>
        )}
      </div>

      <CartBar />
    </div>
  );
}
