"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SheetHeaderProps {
  title?: string;
  description?: string;
  onClose: () => void;
  showHandle?: boolean;
}

function useLockBodyScroll(open: boolean) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
}

function SheetBackdrop({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    />
  );
}

function SheetHeader({
  title,
  description,
  onClose,
  showHandle = true,
}: SheetHeaderProps) {
  return (
    <div className="flex-shrink-0 border-b border-gray-100 px-4 pb-4 pt-3 dark:border-gray-800">
      {showHandle && (
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {title && (
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex-shrink-0 rounded-full p-2 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function Dialog({
  open,
  onClose,
  children,
  title,
  description,
}: DialogProps) {
  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <SheetBackdrop onClose={onClose} />

          {/* Mobile: full-width bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-3xl bg-white shadow-float dark:bg-gray-900 md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <SheetHeader
              title={title}
              description={description}
              onClose={onClose}
            />
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 safe-bottom">
              {children}
            </div>
          </motion.div>

          {/* Desktop: centered modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 hidden w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 md:block"
            role="dialog"
            aria-modal="true"
          >
            <div className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-float dark:bg-gray-900">
              <SheetHeader
                title={title}
                description={description}
                onClose={onClose}
                showHandle={false}
              />
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function BottomSheet({
  open,
  onClose,
  children,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <SheetBackdrop onClose={onClose} />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-3xl bg-white shadow-float dark:bg-gray-900"
            role="dialog"
            aria-modal="true"
          >
            <SheetHeader title={title} description={description} onClose={onClose} />
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 safe-bottom">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
