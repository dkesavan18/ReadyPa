"use client";

import { useEffect, useState } from "react";
import { BottomSheet } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ReasonPreset } from "@/data/rejectReasons";
import { cn } from "@/lib/utils";

interface ReasonSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  presets: ReasonPreset[];
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: (reason: string) => void;
}

export function ReasonSheet({
  open,
  onClose,
  title,
  description,
  presets,
  confirmLabel = "Send to customer",
  loading = false,
  onConfirm,
}: ReasonSheetProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedId(null);
      setCustomReason("");
    }
  }, [open]);

  const pickPreset = (preset: ReasonPreset) => {
    setSelectedId(preset.id);
    setCustomReason(preset.text);
  };

  const handleConfirm = () => {
    const reason = customReason.trim();
    if (!reason) return;
    onConfirm(reason);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={title} description={description}>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Quick options
          </p>
          <div className="space-y-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => pickPreset(preset)}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors touch-manipulation",
                  selectedId === preset.id
                    ? "border-primary bg-primary/5 text-gray-900"
                    : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
                )}
              >
                {preset.text}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Or type your own message
          </label>
          <textarea
            value={customReason}
            onChange={(e) => {
              setCustomReason(e.target.value);
              setSelectedId(null);
            }}
            placeholder="Write a message for the customer..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            loading={loading}
            disabled={!customReason.trim()}
            className="flex-1"
            variant="destructive"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
