"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { cx, money, type Product } from "@/lib/shop";
import { useApp } from "@/components/app-provider";

/* ---------------- Scroll reveal wrapper ---------------- */

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "span";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      className={cx("reveal", seen && "revealed", className)}
      style={{ ["--reveal-delay" as never]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ---------------- Section heading ---------------- */

export function SectionHead({
  eyebrow,
  title,
  copy,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={cx("max-w-2xl", align === "center" ? "mx-auto text-center" : "")}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl leading-tight font-semibold text-ivory sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {copy ? <p className="mt-4 text-sm leading-relaxed text-mist sm:text-base">{copy}</p> : null}
    </Reveal>
  );
}

/* ---------------- Stars ---------------- */

export function Stars({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  const full = Math.floor(value);
  const half = value - full >= 0.4;
  return (
    <span className={cx("inline-flex items-center gap-0.5 text-gold", className)} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} size={size} fill="currentColor" strokeWidth={0} />;
        if (i === full && half)
          return (
            <span key={i} className="relative inline-flex" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-ivory/20" fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: size / 2 }}>
                <Star size={size} fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        return <Star key={i} size={size} className="text-ivory/20" fill="currentColor" strokeWidth={0} />;
      })}
    </span>
  );
}

/* ---------------- Price ---------------- */

export function Price({ cents, original, className, strikeClass }: { cents: number; original?: number; className?: string; strikeClass?: string }) {
  return (
    <span className={cx("inline-flex items-baseline gap-2", className)}>
      <span className="font-display text-lg font-semibold text-ivory">{money(cents)}</span>
      {original && original > cents ? (
        <span className={cx("text-xs text-mist line-through decoration-coral/70 decoration-[1.5px]", strikeClass)}>
          {money(original)}
        </span>
      ) : null}
    </span>
  );
}

/* ---------------- Wishlist heart ---------------- */

export function WishHeart({ slug, className }: { slug: string; className?: string }) {
  const { wishlist, toggleWish } = useApp();
  const active = wishlist.includes(slug);
  const [pop, setPop] = useState(0);
  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Save to wishlist"}
      onClick={(e) => {
        e.stopPropagation();
        setPop((n) => n + 1);
        toggleWish(slug);
      }}
      className={cx(
        "grid size-9 place-items-center rounded-full border backdrop-blur-md transition-all duration-300",
        active
          ? "border-coral/60 bg-coral/15 text-coral"
          : "border-white/15 bg-night/50 text-ivory/80 hover:border-coral/50 hover:text-coral",
        className,
      )}
    >
      <Heart
        key={pop}
        size={16}
        className={pop > 0 ? "heart-pop" : undefined}
        fill={active ? "currentColor" : "none"}
        strokeWidth={2}
      />
    </button>
  );
}

/* ---------------- Quantity stepper ---------------- */

export function QtyStepper({
  qty,
  onChange,
  small,
}: {
  qty: number;
  onChange: (delta: number) => void;
  small?: boolean;
}) {
  return (
    <div
      className={cx(
        "inline-flex items-center rounded-full border border-white/12 bg-white/[0.04]",
        small ? "h-8" : "h-10",
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(-1)}
        className="grid h-full w-8 place-items-center text-mist transition-colors hover:text-ivory"
      >
        <Minus size={13} />
      </button>
      <span className={cx("w-7 text-center font-semibold tabular-nums text-ivory", small ? "text-xs" : "text-sm")}>
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(1)}
        className="grid h-full w-8 place-items-center text-mist transition-colors hover:text-ivory"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

/* ---------------- Badges ---------------- */

export function Badge({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "teal" | "coral" | "lilac" }) {
  const tones = {
    gold: "border-gold/40 bg-gold/15 text-gold-2",
    teal: "border-teal/40 bg-teal/10 text-teal",
    coral: "border-coral/40 bg-coral/10 text-coral",
    lilac: "border-lilac/40 bg-lilac/10 text-lilac",
  } as const;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.14em] uppercase backdrop-blur-sm",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Product image frame ---------------- */

export function ProductImage({
  product,
  className,
  imgClassName,
}: {
  product: Product;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div className={cx("relative overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80";
        }}
        className={cx(
          "h-full w-full object-cover transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]",
          imgClassName,
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/45 via-transparent to-transparent" />
    </div>
  );
}
