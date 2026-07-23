"use client";

import { useMemo, useState } from "react";
import { Check, Layers, ShoppingBag, Sparkles, Wand2 } from "lucide-react";
import { cx, money } from "@/lib/shop";
import { useApp } from "@/components/app-provider";
import { Reveal, SectionHead, Stars } from "@/components/ui";

const BUNDLE_CATEGORIES = new Set(["Desk Setup", "Smart Home", "Home Decor"]);

export function BuildYourCorner() {
  const { products, addToCart, notify, setUi } = useApp();
  const [picked, setPicked] = useState<string[]>([]);

  const eligible = useMemo(
    () => (products ?? []).filter((p) => BUNDLE_CATEGORIES.has(p.category)).slice(0, 6),
    [products],
  );
  const selected = eligible.filter((p) => picked.includes(p.slug));
  const listTotal = selected.reduce((n, p) => n + p.price, 0);
  const bundleTotal = Math.round(listTotal * 0.85);
  const ready = picked.length >= 3;

  const toggle = (slug: string) => {
    setPicked((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const autoPick = () => {
    const best = [...eligible].sort((a, b) => b.popularity - a.popularity).slice(0, 3);
    setPicked(best.map((p) => p.slug));
    notify("Stylist's trio selected", "Our most-loved combo — tweak it freely.", "success");
  };

  return (
    <section id="corner" className="relative scroll-mt-28 py-24">
      <div className="pointer-events-none absolute top-10 -right-32 -z-10 size-[26rem] rounded-full bg-teal/[0.06] blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Build your corner"
          title={
            <>
              Curate a corner, <em className="text-gold-grad italic">save 15%</em>
            </>
          }
          copy="Pick any three or more setup pieces and the bundle pricing applies automatically — styling included, decision fatigue excluded."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {eligible.map((p, i) => {
              const on = picked.includes(p.slug);
              return (
                <Reveal key={p.slug} delay={i * 70}>
                  <button
                    type="button"
                    onClick={() => toggle(p.slug)}
                    className={cx(
                      "group relative flex w-full items-center gap-4 rounded-3xl border p-3 text-left transition-all duration-400",
                      on
                        ? "border-gold/70 bg-gold/[0.09] shadow-[0_16px_44px_-16px_rgba(201,163,92,0.45)]"
                        : "glass hover:border-white/25",
                    )}
                  >
                    <span className="relative shrink-0 overflow-hidden rounded-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} loading="lazy" className="size-20 object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ivory">{p.name}</span>
                      <span className="mt-1 flex items-center gap-2">
                        <Stars value={p.rating} size={10} />
                        <span className="text-[0.65rem] text-mist">{p.rating.toFixed(1)}</span>
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-gold-2">{money(p.price)}</span>
                    </span>
                    <span
                      className={cx(
                        "grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300",
                        on ? "border-gold bg-gold text-night" : "border-white/25 text-transparent group-hover:border-gold/50",
                      )}
                    >
                      <Check size={14} strokeWidth={3} />
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={150}>
            <div className="glass-deep sticky top-32 rounded-[2rem] p-7">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-bold text-ivory">
                  <Layers size={16} className="text-gold" /> Your corner
                </p>
                <button
                  type="button"
                  onClick={autoPick}
                  className="flex items-center gap-1.5 rounded-full border border-lilac/40 bg-lilac/10 px-3 py-1.5 text-[0.65rem] font-semibold text-lilac transition-all hover:bg-lilac/20"
                >
                  <Wand2 size={11} /> Stylist's pick
                </button>
              </div>

              <div className="mt-5 space-y-2.5">
                {selected.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-center text-xs leading-relaxed text-mist">
                    Tap pieces on the left to start building.
                    <br />
                    Three or more unlocks 15% off.
                  </p>
                )}
                {selected.map((p) => (
                  <div key={p.slug} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-3 py-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="size-9 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-ivory">{p.name}</span>
                    <span className="text-xs font-semibold text-gold-2">
                      {money(Math.round(p.price * 0.85))}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-xs">
                <div className="flex justify-between text-mist">
                  <span>List price</span>
                  <span className={cx(ready && "line-through opacity-70")}>{money(listTotal)}</span>
                </div>
                <div className="flex justify-between text-teal">
                  <span>Bundle saving (15%)</span>
                  <span>−{money(listTotal - bundleTotal)}</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="font-bold text-ivory">Bundle total</span>
                  <span className="font-display text-2xl font-semibold text-gold-grad">
                    {money(ready ? bundleTotal : listTotal)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={!ready}
                onClick={() => {
                  selected.forEach((p) => addToCart(p.slug, { bundle: true, silent: true }));
                  notify("Corner added to cart", `${selected.length} pieces at 15% off.`, "cart");
                  setPicked([]);
                  setUi({ cartOpen: true });
                }}
                className={cx(
                  "mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-300",
                  ready ? "btn-gold" : "cursor-not-allowed border border-white/10 bg-white/[0.03] text-mist",
                )}
              >
                <ShoppingBag size={14} />
                {ready ? "Add bundle to cart" : `Pick ${3 - picked.length} more to save`}
              </button>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.62rem] text-mist">
                <Sparkles size={10} className="text-gold" /> Free shipping + gift wrap on all bundles
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}


