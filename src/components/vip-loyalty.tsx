"use client";

import { Crown, Gift, ShieldCheck, Sparkles, Star, Truck, X } from "lucide-react";
import { useApp } from "@/components/app-provider";

export function VipLoyaltyModal() {
  const { ui, setUi, user } = useApp();

  if (!ui.vipOpen) return null;
  const close = () => setUi({ vipOpen: false });

  const points = 890;
  const nextTierPoints = 1500;
  const progressPct = Math.min((points / nextTierPoints) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-night/80 backdrop-blur-md fade-in" onClick={close} />
      <div className="glass-deep relative max-w-lg w-full overflow-hidden rounded-3xl p-8 border border-gold/40 shadow-2xl pop-in">
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-full border border-white/10 text-mist hover:text-ivory"
        >
          <X size={15} />
        </button>

        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-gold/20 text-gold-2 border border-gold/40">
            <Crown size={22} />
          </span>
          <div>
            <span className="text-[0.62rem] font-bold tracking-[0.25em] text-gold-2 uppercase">Exclusive Membership</span>
            <h3 className="font-display text-2xl font-bold text-ivory">The Meridian Circle</h3>
          </div>
        </div>

        {/* Status Card */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-gold/20 via-night-2 to-night border border-gold/30 p-5">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[0.65rem] font-semibold text-mist uppercase tracking-widest">Current Status</p>
              <p className="font-display text-xl font-bold text-ivory mt-0.5">Gold Circle Tier</p>
            </div>
            <div className="text-right">
              <span className="font-display text-2xl font-bold text-gold-2">{points}</span>
              <span className="block text-[0.6rem] text-mist uppercase">Meridian Points</span>
            </div>
          </div>

          {/* Progress to Obsidian */}
          <div className="mt-4">
            <div className="flex justify-between text-[0.65rem] text-mist mb-1.5">
              <span>Progress to Obsidian Tier</span>
              <span>{points} / {nextTierPoints} PTS</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold to-lilac" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-bold tracking-widest text-mist uppercase">Your Unlocked Privileges</h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl glass p-3 border border-white/5 flex items-center gap-2.5">
              <Truck size={16} className="text-teal shrink-0" />
              <span className="text-ivory font-medium">Free Express Shipping</span>
            </div>
            <div className="rounded-xl glass p-3 border border-white/5 flex items-center gap-2.5">
              <Sparkles size={16} className="text-gold shrink-0" />
              <span className="text-ivory font-medium">Early Drop Access</span>
            </div>
            <div className="rounded-xl glass p-3 border border-white/5 flex items-center gap-2.5">
              <Gift size={16} className="text-lilac shrink-0" />
              <span className="text-ivory font-medium">Annual Luxury Gift</span>
            </div>
            <div className="rounded-xl glass p-3 border border-white/5 flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-gold-2 shrink-0" />
              <span className="text-ivory font-medium">Dedicated Concierge</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={close}
          className="btn-gold mt-6 w-full rounded-full py-3.5 text-xs font-bold tracking-widest uppercase"
        >
          Explore Member Collection
        </button>
      </div>
    </div>
  );
}
