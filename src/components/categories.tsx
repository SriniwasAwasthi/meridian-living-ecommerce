"use client";

import { ArrowUpRight, Moon, Coffee, Armchair, Gem, Gift } from "lucide-react";
import { CATEGORIES, MOODS } from "@/lib/shop";
import { scrollToId, useApp } from "@/components/app-provider";
import { Reveal, SectionHead } from "@/components/ui";

const MOOD_ICONS = { Calm: Moon, Focus: Coffee, Cozy: Armchair, Luxury: Gem, Giftable: Gift } as const;

export function Categories() {
  const { products, setFilters } = useApp();

  return (
    <section id="categories" className="relative mx-auto max-w-7xl scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 size-[34rem] -translate-x-1/2 rounded-full bg-gold/[0.05] blur-3xl" />
      <SectionHead
        eyebrow="Rooms & Rituals"
        title={
          <>
            Shop by <em className="text-gold-grad italic">Category</em>
          </>
        }
        copy="Six worlds of considered objects — each piece auditioned for beauty, utility and staying power before it earns a place in the catalogue."
      />

      <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {CATEGORIES.map((cat, i) => {
          const count = products?.filter((p) => p.category === cat.name).length ?? 0;
          return (
            <Reveal key={cat.name} delay={i * 90}>
              <button
                type="button"
                onClick={() => {
                  setFilters({ category: cat.name, mood: null, query: "" });
                  scrollToId("shop");
                }}
                className="group relative block w-full overflow-hidden rounded-3xl border border-white/10 text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="aspect-[4/3.2] w-full object-cover transition-transform duration-[1100ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/35 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="text-[0.6rem] font-bold tracking-[0.25em] text-gold-2 uppercase">
                    {count || "Curated"} {count === 1 ? "piece" : "pieces"}
                  </span>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold text-ivory sm:text-2xl">{cat.name}</h3>
                    <span className="grid size-9 shrink-0 translate-y-2 place-items-center rounded-full border border-gold/40 bg-gold/15 text-gold-2 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                  <p className="mt-1 max-w-[90%] text-[0.72rem] leading-relaxed text-ivory-dim/90 opacity-0 transition-all duration-500 group-hover:opacity-100 sm:text-xs">
                    {cat.tagline}
                  </p>
                </div>
                <span className="absolute inset-0 rounded-3xl border border-gold/0 transition-colors duration-500 group-hover:border-gold/40" />
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* Curated by mood */}
      <Reveal delay={120} className="mt-16">
        <div className="glass relative overflow-hidden rounded-3xl px-6 py-8 sm:px-10">
          <div className="pointer-events-none absolute -top-16 right-10 size-56 rounded-full bg-lilac/10 blur-3xl" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="lg:max-w-xs">
              <p className="eyebrow">Curated by mood</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-ivory">
                How should it <em className="text-gold-grad italic">feel</em>?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-mist">
                Start with a feeling — the right objects follow.
              </p>
            </div>
            <div className="flex flex-1 flex-wrap gap-3">
              {MOODS.map((m) => {
                const Icon = MOOD_ICONS[m.name as keyof typeof MOOD_ICONS];
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => {
                      setFilters({ mood: m.name, category: "All", query: "" });
                      scrollToId("shop");
                    }}
                    className="group flex min-w-[8.5rem] flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-all duration-400 hover:-translate-y-1 hover:border-gold/50 hover:bg-gold/10"
                  >
                    <span className="grid size-9 place-items-center rounded-full bg-gold/10 text-gold-2 transition-transform duration-500 group-hover:scale-110">
                      <Icon size={15} />
                    </span>
                    <span className="text-left">
                      <span className="block text-sm font-semibold text-ivory">{m.name}</span>
                      <span className="block text-[0.62rem] text-mist">{m.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
