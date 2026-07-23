"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, Flame, LockKeyhole, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { discountPct, money } from "@/lib/shop";
import { scrollToId, useApp } from "@/components/app-provider";
import { Badge, Price, Reveal, SectionHead, Stars, WishHeart } from "@/components/ui";

export function Trending() {
  const { products, addToCart, setUi, setFilters } = useApp();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const trending = useMemo(
    () => (products ?? []).filter((p) => p.isTrending || p.badge === "Bestseller"),
    [products],
  );

  const check = () => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 12);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 12);
  };

  useEffect(() => {
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [trending.length]);

  const nudge = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 330, behavior: "smooth" });
  };

  return (
    <section id="trending" className="relative scroll-mt-28 overflow-hidden py-24">
      <div className="pointer-events-none absolute top-24 -right-40 -z-10 size-[30rem] rounded-full bg-coral/[0.06] blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            align="left"
            eyebrow="Bestsellers · Trending now"
            title={
              <>
                What the <em className="text-gold-grad italic">Circle</em> is loving
              </>
            }
          />
          <Reveal delay={120} className="hidden gap-3 sm:flex">
            <button
              type="button"
              aria-label="Scroll left"
              disabled={atStart}
              onClick={() => nudge(-1)}
              className="grid size-11 place-items-center rounded-full border border-white/12 text-ivory transition-all duration-300 hover:border-gold/60 hover:text-gold-2 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              disabled={atEnd}
              onClick={() => nudge(1)}
              className="grid size-11 place-items-center rounded-full border border-white/12 text-ivory transition-all duration-300 hover:border-gold/60 hover:text-gold-2 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowRight size={16} />
            </button>
          </Reveal>
        </div>
      </div>

      <div className="mt-12">
        <div
          ref={railRef}
          onScroll={check}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        >
          {trending.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90} className="snap-start">
              <article className="group glass card-lift relative flex h-full w-[19rem] shrink-0 flex-col overflow-hidden rounded-3xl sm:w-[21rem]">
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[4/3.4] w-full object-cover transition-transform duration-[1000ms] group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge tone="coral">
                      <TrendingUp size={10} /> Trending
                    </Badge>
                    {discountPct(p) > 0 && <Badge tone="gold">−{discountPct(p)}%</Badge>}
                  </div>
                  <div className="absolute top-4 right-4">
                    <WishHeart slug={p.slug} />
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-night/60 px-3 py-1.5 text-[0.65rem] font-medium text-ivory-dim backdrop-blur-md">
                    <Users size={11} className="text-teal" />
                    {(p.reviewCount * 3 + 400).toLocaleString()} bought this month
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg leading-snug font-semibold text-ivory">{p.name}</h3>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Stars value={p.rating} size={11} />
                        <span className="text-[0.65rem] text-mist">{p.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <Price cents={p.price} original={p.originalPrice} className="shrink-0 flex-col items-end" />
                  </div>
                  {p.stock <= 8 && (
                    <p className="mt-3 flex items-center gap-1.5 text-[0.68rem] font-semibold text-coral">
                      <Clock3 size={11} /> Low stock — only {p.stock} remaining
                    </p>
                  )}
                  <div className="mt-auto flex gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => addToCart(p.slug)}
                      className="btn-gold flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[0.66rem] font-bold tracking-widest uppercase"
                    >
                      <ShoppingBag size={13} /> Add to cart
                    </button>
                    <button
                      type="button"
                      onClick={() => setUi({ quickView: p.slug })}
                      className="btn-ghost rounded-full px-4 py-2.5 text-[0.66rem] font-semibold tracking-widest uppercase"
                    >
                      View
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}

          {/* end cap */}
          <Reveal delay={200} className="snap-start">
            <button
              type="button"
              onClick={() => {
                setFilters({ sort: "popular" });
                scrollToId("shop");
              }}
              className="group flex h-full w-52 shrink-0 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-gold/30 bg-gold/[0.04] text-center transition-all duration-500 hover:border-gold/70 hover:bg-gold/[0.08]"
            >
              <span className="grid size-14 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-2 transition-transform duration-500 group-hover:scale-110">
                <ArrowRight size={20} />
              </span>
              <span className="px-6 font-display text-lg font-semibold text-ivory">
                Browse the full collection
              </span>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Limited drop ------------------------------ */

function nextDropEnd(): number {
  const now = new Date();
  const end = new Date(now);
  end.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  end.setHours(23, 59, 59, 0);
  return end.getTime();
}

export function LimitedDrop() {
  const { products, addToCart, setUi, productBySlug } = useApp();
  const [mounted, setMounted] = useState(false);
  const [target, setTarget] = useState<number>(0);
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    setTarget(nextDropEnd());
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const drop = productBySlug("soy-wax-amber-candle-trio-set") || productBySlug("luxury-soy-candle-trio-gift-set") || (products ?? [])[0];

  const diff = mounted ? Math.max(target - now, 0) : 3 * 86400000 + 5 * 3600000;
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff / 3_600_000) % 24);
  const m = Math.floor((diff / 60_000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const cells = [
    ["Days", d],
    ["Hours", h],
    ["Min", m],
    ["Sec", s],
  ] as const;

  return (
    <section id="drop" className="relative scroll-mt-28 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/25">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/limited-drop.jpg"
              alt="The Meridian Living limited edition gift vault"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-night via-night/75 to-night/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-night/30" />

            <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
              <div>
                <Badge tone="gold">
                  <LockKeyhole size={10} /> Limited Drop · 300 numbered sets
                </Badge>
                <h2 className="mt-5 font-display text-3xl leading-tight font-semibold text-ivory sm:text-4xl lg:text-[2.8rem]">
                  The Gilded Vault, <em className="text-gold-grad italic">Vol. II</em>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory-dim sm:text-base">
                  A once-a-season curation: the Aurelia candle trio in black lacquer, hand-numbered,
                  wrapped in gold foil. When the timer ends, so does the vault.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => drop && addToCart(drop.slug)}
                    className="btn-gold ping-ring flex items-center gap-2 rounded-full px-7 py-3.5 text-xs font-bold tracking-widest uppercase"
                  >
                    <Flame size={14} /> Claim yours — {drop ? money(drop.price) : "$72"}
                  </button>
                  <button
                    type="button"
                    onClick={() => drop && setUi({ quickView: drop.slug })}
                    className="btn-ghost rounded-full px-7 py-3.5 text-xs font-semibold tracking-widest uppercase"
                  >
                    Peek inside
                  </button>
                </div>
              </div>

              <div className="flex items-center lg:justify-end">
                <div className="glass-deep rounded-3xl p-6 text-center sm:p-8">
                  <p className="text-[0.62rem] font-bold tracking-[0.3em] text-gold-2 uppercase">Vault closes in</p>
                  <div className="mt-4 flex gap-3">
                    {cells.map(([label, value]) => (
                      <div key={label} className="w-16 sm:w-20">
                        <div className="rounded-2xl border border-gold/25 bg-night/60 px-2 py-3.5 font-display text-2xl font-semibold text-ivory tabular-nums sm:text-3xl">
                          {String(value).padStart(2, "0")}
                        </div>
                        <p className="mt-2 text-[0.6rem] font-semibold tracking-[0.22em] text-mist uppercase">{label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 flex items-center justify-center gap-2 text-[0.68rem] text-coral">
                    <Flame size={11} /> 217 of 300 already claimed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
