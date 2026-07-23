"use client";

import { useState } from "react";
import { Eye, Flame, Scale, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, cx, discountPct, MOODS, money, type Product, type SortKey } from "@/lib/shop";
import { useApp } from "@/components/app-provider";
import { Badge, Price, ProductImage, Reveal, SectionHead, Stars, WishHeart } from "@/components/ui";

/* ----------------------------- Product card ----------------------------- */

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, setUi, compare, toggleCompare } = useApp();
  const off = discountPct(product);
  const comparing = compare.includes(product.slug);

  return (
    <Reveal delay={(index % 4) * 60} className="h-full">
      <article className="group glass card-lift relative flex h-full flex-col overflow-hidden rounded-3xl">
        <div className="relative">
          <ProductImage product={product} className="aspect-[4/4.3]" />
          {/* badges */}
          <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-10">
            {product.badge && (
              <Badge tone={product.badge === "Low stock" ? "coral" : "gold"}>
                {product.badge === "Bestseller" && <Flame size={10} />}
                {product.badge}
              </Badge>
            )}
            {product.isNew && <Badge tone="teal">New</Badge>}
          </div>
          {off > 0 && (
            <span className="absolute right-4 bottom-4 z-10 rounded-full bg-coral px-2.5 py-1 text-[0.65rem] font-bold text-night shadow-lg shadow-coral/30">
              −{off}%
            </span>
          )}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <WishHeart slug={product.slug} />
            <button
              type="button"
              aria-label={comparing ? "Remove from compare" : "Add to compare"}
              onClick={() => toggleCompare(product.slug)}
              className={cx(
                "grid size-9 place-items-center rounded-full border backdrop-blur-md transition-all duration-300",
                comparing
                  ? "border-lilac/60 bg-lilac/15 text-lilac"
                  : "border-white/15 bg-night/50 text-ivory/80 hover:border-lilac/50 hover:text-lilac",
              )}
            >
              <Scale size={15} />
            </button>
          </div>
          {/* hover actions */}
          <div className="absolute inset-x-4 bottom-4 z-20 flex translate-y-3 gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => addToCart(product.slug)}
              className="btn-gold flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[0.68rem] font-bold tracking-widest uppercase"
            >
              <ShoppingBag size={13} /> Quick add
            </button>
            <button
              type="button"
              aria-label="Quick view"
              onClick={() => setUi({ quickView: product.slug })}
              className="grid w-11 place-items-center rounded-full border border-white/20 bg-night/70 text-ivory backdrop-blur-md transition-colors hover:border-gold/60 hover:text-gold-2"
            >
              <Eye size={15} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.62rem] font-semibold tracking-[0.25em] text-teal/90 uppercase">{product.category}</p>
            {product.brand && (
              <span className="text-[0.65rem] font-medium text-gold-2/80 tracking-wider uppercase">{product.brand}</span>
            )}
          </div>

          <h3 className="mt-1.5 font-display text-lg leading-snug font-semibold text-ivory transition-colors group-hover:text-gold-2">
            {product.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-mist">{product.shortDescription || product.description}</p>
          
          {/* Mood badges */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.moods.map((m) => (
              <span key={m} className="rounded-full bg-lilac/10 border border-lilac/25 px-2 py-0.5 text-[0.6rem] font-medium text-lilac">
                {m}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Stars value={product.rating} size={12} />
            <span className="text-[0.68rem] text-mist">
              {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString()} reviews
            </span>
          </div>
          <div className="mt-auto flex items-end justify-between pt-4">
            <Price cents={product.price} original={product.originalPrice} />
            {product.stock <= 6 && (
              <span className="text-[0.62rem] font-semibold tracking-wide text-coral">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function CardSkeleton() {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="skeleton aspect-[4/4.3]" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-2.5 w-16 rounded-full" />
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-3 w-2/3 rounded-full" />
        <div className="flex items-center justify-between pt-2">
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Collection section --------------------------- */

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Most popular" },
  { key: "newest", label: "Newest" },
  { key: "rating", label: "Top rated" },
  { key: "price-asc", label: "Price: low → high" },
  { key: "price-desc", label: "Price: high → low" },
];

export function Collection() {
  const { loading, filtered, filters, setFilters, resetFilters } = useApp();
  const [displayCount, setDisplayCount] = useState(24);

  const activePills =
    (filters.category !== "All" ? 1 : 0) +
    (filters.mood ? 1 : 0) +
    (filters.query ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxPrice < 800 ? 1 : 0);

  const visibleProducts = filtered.slice(0, displayCount);

  return (
    <section id="shop" className="relative scroll-mt-32 py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px hairline" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="The Collection"
          title={
            <>
              Featured, considered, <em className="text-gold-grad italic">loved</em>
            </>
          }
          copy="A tight edit of our most-loved pieces — restocked rarely, reviewed obsessively."
        />

        {/* toolbar */}
        <Reveal delay={100} className="mt-12">
          <div className="glass rounded-3xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {["All", ...CATEGORIES.map((c) => c.name)].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilters({ category: c })}
                  className={cx(
                    "rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300",
                    filters.category === c
                      ? "border-gold bg-gold/15 text-gold-2 shadow-[0_8px_24px_-8px_rgba(201,163,92,0.5)]"
                      : "border-white/10 bg-white/[0.03] text-mist hover:border-gold/40 hover:text-ivory",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/8 pt-5">
              {/* moods */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[0.62rem] font-bold tracking-[0.22em] text-mist uppercase">Mood</span>
                {MOODS.map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setFilters({ mood: filters.mood === m.name ? null : m.name })}
                    className={cx(
                      "rounded-full px-3 py-1.5 text-[0.7rem] font-medium transition-all duration-300",
                      filters.mood === m.name
                        ? "bg-lilac/20 text-lilac ring-1 ring-lilac/50"
                        : "bg-white/[0.04] text-mist hover:text-ivory",
                    )}
                  >
                    {m.name}
                  </button>
                ))}
              </div>

              <div className="ml-auto flex flex-wrap items-center gap-x-6 gap-y-4">
                {/* price */}
                <label className="flex items-center gap-3 text-[0.7rem] text-mist">
                  <span className="font-bold tracking-[0.18em] uppercase">Up to</span>
                  <input
                    type="range"
                    min={20}
                    max={800}
                    step={10}
                    value={filters.maxPrice}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      e.currentTarget.style.setProperty("--val", `${((v - 20) / 780) * 100}%`);
                      setFilters({ maxPrice: v });
                    }}
                    className="range-gold w-32"
                    aria-label="Maximum price"
                    style={{ ["--val" as never]: `${((filters.maxPrice - 20) / 780) * 100}%` }}
                  />
                  <span className="w-12 font-semibold text-gold-2">{money(filters.maxPrice * 100)}</span>
                </label>

                {/* rating */}
                <div className="flex items-center gap-2 text-[0.7rem] text-mist">
                  <span className="font-bold tracking-[0.18em] uppercase">Rating</span>
                  {[0, 4.5, 4.7].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFilters({ minRating: r })}
                      className={cx(
                        "rounded-full px-3 py-1.5 font-medium transition-all",
                        filters.minRating === r ? "bg-gold/20 text-gold-2 ring-1 ring-gold/50" : "bg-white/[0.04] hover:text-ivory",
                      )}
                    >
                      {r === 0 ? "Any" : `${r}+`}
                    </button>
                  ))}
                </div>

                {/* sort */}
                <label className="flex items-center gap-2 text-[0.7rem] text-mist">
                  <SlidersHorizontal size={13} className="text-gold" />
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters({ sort: e.target.value as SortKey })}
                    className="cursor-pointer rounded-full border border-white/10 bg-night-3 px-3 py-1.5 text-xs font-medium text-ivory outline-none transition-colors focus:border-gold/60"
                    aria-label="Sort products"
                  >
                    {SORTS.map((s) => (
                      <option key={s.key} value={s.key} className="bg-night-3">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
        </Reveal>

        {/* result meta */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-xs text-mist">
            {loading ? "Curating…" : (
              <>
                Showing <span className="font-semibold text-ivory">{visibleProducts.length}</span> of{" "}
                <span className="font-semibold text-ivory">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "piece" : "pieces"}
                {filters.query && (
                  <>
                    {" "}for “<span className="text-gold-2">{filters.query}</span>”
                  </>
                )}
              </>
            )}
          </p>
          {activePills > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1.5 rounded-full border border-white/12 px-3.5 py-1.5 text-[0.68rem] font-semibold tracking-wide text-mist uppercase transition-all hover:border-coral/60 hover:text-coral"
            >
              <X size={12} /> Clear {activePills} filter{activePills > 1 ? "s" : ""}
            </button>
          )}
        </div>

        {/* grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : visibleProducts.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>

        {!loading && filtered.length > visibleProducts.length && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setDisplayCount((prev: number) => prev + 24)}
              className="btn-gold rounded-full px-8 py-3.5 text-xs font-bold tracking-widest uppercase shadow-xl shadow-gold/10"
            >
              Load More Pieces ({filtered.length - visibleProducts.length} remaining)
            </button>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="glass mx-auto mt-6 max-w-md rounded-3xl p-10 text-center">
            <p className="font-display text-xl font-semibold text-ivory">Nothing matches that mood… yet.</p>
            <p className="mt-2 text-sm text-mist">Loosen a filter or two — the collection rewards the curious.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="btn-gold mt-6 rounded-full px-6 py-3 text-xs font-bold tracking-widest uppercase"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
