"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Flame,
  Heart,
  RotateCcw,
  Scale,
  ShieldCheck,
  ShoppingBag,
  StarsIcon,
  Truck,
} from "lucide-react";
import { useApp } from "@/components/app-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import {
  AccountModal,
  CompareBar,
  CompareModal,
  GiftFinder,
  QuickView,
  Toasts,
  WishlistModal,
} from "@/components/overlays";
import { Badge, Price, QtyStepper, Stars, WishHeart } from "@/components/ui";
import { cx, discountPct, money } from "@/lib/shop";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { productBySlug, products, addToCart, toggleCompare, compare } = useApp();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState<string | null>(null);

  const product = productBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-32 text-center">
          <h1 className="font-display text-3xl font-bold text-ivory">Product Not Found</h1>
          <p className="mt-2 text-mist">The product you are looking for does not exist or has been moved.</p>
          <Link href="/#shop" className="btn-gold mt-6 inline-block rounded-full px-6 py-3 text-xs font-bold uppercase">
            Back to Collection
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const currentImg = activeImg || product.image;
  const off = discountPct(product);
  const isComparing = compare.includes(product.slug);

  const related = (products || [])
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="relative min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-mist">
          <Link href="/" className="hover:text-gold-2">Home</Link>
          <ChevronRight size={12} />
          <Link href="/#shop" className="hover:text-gold-2">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-ivory font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 glass">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentImg} alt={product.name} className="h-full w-full object-cover transition-all duration-500" />
              
              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-col items-start gap-2">
                {product.badge && (
                  <Badge tone={product.badge === "Low stock" ? "coral" : "gold"}>
                    {product.badge === "Bestseller" && <Flame size={10} />}
                    {product.badge}
                  </Badge>
                )}
                {product.isNew && <Badge tone="teal">New Arrival</Badge>}
              </div>

              {off > 0 && (
                <span className="absolute right-5 bottom-5 rounded-full bg-coral px-3 py-1.5 text-xs font-bold text-night shadow-xl">
                  −{off}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImg(img)}
                    className={cx(
                      "size-20 shrink-0 overflow-hidden rounded-2xl border transition-all duration-300",
                      currentImg === img ? "border-gold ring-2 ring-gold/50" : "border-white/10 opacity-60 hover:opacity-100"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold tracking-[0.25em] text-teal uppercase">{product.category}</span>
              {product.brand && (
                <span className="text-xs font-bold tracking-widest text-gold-2 uppercase">{product.brand}</span>
              )}
            </div>

            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ivory sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-3">
              <Stars value={product.rating} size={16} />
              <span className="text-xs font-semibold text-ivory">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-mist">({product.reviewCount.toLocaleString()} verified customer reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-4 border-y border-white/10 py-5">
              <Price cents={product.price} original={product.originalPrice} className="[&>span:first-child]:text-3xl" />
              {product.stock <= 6 && (
                <span className="rounded-full bg-coral/15 border border-coral/30 px-3 py-1 text-xs font-semibold text-coral">
                  Only {product.stock} items left in stock
                </span>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-ivory-dim">
              {product.longDescription || product.description}
            </p>

            {/* Mood Badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-mist self-center mr-1">Mood & Vibe:</span>
              {product.moods.map((m) => (
                <span key={m} className="rounded-full border border-lilac/30 bg-lilac/10 px-3.5 py-1 text-xs font-medium text-lilac">
                  {m}
                </span>
              ))}
            </div>

            {/* Colors Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <span className="block text-xs font-semibold tracking-wider text-mist uppercase mb-2">Available Colors</span>
                <div className="flex gap-2.5">
                  {product.colors.map((c, i) => (
                    <span
                      key={i}
                      style={{ backgroundColor: c }}
                      className="size-7 rounded-full border border-white/20 shadow-md ring-offset-2 ring-offset-night hover:scale-110 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold tracking-wider text-mist uppercase">Quantity</span>
                <QtyStepper qty={qty} onChange={(d) => setQty((q) => Math.min(Math.max(q + d, 1), 9))} />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => addToCart(product.slug, { qty })}
                  className="btn-gold flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-xs font-bold tracking-widest uppercase shadow-xl shadow-gold/20"
                >
                  <ShoppingBag size={16} /> Add To Cart
                </button>

                <WishHeart slug={product.slug} className="size-13" />

                <button
                  type="button"
                  aria-label="Compare"
                  onClick={() => toggleCompare(product.slug)}
                  className={cx(
                    "grid size-13 place-items-center rounded-full border transition-all",
                    isComparing
                      ? "border-lilac/60 bg-lilac/15 text-lilac"
                      : "border-white/15 text-ivory/80 hover:border-lilac/50 hover:text-lilac"
                  )}
                >
                  <Scale size={18} />
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl glass p-4 text-center text-xs font-medium text-mist">
              <div className="flex flex-col items-center gap-1.5">
                <Truck size={16} className="text-teal" />
                <span>{product.deliveryTime || "2-3 Days Shipping"}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RotateCcw size={16} className="text-gold" />
                <span>30-Day Hassle-Free Return</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck size={16} className="text-lilac" />
                <span>{product.warranty || "2 Year Warranty"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features & Specifications Tabs / Details */}
        <section className="mt-20 border-t border-white/10 pt-14">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="glass rounded-3xl p-8">
                <h3 className="font-display text-xl font-bold text-ivory mb-6">Key Highlights & Features</h3>
                <ul className="space-y-4">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-ivory-dim">
                      <CheckCircle2 size={18} className="text-gold shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && (
              <div className="glass rounded-3xl p-8">
                <h3 className="font-display text-xl font-bold text-ivory mb-6">Technical Specifications</h3>
                <dl className="divide-y divide-white/10 text-sm">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-3">
                      <dt className="text-mist font-medium">{key}</dt>
                      <dd className="text-ivory font-semibold">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-white/10 pt-16">
            <h2 className="font-display text-2xl font-bold text-ivory sm:text-3xl mb-8">
              Similar Pieces You Might <em className="text-gold-grad italic">Love</em>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((rel) => (
                <div key={rel.slug} className="glass rounded-3xl p-4 flex flex-col group">
                  <div className="relative aspect-square overflow-hidden rounded-2xl mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rel.image} alt={rel.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <span className="text-[0.62rem] font-bold text-teal tracking-widest uppercase">{rel.category}</span>
                  <Link href={`/product/${rel.slug}`} className="mt-1 font-display text-base font-semibold text-ivory hover:text-gold-2 truncate">
                    {rel.name}
                  </Link>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <Price cents={rel.price} original={rel.originalPrice} />
                    <button
                      type="button"
                      onClick={() => addToCart(rel.slug)}
                      className="rounded-full bg-gold/15 border border-gold/30 p-2 text-gold-2 hover:bg-gold hover:text-night transition-colors"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Overlays */}
      <CartDrawer />
      <QuickView />
      <WishlistModal />
      <AccountModal />
      <CompareModal />
      <GiftFinder />
      <CompareBar />
      <Toasts />
    </div>
  );
}
