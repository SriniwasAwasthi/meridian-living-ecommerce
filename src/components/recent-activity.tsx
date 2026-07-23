"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import { useApp } from "@/components/app-provider";

type Activity = {
  id: number;
  user: string;
  location: string;
  productSlug: string;
  productName: string;
  timeAgo: string;
};

const RECENT_ACTIVITIES: Activity[] = [
  { id: 1, user: "Marcus T.", location: "New York", productSlug: "wireless-mechanical-keyboard", productName: "Wireless Mechanical Keyboard", timeAgo: "2 minutes ago" },
  { id: 2, user: "Elena R.", location: "Milan", productSlug: "ambient-glow-lamp", productName: "Ambient Glow Table Lamp", timeAgo: "5 minutes ago" },
  { id: 3, user: "Sophie B.", location: "London", productSlug: "matte-ceramic-ultrasonic-diffuser", productName: "Ceramic Aroma Diffuser", timeAgo: "12 minutes ago" },
  { id: 4, user: "David K.", location: "Tokyo", productSlug: "34-inch-ultrawide-curved-monitor", productName: "34-Inch Curved Monitor", timeAgo: "18 minutes ago" },
];

export function RecentActivityTicker() {
  const { setUi } = useApp();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show ticker every 14 seconds
    const interval = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
      setIndex((prev) => (prev + 1) % RECENT_ACTIVITIES.length);
    }, 14000);

    // Initial show after 4 seconds
    const initialTimer = setTimeout(() => setVisible(true), 4000);
    const initialHide = setTimeout(() => setVisible(false), 9000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
      clearTimeout(initialHide);
    };
  }, []);

  if (!visible) return null;
  const current = RECENT_ACTIVITIES[index];

  return (
    <div className="fixed bottom-6 left-6 z-40 pop-in glass-deep flex items-center gap-3 rounded-2xl p-3.5 border border-gold/30 shadow-2xl shadow-black/80 max-w-xs">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold-2 border border-gold/30">
        <ShoppingBag size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.6rem] font-bold text-teal uppercase tracking-wider">Recent Purchase</p>
        <p className="text-xs font-bold text-ivory truncate">{current.user} ({current.location})</p>
        <button
          type="button"
          onClick={() => setUi({ quickView: current.productSlug })}
          className="text-[0.65rem] text-gold-2 hover:underline truncate block"
        >
          {current.productName} • {current.timeAgo}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="text-mist hover:text-ivory p-1"
      >
        <X size={13} />
      </button>
    </div>
  );
}
