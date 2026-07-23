"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Award, BadgeCheck, Compass, Leaf, Quote, Star } from "lucide-react";
import { scrollToId, useApp } from "@/components/app-provider";
import { Reveal, SectionHead, Stars } from "@/components/ui";

/* ------------------------------- Brand story ------------------------------- */

const VALUES = [
  {
    icon: Compass,
    title: "Curated, never crowded",
    copy: "Fewer than 40 pieces live in the catalogue at any time. Each one beat out dozens of candidates.",
  },
  {
    icon: Award,
    title: "Materials with a pedigree",
    copy: "Full-grain leather, solid oak, hand-poured soy wax — specified on paper, verified in person.",
  },
  {
    icon: Leaf,
    title: "Kind by default",
    copy: "Plastic-free packaging and carbon-neutral delivery on every order, at no cost to you.",
  },
];

export function BrandStory() {
  return (
    <section id="story" className="relative scroll-mt-28 overflow-hidden py-24">
      <div className="pointer-events-none absolute top-1/3 -left-40 -z-10 size-[28rem] rounded-full bg-teal/[0.05] blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/stock/atelier.jpg"
              alt="Hands shaping ceramics in the Meridian Living partner atelier"
              loading="lazy"
              className="aspect-[4/4.6] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />
          </div>
          <div className="glass-deep animate-float absolute -right-3 -bottom-6 w-56 rounded-3xl p-5 sm:-right-6">
            <p className="font-display text-3xl font-semibold text-gold-grad">2,140</p>
            <p className="mt-1 text-[0.7rem] leading-relaxed text-mist">
              artisan workshops audited before our first product shipped
            </p>
          </div>
          <div className="absolute -top-4 -left-4 -z-10 h-40 w-40 rounded-[2rem] border border-gold/25" />
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-semibold text-ivory sm:text-4xl lg:text-[2.7rem]">
              Built for the corners where life <em className="text-gold-grad italic">actually happens</em>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 text-sm leading-relaxed text-ivory-dim sm:text-base">
              Meridian Living began with a frustration: beautiful objects that broke, functional objects that
              were ugly, and marketplaces too crowded to trust. So we became the filter. Our studio
              travels, tests and lives with thousands of products a year — and keeps almost none of them.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ivory-dim sm:text-base">
              What survives is a catalogue of objects that earn their place in your home every single
              day: the lamp that makes 6pm feel softer, the dock that ends cable chaos, the throw
              that claims the good seat.
            </p>
          </Reveal>
          <div className="mt-8 space-y-5">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className="group flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-gold/25 bg-gold/10 text-gold-2 transition-all duration-500 group-hover:scale-110 group-hover:bg-gold/20">
                    <v.icon size={17} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ivory">{v.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-mist">{v.copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Lifestyle banner ----------------------------- */

export function LifestyleBanner() {
  const { setFilters } = useApp();
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = imgRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        el.style.transform = `translateY(${progress * -46}px) scale(1.12)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative h-[30rem] overflow-hidden rounded-[2.5rem] border border-white/10 sm:h-[34rem]">
          <div ref={imgRef} className="absolute inset-0 scale-[1.12] will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/stock/lifestyle.jpg"
              alt="A Meridian Living styled reading corner with armchair and warm lamplight"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-night/85 via-night/35 to-transparent" />
          <div className="relative flex h-full max-w-xl flex-col justify-center p-8 sm:p-14">
            <p className="eyebrow">The quiet corner</p>
            <h2 className="mt-4 font-display text-3xl leading-tight font-semibold text-ivory sm:text-4xl">
              Designed for golden hour, <em className="text-gold-grad italic">every hour</em>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory-dim">
              One lamp, one shelf, one ritual. Recreate this exact corner with pieces from the Home
              Decor edit — styled by our studio, shipped to your door.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => {
                  setFilters({ category: "Home Decor", mood: null, query: "" });
                  scrollToId("shop");
                }}
                className="btn-gold group flex items-center gap-2.5 rounded-full px-7 py-3.5 text-xs font-bold tracking-widest uppercase"
              >
                Shop the scene
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------- Testimonials ------------------------------- */

const METRICS = [
  { value: "50,000+", label: "Happy customers" },
  { value: "98%", label: "Satisfaction rate" },
  { value: "4.9 / 5", label: "Average rating" },
  { value: "48 hrs", label: "Avg. delivery, major regions" },
];

const REVIEWS = [
  {
    initials: "EM",
    name: "Elena Marsh",
    role: "Interior stylist, Austin",
    theme: "from-teal/50 to-teal/10 text-teal",
    quote:
      "The Ambient Glow lamp is the single most-complimented object in my home. The packaging alone felt like an event — Meridian Living understands ceremony.",
  },
  {
    initials: "JK",
    name: "James Kato",
    role: "Product designer, Seattle",
    theme: "from-lilac/50 to-lilac/10 text-lilac",
    quote:
      "Ordered the full desk edit on a Sunday night. It arrived Wednesday, every box plastic-free, every piece better than the photos. Rare and getting rarer.",
  },
  {
    initials: "AR",
    name: "Amara Reyes",
    role: "New homeowner, Chicago",
    theme: "from-coral/50 to-coral/10 text-coral",
    quote:
      "Their gift finder nailed a present for my impossibly picky sister in three questions. She now thinks I have taste. I just have Meridian Living.",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="relative scroll-mt-28 py-24">
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-gold/[0.05] blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Proof, not promises"
          title={
            <>
              Loved loudly, <em className="text-gold-grad italic">reviewed honestly</em>
            </>
          }
          copy="Every review below is from a verified Meridian Living order. We read all of them — the glowing and the grumpy."
        />

        <Reveal delay={80} className="mt-14">
          <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-3xl lg:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.label} className="group px-6 py-8 text-center transition-colors duration-300 hover:bg-gold/[0.05]">
                <p className="font-display text-3xl font-semibold text-gold-grad sm:text-4xl">{m.value}</p>
                <p className="mt-2 text-[0.68rem] font-semibold tracking-[0.2em] text-mist uppercase">{m.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 120}>
              <figure className="glass card-lift relative flex h-full flex-col rounded-3xl p-7">
                <Quote size={26} className="text-gold/40" fill="currentColor" strokeWidth={0} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ivory-dim">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3.5 border-t border-white/8 pt-5">
                  <span className={`grid size-11 place-items-center rounded-full border border-night bg-gradient-to-br text-xs font-bold ${r.theme}`}>
                    {r.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-ivory">
                      {r.name}
                      <BadgeCheck size={13} className="shrink-0 text-teal" />
                    </p>
                    <p className="truncate text-[0.68rem] text-mist">{r.role}</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-gold">
                    <Star size={12} fill="currentColor" strokeWidth={0} />
                    <span className="text-xs font-bold">5.0</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
