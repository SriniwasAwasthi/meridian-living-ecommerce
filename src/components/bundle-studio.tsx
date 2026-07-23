"use client";

import { useState } from "react";
import { Check, Plus, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { Price, SectionHead } from "@/components/ui";
import { cx, money, type Product } from "@/lib/shop";

export function BundleStudio() {
  const { products, addToCart, playSound } = useApp();
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  const catalog = (products || []).slice(0, 12);
  const selectedProducts = selectedSlugs
    .map((s) => catalog.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p));

  const count = selectedProducts.length;
  const isComplete = count >= 3;

  const rawTotalCents = selectedProducts.reduce((acc, p) => acc + p.price, 0);
  const discountCents = isComplete ? Math.round(rawTotalCents * 0.15) : 0;
  const finalTotalCents = rawTotalCents - discountCents;

  const toggleSelect = (slug: string) => {
    playSound("click");
    if (selectedSlugs.includes(slug)) {
      setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
    } else {
      if (selectedSlugs.length >= 3) {
        setSelectedSlugs((prev) => [...prev.slice(1), slug]);
      } else {
        setSelectedSlugs((prev) => [...prev, slug]);
      }
    }
  };

  const handleAddBundle = () => {
    if (selectedProducts.length === 0) return;
    playSound("cart");
    selectedProducts.forEach((p) => addToCart(p.slug, { bundle: isComplete }));
    setSelectedSlugs([]);
  };

  return (
    <section id="bundle-studio" className="relative scroll-mt-28 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Curate Your Set"
          title={
            <>
              Bundle Studio & <em className="text-gold-grad italic">Save 15%</em>
            </>
          }
          copy="Select 3 complementary items to build your personal luxury ritual and automatically unlock 15% savings across the set."
        />

        {/* Studio Progress & Summary Bar */}
        <div className="mt-10 glass rounded-3xl p-6 sm:p-8 border border-white/10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-gold" />
                <span className="text-xs font-bold tracking-widest text-gold-2 uppercase">
                  {isComplete ? "15% Bundle Discount Unlocked!" : `Pick ${3 - count} more ${3 - count === 1 ? "item" : "items"} to save 15%`}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="mt-3 h-2 w-full max-w-md rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-teal transition-all duration-500"
                  style={{ width: `${Math.min((count / 3) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Price & Add Bundle Button */}
            <div className="flex items-center justify-between gap-6 lg:justify-end">
              <div>
                <span className="block text-[0.62rem] font-bold text-mist tracking-widest uppercase">Bundle Value</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-ivory">{money(finalTotalCents)}</span>
                  {discountCents > 0 && (
                    <span className="text-xs text-coral line-through">{money(rawTotalCents)}</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                disabled={count === 0}
                onClick={handleAddBundle}
                className={cx(
                  "btn-gold rounded-full px-7 py-3.5 text-xs font-bold tracking-widest uppercase shadow-xl transition-all",
                  count === 0 && "opacity-40 cursor-not-allowed"
                )}
              >
                <ShoppingBag size={14} className="inline mr-2" /> Add Set to Cart ({count})
              </button>
            </div>
          </div>

          {/* Selected Tray */}
          {selectedProducts.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-6">
              {selectedProducts.map((p) => (
                <div key={p.slug} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="size-12 rounded-xl object-cover" />
                  <div className="min-w-0 max-w-[140px]">
                    <p className="truncate text-xs font-semibold text-ivory">{p.name}</p>
                    <p className="text-[0.65rem] text-gold-2">{money(p.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSelect(p.slug)}
                    className="text-mist hover:text-coral p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selection Cards Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {catalog.map((p) => {
            const isSelected = selectedSlugs.includes(p.slug);
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => toggleSelect(p.slug)}
                className={cx(
                  "group relative flex flex-col overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 glass",
                  isSelected ? "border-gold ring-2 ring-gold/40 bg-gold/10" : "border-white/10 hover:border-gold/50"
                )}
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  <span
                    className={cx(
                      "absolute top-2 right-2 grid size-6 place-items-center rounded-full border transition-all",
                      isSelected ? "border-gold bg-gold text-night" : "border-white/30 bg-night/60 text-ivory"
                    )}
                  >
                    {isSelected ? <Check size={12} /> : <Plus size={12} />}
                  </span>
                </div>
                <span className="text-[0.58rem] font-bold text-teal uppercase truncate">{p.category}</span>
                <h5 className="font-display text-xs font-semibold text-ivory line-clamp-1">{p.name}</h5>
                <span className="mt-1 text-xs font-bold text-gold-2">{money(p.price)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
