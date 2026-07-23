"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Crown,
  Gift,
  Heart,
  LayoutGrid,
  Menu,
  Package,
  Scale,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { CATEGORIES, cx, MOODS, money, type Product } from "@/lib/shop";
import { scrollToId, useApp } from "@/components/app-provider";
import { Stars } from "@/components/ui";

export function MeridianLogo({ compact }: { compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group flex items-center gap-2.5"
      aria-label="Meridian Living home"
    >
      <span className="relative grid size-9 place-items-center rounded-full border border-gold/50 bg-gradient-to-br from-gold/25 to-transparent">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 2.5l2.4 6.1 6.6.4-5.1 4.2 1.7 6.3L12 15.8l-5.6 3.7 1.7-6.3L3 9l6.6-.4L12 2.5z"
            stroke="#e4c983"
            strokeWidth="1.3"
            strokeLinejoin="round"
            fill="rgba(201,163,92,0.18)"
          />
        </svg>
        <span className="absolute inset-0 rounded-full border border-gold/20 transition-transform duration-500 group-hover:scale-125" />
      </span>
      {!compact && (
        <span className="font-display text-xl font-semibold tracking-tight text-ivory">
          Meridian <span className="text-gold-grad">Living</span>
        </span>
      )}
    </button>
  );
}

const SHORTCUTS = ["Smart Home", "Desk Setup", "Home Decor", "Wellness", "Gifts", "Travel Essentials"];

