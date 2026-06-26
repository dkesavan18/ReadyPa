"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { RatingStars } from "@/components/shared/RatingStars";
import { formatTime, isHotelOpen } from "@/lib/utils";
import type { Hotel } from "@/types";

interface HotelCardProps {
  hotel: Hotel;
  index?: number;
}

export function HotelCard({ hotel, index = 0 }: HotelCardProps) {
  const open = isHotelOpen(hotel.openTime, hotel.closeTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <Link href={`/customer/hotel/${hotel.id}`} className="block">
        <div className="rounded-2xl bg-white shadow-card border border-gray-100 overflow-hidden hover:shadow-card-hover transition-all duration-300">
          <div className="relative h-44 w-full">
            {hotel.coverUrl ? (
              <Image
                src={hotel.coverUrl}
                alt={hotel.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <span className="text-5xl">🏨</span>
              </div>
            )}
            {!open && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-2xl">
                <span className="bg-white/90 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
                  Closed
                </span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  open
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {open ? "Open" : "Closed"}
              </span>
            </div>
            {hotel.logoUrl && (
              <div className="absolute bottom-3 left-3">
                <div className="h-10 w-10 rounded-xl border-2 border-white shadow-md overflow-hidden bg-white">
                  <Image
                    src={hotel.logoUrl}
                    alt={`${hotel.name} logo`}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base truncate">{hotel.name}</h3>
                <p className="text-xs text-secondary font-medium mt-0.5">{hotel.category}</p>
              </div>
              <RatingStars rating={hotel.rating} totalRatings={hotel.totalRatings} />
            </div>

            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{hotel.address}</span>
            </div>

            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span>
                {formatTime(hotel.openTime)} – {formatTime(hotel.closeTime)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
