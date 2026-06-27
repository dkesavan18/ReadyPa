export interface ReasonPreset {
  id: string;
  text: string;
}

export function buildOrderRejectPresets(
  items: { productName: string }[]
): ReasonPreset[] {
  const itemPresets = items.map((item) => ({
    id: `unavail-${item.productName}`,
    text: `Your ${item.productName} is not available right now.`,
  }));

  return [
    ...itemPresets,
    {
      id: "kitchen_closed",
      text: "Kitchen is closed for new orders right now.",
    },
    {
      id: "too_busy",
      text: "We are too busy right now. Please try again later.",
    },
    {
      id: "pickup_unavailable",
      text: "We cannot prepare this order for your pickup time.",
    },
  ];
}

export const PAYMENT_REJECT_PRESETS: ReasonPreset[] = [
  {
    id: "not_received",
    text: "Payment not received. Please check and call.",
  },
  {
    id: "wrong_amount",
    text: "Payment amount does not match. Please pay the correct amount and call.",
  },
  {
    id: "not_visible",
    text: "Payment is not showing in our UPI app yet. Please call us to confirm.",
  },
];
