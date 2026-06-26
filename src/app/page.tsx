"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Clock, MapPin } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 py-5"
      >
        <Logo href="/" textSize={20} />
        <span className="text-xs text-gray-500 font-medium bg-white/80 px-3 py-1.5 rounded-full border border-gray-200">
          Beta
        </span>
      </motion.header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-4"
          >
            🍽️
          </motion.div>
          <h1 className="text-4xl font-black text-gray-900 leading-tight">
            Order Before
            <br />
            <span className="text-brand-ready">You </span>
            <span className="text-brand-pa">Arrive</span>
          </h1>
          <p className="text-gray-500 mt-3 text-base max-w-xs mx-auto leading-relaxed">
            Skip the waiting. Order from nearby hotels and pick up fresh food — ready when you reach.
          </p>
        </motion.div>

        {/* Feature Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {[
            { icon: <Zap className="h-3 w-3" />, text: "No waiting" },
            { icon: <Clock className="h-3 w-3" />, text: "Schedule pickup" },
            { icon: <MapPin className="h-3 w-3" />, text: "Nearby hotels" },
          ].map((chip) => (
            <div
              key={chip.text}
              className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-600 font-medium shadow-soft"
            >
              <span className="text-primary">{chip.icon}</span>
              {chip.text}
            </div>
          ))}
        </motion.div>

        {/* Main Cards */}
        <div className="w-full max-w-md space-y-4">
          {/* Customer Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/customer">
              <div className="relative overflow-hidden rounded-2xl bg-white border border-primary/20 shadow-card hover:shadow-card-hover transition-all duration-300 p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl flex-shrink-0">
                      🍛
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-black text-gray-900">Order Food</h2>
                      <div className="mt-2 space-y-1">
                        {[
                          "Browse nearby hotels",
                          "Order before reaching",
                          "Skip waiting",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-1.5 text-sm text-gray-600">
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3 text-white font-bold text-sm shadow-md hover:bg-primary-800 transition-colors">
                    Continue as Customer
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Hotel Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/hotel/login">
              <div className="relative overflow-hidden rounded-2xl bg-white border border-secondary/20 shadow-card hover:shadow-card-hover transition-all duration-300 p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-3xl flex-shrink-0">
                      🏨
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-black text-gray-900">Register Your Hotel</h2>
                      <div className="mt-2 space-y-1">
                        {[
                          "Receive online orders",
                          "Manage menus easily",
                          "Accept orders faster",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-1.5 text-sm text-gray-600">
                            <span className="h-1 w-1 rounded-full bg-secondary" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-center gap-2 w-full rounded-xl bg-secondary py-3 text-white font-bold text-sm shadow-md hover:bg-secondary-600 transition-colors">
                    Continue as Hotel
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-gray-400 mt-8 text-center"
        >
          Designed for rural & small-town India 🇮🇳
        </motion.p>
      </div>
    </main>
  );
}
