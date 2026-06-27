"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Clock, MapPin } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

export default function CustomerLandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 py-5"
      >
        <Logo href="/" textSize={20} />
        <Link
          href="/"
          className="text-xs text-gray-500 font-medium hover:text-gray-700"
        >
          Back
        </Link>
      </motion.header>

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
            🍛
          </motion.div>
          <h1 className="text-4xl font-black text-gray-900 leading-tight">
            Order Before
            <br />
            <span className="text-brand-ready">You </span>
            <span className="text-brand-pa">Arrive</span>
          </h1>
          <p className="text-gray-500 mt-3 text-base max-w-xs mx-auto leading-relaxed">
            Pick a nearby hotel, order food, and collect when you reach — no waiting in line.
          </p>
        </motion.div>

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm"
        >
          <Link href="/customer/home">
            <Button className="w-full" size="lg">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-gray-400 mt-8 text-center"
        >
          Made for small-town India 🇮🇳
        </motion.p>
      </div>
    </main>
  );
}