function SearchBox({ mobile, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { products, setFilters } = useApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !products) return { products: [] as Product[], categories: [] as string[] };
    const cats = CATEGORIES.map((c) => c.name).filter((c) => c.toLowerCase().includes(q)).slice(0, 3);
    const prods = products
      .filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q))
      .slice(0, 5);
    return { products: prods, categories: cats };
  }, [query, products]);

  const flatCount = suggestions.products.length + suggestions.categories.length;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const commit = (q: string) => {
    setFilters({ query: q, category: "All", mood: null });
    setOpen(false);
    onNavigate?.();
    scrollToId("shop");
  };

  const pickCategory = (c: string) => {
    setFilters({ category: c, query: "", mood: null });
    setOpen(false);
    setQuery("");
    onNavigate?.();
    scrollToId("shop");
  };

  return (
    <div ref={boxRef} className={cx("relative", mobile ? "w-full" : "w-full max-w-md")}>
      <div className="group flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.045] px-4 py-2 backdrop-blur-xl transition-all duration-300 focus-within:border-gold/60 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_0_4px_rgba(201,163,92,0.08)]">
        <Search size={15} className="shrink-0 text-mist transition-colors group-focus-within:text-gold" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(-1);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlight((h) => Math.min(h + 1, flatCount - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, -1));
            } else if (e.key === "Enter") {
              if (highlight >= 0 && highlight < suggestions.categories.length) {
                pickCategory(suggestions.categories[highlight]);
              } else if (highlight >= suggestions.categories.length) {
                const p = suggestions.products[highlight - suggestions.categories.length];
                if (p) {
                  setFilters({ query: p.name, category: "All", mood: null });
                  setOpen(false);
                  setQuery("");
                  onNavigate?.();
                  scrollToId("shop");
                  return;
                }
              } else {
                commit(query);
              }
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Search lamps, diffusers, gifts…"
          className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-mist/70"
          aria-label="Search products"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="text-mist transition-colors hover:text-ivory"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="glass-deep pop-in absolute inset-x-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-2xl p-2 shadow-2xl shadow-black/60">
          {suggestions.categories.map((c, i) => (
            <button
              key={c}
              type="button"
              onMouseEnter={() => setHighlight(i)}
              onClick={() => pickCategory(c)}
              className={cx(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                highlight === i ? "bg-gold/10 text-gold-2" : "text-ivory/85",
              )}
            >
              <LayoutGrid size={14} className="text-gold" />
              <span>
                Category: <span className="font-semibold">{c}</span>
              </span>
              <ArrowRight size={13} className="ml-auto opacity-60" />
            </button>
          ))}
          {suggestions.products.map((p, i) => {
            const idx = i + suggestions.categories.length;
            return (
              <button
                key={p.slug}
                type="button"
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => {
                  setFilters({ query: p.name, category: "All", mood: null });
                  setOpen(false);
                  setQuery("");
                  onNavigate?.();
                  scrollToId("shop");
                }}
                className={cx(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                  highlight === idx ? "bg-gold/10" : "",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" className="size-10 rounded-lg object-cover" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ivory">{p.name}</span>
                  <span className="flex items-center gap-2 text-[0.7rem] text-mist">
                    <Stars value={p.rating} size={10} /> {money(p.price)}
                  </span>
                </span>
              </button>
            );
          })}
          {flatCount === 0 && (
            <p className="px-3 py-4 text-center text-xs text-mist">
              No matches — press Enter to search the full collection.
            </p>
          )}
          {query.trim() && (
            <button
              type="button"
              onClick={() => commit(query)}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border-t border-white/8 px-3 py-2.5 text-xs font-semibold tracking-wide text-gold-2 uppercase transition-colors hover:bg-gold/10"
            >
              Search all results <ArrowRight size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function IconButton({
  label,
  count,
  onClick,
  children,
}: {
  label: string;
  count?: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ivory/85 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-gold/60 hover:text-gold-2"
    >
      {children}
      {typeof count === "number" && count > 0 && (
        <span
          key={count}
          className="count-bump absolute -top-1 -right-1 grid min-size-5 place-items-center rounded-full bg-gradient-to-br from-gold-2 to-gold px-1 text-[0.65rem] font-bold text-night shadow-lg shadow-gold/30"
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function Navbar() {
  const { cartCount, wishlist, compare, setUi, setFilters, resetFilters, soundEnabled, toggleSound } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* utility strip */}
      <div className="overflow-hidden border-b border-white/6 bg-night-2/90 py-1.5 backdrop-blur-md">
        <div className="animate-marquee flex w-max items-center gap-10 px-6 text-[0.65rem] font-medium tracking-[0.22em] whitespace-nowrap text-mist uppercase">
          {[0, 1].map((n) => (
            <span key={n} className="flex items-center gap-10">
              <span className="flex items-center gap-2"><Sparkles size={11} className="text-gold" /> Free shipping over $75</span>
              <span className="flex items-center gap-2"><Package size={11} className="text-teal" /> Carbon-neutral delivery</span>
              <span className="flex items-center gap-2"><Gift size={11} className="text-lilac" /> Complimentary gift wrap</span>
              <span className="flex items-center gap-2"><Sparkles size={11} className="text-gold" /> Code NOVA10 — 10% off first order</span>
              <span className="flex items-center gap-2"><Package size={11} className="text-coral" /> 30-day easy returns</span>
            </span>
          ))}
        </div>
      </div>

      {/* main bar */}
      <div
        className={cx(
          "border-b backdrop-blur-2xl transition-all duration-500",
          scrolled ? "border-gold/15 bg-night/85 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.8)]" : "border-white/8 bg-night/40",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setUi({ mobileNavOpen: true })}
            className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ivory lg:hidden"
          >
            <Menu size={18} />
          </button>

          <MeridianLogo />

          <div className="hidden flex-1 justify-center md:flex">
            <SearchBox />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <IconButton label="Sound FX" onClick={toggleSound}>
              {soundEnabled ? <Volume2 size={16} className="text-gold-2" /> : <VolumeX size={16} className="text-mist" />}
            </IconButton>
            <IconButton label="The Meridian Circle VIP" onClick={() => setUi({ vipOpen: true })}>
              <Crown size={16} className="text-gold" />
            </IconButton>
            <IconButton label="Wishlist" count={wishlist.length} onClick={() => setUi({ wishOpen: true })}>
              <Heart size={17} />
            </IconButton>
            <IconButton label="Compare" count={compare.length} onClick={() => setUi({ compareOpen: true })}>
              <Scale size={17} />
            </IconButton>
            <IconButton label="Account" onClick={() => setUi({ accountOpen: true })}>
              <User size={17} />
            </IconButton>
            <IconButton label="Cart" count={cartCount} onClick={() => setUi({ cartOpen: true })}>
              <ShoppingBag size={17} />
            </IconButton>
          </div>
        </div>

        {/* category shortcuts (desktop) */}
        <nav className="relative hidden border-t border-white/5 lg:block" onMouseLeave={() => setMegaOpen(false)}>
          <div className="mx-auto flex h-10 max-w-7xl items-center gap-1 px-8">
            <button
              type="button"
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen((v) => !v)}
              className={cx(
                "flex h-10 items-center gap-2 border-b-2 px-3 text-[0.72rem] font-semibold tracking-[0.18em] uppercase transition-colors",
                megaOpen ? "border-gold text-gold-2" : "border-transparent text-mist hover:text-ivory",
              )}
            >
              <LayoutGrid size={13} /> Shop
            </button>
            {SHORTCUTS.map((c) => (
              <button
                key={c}
                type="button"
                onMouseEnter={() => setMegaOpen(false)}
                onClick={() => {
                  setFilters({ category: c, mood: null, query: "" });
                  scrollToId("shop");
                }}
                className="flex h-10 items-center border-b-2 border-transparent px-3 text-[0.72rem] font-semibold tracking-[0.18em] text-mist uppercase transition-all duration-300 hover:border-gold/50 hover:text-ivory"
              >
                {c}
              </button>
            ))}
            <button
              type="button"
              onMouseEnter={() => setMegaOpen(false)}
              onClick={() => scrollToId("shop-the-look")}
              className="flex h-10 items-center gap-1.5 border-b-2 border-transparent px-3 text-[0.72rem] font-semibold tracking-[0.18em] text-gold-2 uppercase transition-colors hover:text-gold"
            >
              <Sparkles size={12} /> Shop The Look
            </button>
            <button
              type="button"
              onMouseEnter={() => setMegaOpen(false)}
              onClick={() => scrollToId("bundle-studio")}
              className="flex h-10 items-center gap-1.5 border-b-2 border-transparent px-3 text-[0.72rem] font-semibold tracking-[0.18em] text-teal uppercase transition-colors hover:text-teal/80"
            >
              <Gift size={12} /> Bundle Studio (-15%)
            </button>
            <button
              type="button"
              onMouseEnter={() => setMegaOpen(false)}
              onClick={() => setUi({ giftOpen: true })}
              className="ml-auto flex h-10 items-center gap-1.5 text-[0.72rem] font-semibold tracking-[0.18em] text-lilac uppercase transition-colors hover:text-lilac/80"
            >
              <Gift size={12} /> Gift Finder
            </button>
          </div>

          {/* mega menu */}
          {megaOpen && (
            <div className="absolute inset-x-0 top-full z-40 hidden lg:block">
              <div className="glass-deep fade-in mx-auto mt-2 max-w-7xl rounded-3xl p-8 shadow-2xl shadow-black/70">
                <div className="grid grid-cols-6 gap-4">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => {
                        setFilters({ category: cat.name, mood: null, query: "" });
                        setMegaOpen(false);
                        scrollToId("shop");
                      }}
                      className="group text-left"
                    >
                      <span className="block overflow-hidden rounded-2xl border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </span>
                      <span className="mt-3 block text-sm font-semibold text-ivory transition-colors group-hover:text-gold-2">
                        {cat.name}
                      </span>
                      <span className="mt-0.5 block text-[0.7rem] leading-snug text-mist">{cat.tagline}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-5">
                  <span className="text-[0.65rem] font-semibold tracking-[0.25em] text-mist uppercase">Curated by mood</span>
                  {MOODS.map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => {
                        setFilters({ mood: m.name, category: "All", query: "" });
                        setMegaOpen(false);
                        scrollToId("shop");
                      }}
                      className="rounded-full border border-white/12 px-4 py-1.5 text-xs font-medium text-ivory/85 transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-gold-2"
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* mobile slide-over */}
      {useAppMobileNav()}
    </header>
  );
}

function useAppMobileNav() {
  const { ui, setUi, setFilters, resetFilters } = useApp();
  if (!ui.mobileNavOpen) return null;
  const close = () => setUi({ mobileNavOpen: false });
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fade-in absolute inset-0 bg-night/80 backdrop-blur-sm" onClick={close} />
      <div className="left-drawer-in glass-deep absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto p-6">
        <div className="flex items-center justify-between">
          <MeridianLogo />
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="grid size-9 place-items-center rounded-full border border-white/12 text-ivory"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-6">
          <SearchBox mobile onNavigate={close} />
        </div>
        <p className="eyebrow mt-8">Shop by category</p>
        <div className="mt-3 space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => {
                setFilters({ category: cat.name, mood: null, query: "" });
                close();
                scrollToId("shop");
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium text-ivory/90 transition-colors hover:bg-gold/10 hover:text-gold-2"
            >
              {cat.name}
              <ArrowRight size={14} className="opacity-50" />
            </button>
          ))}
        </div>
        <p className="eyebrow mt-6">By mood</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.name}
              type="button"
              onClick={() => {
                setFilters({ mood: m.name, category: "All", query: "" });
                close();
                scrollToId("shop");
              }}
              className="rounded-full border border-white/12 px-4 py-1.5 text-xs text-ivory/85"
            >
              {m.name}
            </button>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              resetFilters();
              setFilters({ sort: "newest" });
              close();
              scrollToId("shop");
            }}
            className="btn-ghost flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-semibold tracking-widest uppercase"
          >
            <Sparkles size={13} /> New arrivals
          </button>
          <button
            type="button"
            onClick={() => {
              setUi({ giftOpen: true, mobileNavOpen: false });
            }}
            className="btn-ghost flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-semibold tracking-widest uppercase text-lilac"
          >
            <Gift size={13} /> Gift finder
          </button>
        </div>
        <p className="mt-auto pt-8 text-center text-[0.65rem] tracking-[0.25em] text-mist uppercase">
          Free shipping over $75 · 30-day returns
        </p>
      </div>
    </div>
  );
}
