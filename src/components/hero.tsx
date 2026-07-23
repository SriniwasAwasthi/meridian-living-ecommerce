"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Eye, RotateCcw, ShieldCheck, ShoppingBag, Sparkles, Truck, LifeBuoy } from "lucide-react";
import { scrollToId, useApp } from "@/components/app-provider";
import { Price, Stars } from "@/components/ui";

const TRUST = [
  { icon: Truck, title: "Free Shipping", sub: "On orders over $75" },
  { icon: ShieldCheck, title: "Secure Checkout", sub: "256-bit encrypted" },
  { icon: LifeBuoy, title: "24/7 Support", sub: "Real humans, always" },
  { icon: RotateCcw, title: "Easy Returns", sub: "30 days, no questions" },
];

export function Hero() {
  const { products, addToCart, setUi, setFilters, resetFilters } = useApp();
  const spotlight = products?.find((p) => p.slug === "ambient-glow-lamp") ?? products?.[0];
  const bgRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (bgRef.current) bgRef.current.style.transform = `translateY(${y * 0.28}px) scale(1.06)`;
        if (cardRef.current) cardRef.current.style.transform = `translateY(${y * -0.08}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* background */}
      <div ref={bgRef} className="absolute inset-0 -z-10 scale-[1.06] will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero.jpg"
          alt="A warm, atmospheric Meridian Living interior corner at dusk"
          className="h-[115%] w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 hero-vignette" />

      {/* floating mood orbs */}
      <div className="pointer-events-none absolute top-1/4 left-[8%] -z-10 size-72 rounded-full bg-teal/8 blur-3xl" />
      <div className="pointer-events-none absolute right-[12%] bottom-1/3 -z-10 size-80 rounded-full bg-lilac/8 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-4 pt-36 pb-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pt-40">
        {/* copy */}
        <div>
          <div className="pop-in inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles size={13} className="text-gold" />
            <span className="text-[0.65rem] font-semibold tracking-[0.28em] text-gold-2 uppercase">
              The Autumn Edit · Now live
            </span>
          </div>

          <h1 className="pop-in mt-6 font-display text-4xl leading-[1.08] font-semibold tracking-tight text-ivory [animation-delay:120ms] sm:text-5xl lg:text-[3.9rem]">
            Discover Curated Essentials That{" "}
            <em className="text-gold-grad not-italic italic">Elevate</em> Everyday Living
          </h1>

          <p className="pop-in mt-6 max-w-xl text-base leading-relaxed text-ivory-dim [animation-delay:220ms] sm:text-lg">
            Premium pieces for home, work and gifting — hand-selected by our studio for beauty,
            function and the quiet luxury of a life well-arranged.
          </p>

          <div className="pop-in mt-9 flex flex-wrap items-center gap-4 [animation-delay:320ms]">
            <button
              type="button"
              onClick={() => {
                resetFilters();
                scrollToId("shop");
              }}
              className="btn-gold group flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold tracking-wide"
            >
              <ShoppingBag size={16} />
              Shop Collection
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => {
                resetFilters();
                setFilters({ sort: "newest" });
                scrollToId("shop");
              }}
              className="btn-ghost flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide"
            >
              <Sparkles size={15} className="text-teal" />
              Explore New Arrivals
            </button>
          </div>

          {/* social proof */}
          <div className="pop-in mt-10 flex items-center gap-4 [animation-delay:420ms]">
            <div className="flex -space-x-2">
              {[
                ["E", "from-teal/60 to-teal/20 text-teal"],
                ["M", "from-lilac/60 to-lilac/20 text-lilac"],
                ["J", "from-coral/60 to-coral/20 text-coral"],
                ["A", "from-gold/60 to-gold/20 text-gold-2"],
              ].map(([l, s]) => (
                <span
                  key={l}
                  className={`grid size-9 place-items-center rounded-full border border-night bg-gradient-to-br text-xs font-bold ${s}`}
                >
                  {l}
                </span>
              ))}
            </div>
            <div className="text-xs leading-relaxed text-mist">
              <Stars value={4.9} size={12} className="mb-0.5" />
              <p>
                <span className="font-semibold text-ivory">50,000+</span> happy customers styling
                their corners with Meridian Living
              </p>
            </div>
          </div>
        </div>

        {/* spotlight card */}
        {spotlight && (
          <div ref={cardRef} className="will-change-transform">
            <div className="animate-float pop-in relative mx-auto max-w-sm [animation-delay:200ms]">
              <div className="glass card-lift relative overflow-hidden rounded-[2rem] p-5">
                <span className="absolute top-5 left-5 z-10 rounded-full bg-night/60 px-3 py-1 text-[0.6rem] font-bold tracking-[0.22em] text-gold-2 uppercase backdrop-blur-md">
                  Featured Spotlight
                </span>
                <div className="group overflow-hidden rounded-3xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={spotlight.image}
                    alt={spotlight.name}
                    className="aspect-[5/5] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.65rem] tracking-[0.25em] text-teal uppercase">{spotlight.category}</p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-ivory">{spotlight.name}</h3>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Stars value={spotlight.rating} size={12} />
                      <span className="text-[0.7rem] text-mist">({spotlight.reviewCount})</span>
                    </div>
                  </div>
                  <Price cents={spotlight.price} original={spotlight.originalPrice} className="shrink-0 flex-col items-end" />
                </div>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => addToCart(spotlight.slug)}
                    className="btn-gold flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-xs font-bold tracking-widest uppercase"
                  >
                    <ShoppingBag size={14} /> Add to cart
                  </button>
                  <button
                    type="button"
                    aria-label="Quick view"
                    onClick={() => setUi({ quickView: spotlight.slug })}
                    className="btn-ghost grid size-11 place-items-center rounded-full"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
              {/* glow */}
              <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gold/10 blur-3xl" />
            </div>
          </div>
        )}
      </div>

      {/* trust strip */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="glass pop-in grid grid-cols-2 gap-px overflow-hidden rounded-3xl [animation-delay:500ms] lg:grid-cols-4">
          {TRUST.map((t) => (
            <div
              key={t.title}
              className="group flex items-center gap-3.5 px-5 py-4 transition-colors duration-300 hover:bg-gold/[0.06]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <t.icon size={17} />
              </span>
              <span>
                <span className="block text-xs font-bold tracking-wide text-ivory">{t.title}</span>
                <span className="block text-[0.68rem] text-mist">{t.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
