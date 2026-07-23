"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Crown,
  Gift,
  Heart,
  LogOut,
  PackageCheck,
  PartyPopper,
  RotateCcw,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Truck,
  User,
  X,
} from "lucide-react";
import { cx, money, MOODS, type Product } from "@/lib/shop";
import { useApp } from "@/components/app-provider";
import { Price, QtyStepper, Stars, WishHeart } from "@/components/ui";

/* ------------------------------- Shell ------------------------------- */

function Modal({
  onClose,
  children,
  wide,
}: {
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="fade-in absolute inset-0 bg-night/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cx(
          "glass-deep pop-in relative max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem]",
          wide ? "sm:max-w-4xl" : "sm:max-w-lg",
        )}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full border border-white/12 bg-night/60 text-mist backdrop-blur-md transition-colors hover:text-ivory"
        >
          <X size={15} />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------- Toasts ------------------------------- */

const TOAST_ICONS = {
  cart: ShoppingBag,
  wish: Heart,
  info: Sparkles,
  success: CheckCircle2,
} as const;

export function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[70] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2.5">
      {toasts.map((t) => {
        const Icon = TOAST_ICONS[t.kind];
        return (
          <div key={t.id} className="pop-in glass-deep pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-2xl shadow-black/50">
            <span
              className={cx(
                "grid size-9 shrink-0 place-items-center rounded-full",
                t.kind === "cart" && "bg-gold/15 text-gold-2",
                t.kind === "wish" && "bg-coral/15 text-coral",
                t.kind === "info" && "bg-lilac/15 text-lilac",
                t.kind === "success" && "bg-teal/15 text-teal",
              )}
            >
              <Icon size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-ivory">{t.title}</p>
              {t.message && <p className="mt-0.5 truncate text-[0.7rem] text-mist">{t.message}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ Quick view ------------------------------ */

export function QuickView() {
  const { ui, setUi, productBySlug, addToCart, compare, toggleCompare } = useApp();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const [engraving, setEngraving] = useState("");

  const product = ui.quickView ? productBySlug(ui.quickView) : undefined;

  useEffect(() => {
    setQty(1);
    setActiveImg(null);
    setEngraving("");
  }, [ui.quickView]);

  if (!ui.quickView || !product) return null;
  const close = () => setUi({ quickView: null });

  const currentImg = activeImg || product.image;
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const isEngravable = ["Journal", "Pen", "Wallet", "Pouch", "Mat", "Nameplate", "Passport", "Leather"].some((k) =>
    product.name.includes(k)
  );

  return (
    <Modal onClose={close} wide>
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="flex flex-col p-5 bg-night-2/40 border-r border-white/5">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentImg} alt={product.name} className="h-full w-full object-cover transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent" />
            {/* Live Gold Foil Stamped Initial Preview */}
            {engraving.trim() && (
              <div className="absolute bottom-6 right-6 font-display text-2xl font-bold tracking-[0.25em] text-gold-2 drop-shadow-[0_2px_10px_rgba(201,163,92,0.8)] border border-gold/40 px-3 py-1 rounded bg-night/60 backdrop-blur-md">
                {engraving.toUpperCase()}
              </div>
            )}
          </div>
          {/* Gallery Thumbnails */}
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImg(img)}
                  className={cx(
                    "size-14 shrink-0 overflow-hidden rounded-xl border transition-all",
                    currentImg === img ? "border-gold ring-1 ring-gold" : "border-white/10 opacity-70 hover:opacity-100"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col p-7 sm:p-9 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.62rem] font-semibold tracking-[0.25em] text-teal uppercase">{product.category}</p>
            {product.brand && (
              <span className="text-xs font-bold text-gold-2 tracking-widest uppercase">{product.brand}</span>
            )}
          </div>
          <h2 className="mt-2 pr-8 font-display text-2xl leading-tight font-semibold text-ivory sm:text-3xl">
            {product.name}
          </h2>
          <div className="mt-3 flex items-center gap-2.5">
            <Stars value={product.rating} size={14} />
            <span className="text-xs text-mist">
              {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString()} verified reviews
            </span>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ivory-dim">{product.longDescription || product.description}</p>

          {/* Custom Monogram Engraving */}
          {isEngravable && (
            <div className="mt-4 rounded-xl border border-gold/30 bg-gold/10 p-3">
              <span className="block text-[0.62rem] font-bold text-gold-2 tracking-widest uppercase mb-1">
                Complimentary Gold Foil Engraving
              </span>
              <input
                type="text"
                maxLength={4}
                value={engraving}
                onChange={(e) => setEngraving(e.target.value)}
                placeholder="Enter Initials (e.g. S.R)"
                className="w-full rounded-lg border border-gold/40 bg-night/80 px-3 py-1.5 text-xs text-ivory outline-none focus:border-gold"
              />
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-[0.72rem] text-mist">
              {product.features.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-gold shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {product.moods.map((m) => (
              <span key={m} className="rounded-full border border-lilac/30 bg-lilac/10 px-3 py-1 text-[0.65rem] font-medium text-lilac">
                {m}
              </span>
            ))}
            <span
              className={cx(
                "rounded-full border px-3 py-1 text-[0.65rem] font-medium",
                product.stock <= 6 ? "border-coral/40 bg-coral/10 text-coral" : "border-teal/40 bg-teal/10 text-teal",
              )}
            >
              {product.stock <= 6 ? `Only ${product.stock} left` : "In stock"}
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
            <Price cents={product.price} original={product.originalPrice} className="[&>span:first-child]:text-2xl" />
            <QtyStepper qty={qty} onChange={(d) => setQty((q) => Math.min(Math.max(q + d, 1), 9))} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                addToCart(product.slug, { qty });
                close();
              }}
              className="btn-gold flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold tracking-widest uppercase"
            >
              <ShoppingBag size={14} /> Add to cart
            </button>
            <a
              href={`/product/${product.slug}`}
              onClick={close}
              className="flex items-center justify-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-4 py-3 text-xs font-semibold text-gold-2 hover:bg-gold/20"
            >
              View Full Details <ArrowRight size={13} />
            </a>
            <WishHeart slug={product.slug} className="size-12" />
            <button
              type="button"
              aria-label="Compare"
              onClick={() => toggleCompare(product.slug)}
              className={cx(
                "grid size-12 place-items-center rounded-full border transition-all",
                compare.includes(product.slug)
                  ? "border-lilac/60 bg-lilac/15 text-lilac"
                  : "border-white/15 text-ivory/80 hover:border-lilac/50 hover:text-lilac",
              )}
            >
              <Scale size={16} />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-white/[0.03] p-3.5 text-center text-[0.6rem] font-medium text-mist">
            <span className="flex flex-col items-center gap-1.5">
              <Truck size={14} className="text-teal" /> {product.deliveryTime || "2-3 Days Shipping"}
            </span>
            <span className="flex flex-col items-center gap-1.5">
              <RotateCcw size={14} className="text-gold" /> 30-day returns
            </span>
            <span className="flex flex-col items-center gap-1.5">
              <ShieldCheck size={14} className="text-lilac" /> {product.warranty || "2-year warranty"}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------- Wishlist drawer / modal ------------------------- */

export function WishlistModal() {
  const { ui, setUi, wishlist, productBySlug, toggleWish, addToCart } = useApp();
  if (!ui.wishOpen) return null;
  const items = wishlist
    .map((s) => productBySlug(s))
    .filter((p): p is Product => Boolean(p));
  const close = () => setUi({ wishOpen: false });

  return (
    <Modal onClose={close}>
      <div className="p-7">
        <h2 className="flex items-center gap-2.5 font-display text-2xl font-semibold text-ivory">
          <Heart size={18} className="text-coral" fill="currentColor" /> Wishlist
          <span className="rounded-full bg-coral/15 px-2.5 py-0.5 text-[0.65rem] font-bold text-coral">{items.length}</span>
        </h2>
        {items.length === 0 ? (
          <div className="py-10 text-center">
            <Heart size={30} className="mx-auto text-mist/40" />
            <p className="mt-4 text-sm font-semibold text-ivory">Nothing saved yet</p>
            <p className="mx-auto mt-1.5 max-w-[16rem] text-xs leading-relaxed text-mist">
              Tap the heart on any piece to keep it here for later.
            </p>
            <button
              type="button"
              onClick={close}
              className="btn-gold mt-6 rounded-full px-6 py-3 text-xs font-bold tracking-widest uppercase"
            >
              Discover pieces
            </button>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {items.map((p) => (
              <li key={p.slug} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} className="size-16 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ivory">{p.name}</p>
                  <p className="mt-0.5 text-xs text-gold-2">{money(p.price)}</p>
                </div>
                <button
                  type="button"
                  aria-label="Add to cart"
                  onClick={() => addToCart(p.slug)}
                  className="btn-gold grid size-9 place-items-center rounded-full"
                >
                  <ShoppingBag size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Remove from wishlist"
                  onClick={() => toggleWish(p.slug)}
                  className="grid size-9 place-items-center rounded-full border border-white/12 text-mist transition-colors hover:text-coral"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------ Account modal ------------------------------ */

export function AccountModal() {
  const { ui, setUi, user, signIn, signOut, orders } = useApp();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  if (!ui.accountOpen) return null;
  const close = () => setUi({ accountOpen: false });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const em = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) return setError("Please enter a valid email.");
    if (password.length < 4) return setError("Password needs at least 4 characters.");
    const displayName = mode === "signup" ? name.trim() : (user?.name ?? em.split("@")[0]);
    if (mode === "signup" && displayName.length < 2) return setError("Tell us your name.");
    setError(null);
    signIn({
      name: displayName || em.split("@")[0],
      email: em,
      joinedAt: user?.joinedAt ?? new Date().toISOString(),
    });
    setPassword("");
  };

  return (
    <Modal onClose={close}>
      <div className="p-7">
        {user ? (
          <div>
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-gold/30 to-gold/5 font-display text-xl font-bold text-gold-2">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate font-display text-xl font-semibold text-ivory">
                  {user.name} <BadgeCheck size={15} className="shrink-0 text-teal" />
                </p>
                <p className="truncate text-xs text-mist">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="ml-auto flex items-center gap-1.5 rounded-full border border-white/12 px-3.5 py-2 text-[0.65rem] font-semibold text-mist uppercase transition-colors hover:border-coral/50 hover:text-coral"
              >
                <LogOut size={11} /> Sign out
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2.5 text-center">
              {[
                { icon: Crown, label: "Circle member", tone: "text-gold-2" },
                { icon: PackageCheck, label: `${orders.length} order${orders.length === 1 ? "" : "s"}`, tone: "text-teal" },
                { icon: Star, label: "VIP early access", tone: "text-lilac" },
              ].map((b) => (
                <div key={b.label} className="rounded-2xl border border-white/8 bg-white/[0.03] px-2 py-4">
                  <b.icon size={16} className={cx("mx-auto", b.tone)} />
                  <p className="mt-2 text-[0.62rem] font-semibold text-ivory-dim">{b.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-[0.65rem] font-bold tracking-[0.25em] text-mist uppercase">Recent orders</p>
              {orders.length === 0 ? (
                <p className="mt-3 rounded-2xl border border-dashed border-white/12 px-4 py-5 text-center text-xs text-mist">
                  No orders yet — your future corner is waiting.
                </p>
              ) : (
                <ul className="mt-3 space-y-2.5">
                  {orders.slice(0, 4).map((o) => (
                    <li key={o.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <div>
                        <p className="text-xs font-bold text-ivory">{o.id}</p>
                        <p className="text-[0.65rem] text-mist">
                          {new Date(o.placedAt).toLocaleDateString()} · {o.items.reduce((n, i) => n + i.qty, 0)} items
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-gold-2">{money(o.total)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="flex items-center gap-2.5 font-display text-2xl font-semibold text-ivory">
              <User size={18} className="text-gold" /> Your account
            </h2>
            <div className="mt-5 grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setError(null);
                  }}
                  className={cx(
                    "rounded-full py-2.5 text-xs font-bold tracking-widest uppercase transition-all",
                    mode === m ? "bg-gold/20 text-gold-2" : "text-mist hover:text-ivory",
                  )}
                >
                  {m === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="mt-5 space-y-3">
              {mode === "signup" && (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-ivory outline-none placeholder:text-mist/60 focus:border-gold/60"
                />
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-ivory outline-none placeholder:text-mist/60 focus:border-gold/60"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-ivory outline-none placeholder:text-mist/60 focus:border-gold/60"
              />
              {error && <p className="text-xs font-medium text-coral">{error}</p>}
              <button type="submit" className="btn-gold w-full rounded-full py-3.5 text-xs font-bold tracking-widest uppercase">
                {mode === "signin" ? "Sign in to Meridian Living" : "Join Meridian Living"}
              </button>
              <p className="text-center text-[0.62rem] leading-relaxed text-mist">
                Demo-safe: your profile is stored only in this browser — no passwords ever leave your device.
              </p>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------- Compare ------------------------------- */

export function CompareBar() {
  const { compare, productBySlug, setUi, toggleCompare, ui } = useApp();
  const items = compare.map((s) => productBySlug(s)).filter((p): p is Product => Boolean(p));
  if (items.length === 0 || ui.compareOpen) return null;
  return (
    <div className="pop-in fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-lilac/35 bg-night-2/90 py-2 pr-2 pl-4 shadow-2xl shadow-black/60 backdrop-blur-xl">
      <Scale size={14} className="text-lilac" />
      <div className="flex -space-x-2">
        {items.map((p) => (
          <button
            key={p.slug}
            type="button"
            aria-label={`Remove ${p.name} from compare`}
            onClick={() => toggleCompare(p.slug)}
            className="group relative size-9 overflow-hidden rounded-full border-2 border-night-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
            <span className="absolute inset-0 grid place-items-center bg-night/70 opacity-0 transition-opacity group-hover:opacity-100">
              <X size={12} />
            </span>
          </button>
        ))}
      </div>
      <span className="text-xs font-medium text-mist">{items.length}/3</span>
      <button
        type="button"
        onClick={() => setUi({ compareOpen: true })}
        className="btn-gold rounded-full px-4 py-2 text-[0.65rem] font-bold tracking-widest uppercase"
      >
        Compare
      </button>
    </div>
  );
}

export function CompareModal() {
  const { ui, setUi, compare, productBySlug, addToCart, clearCompare } = useApp();
  if (!ui.compareOpen) return null;
  const items = compare.map((s) => productBySlug(s)).filter((p): p is Product => Boolean(p));
  const close = () => setUi({ compareOpen: false });
  const cheapest = items.length ? Math.min(...items.map((p) => p.price)) : 0;
  const bestRated = items.length ? Math.max(...items.map((p) => p.rating)) : 0;

  const rows: { label: string; render: (p: Product) => ReactNode; best?: (p: Product) => boolean }[] = [
    { label: "Category", render: (p) => p.category },
    { label: "Price", render: (p) => money(p.price), best: (p) => p.price === cheapest },
    { label: "Rating", render: (p) => `${p.rating.toFixed(1)} / 5`, best: (p) => p.rating === bestRated },
    { label: "Reviews", render: (p) => p.reviewCount.toLocaleString() },
    { label: "Mood", render: (p) => p.moods.join(", ") },
    { label: "Availability", render: (p) => (p.stock <= 6 ? `${p.stock} left` : "In stock"), best: (p) => p.stock > 6 },
  ];

  return (
    <Modal onClose={close} wide>
      <div className="p-7 sm:p-9">
        <div className="flex items-center justify-between pr-10">
          <h2 className="flex items-center gap-2.5 font-display text-2xl font-semibold text-ivory">
            <Scale size={18} className="text-lilac" /> Side by side
          </h2>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="text-[0.65rem] font-semibold tracking-widest text-mist uppercase transition-colors hover:text-coral"
            >
              Clear all
            </button>
          )}
        </div>
        {items.length === 0 ? (
          <div className="py-10 text-center">
            <Scale size={28} className="mx-auto text-mist/40" />
            <p className="mt-4 text-sm font-semibold text-ivory">Nothing to compare yet</p>
            <p className="mx-auto mt-1.5 max-w-[18rem] text-xs text-mist">
              Tap the compare icon on up to three products and they will line up here.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[30rem] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="w-28" />
                  {items.map((p) => (
                    <th key={p.slug} className="border-b border-white/10 px-3 pb-4 align-top">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="aspect-square w-full rounded-2xl object-cover" />
                      <p className="mt-2 text-xs font-bold text-ivory">{p.name}</p>
                      <Stars value={p.rating} size={10} className="mt-1" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <th className="border-b border-white/6 py-3 pr-3 text-[0.62rem] font-bold tracking-[0.18em] text-mist uppercase">
                      {row.label}
                    </th>
                    {items.map((p) => {
                      const isBest = row.best?.(p);
                      return (
                        <td key={p.slug} className="border-b border-white/6 px-3 py-3 text-xs text-ivory-dim">
                          <span className={cx("flex items-center gap-1.5", isBest && "font-semibold text-teal")}>
                            {isBest && <Check size={11} />}
                            {row.render(p)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <th />
                  {items.map((p) => (
                    <td key={p.slug} className="px-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(p.slug);
                        }}
                        className="btn-gold flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-[0.62rem] font-bold tracking-widest uppercase"
                      >
                        <ShoppingBag size={11} /> Add
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------ Gift finder ------------------------------ */

const RECIPIENT_MOOD: Record<string, string[]> = {
  "Someone I love": ["Cozy", "Calm"],
  "A dear friend": ["Giftable", "Cozy"],
  "A colleague": ["Focus", "Giftable"],
  "Myself, obviously": ["Luxury", "Focus"],
};

export function GiftFinder() {
  const { ui, setUi, products, addToCart, notify } = useApp();
  const [step, setStep] = useState(0);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [budget, setBudget] = useState<number>(150);

  const results = useMemo(() => {
    if (step !== 3 || !products) return [];
    const wanted = [mood, ...(recipient ? RECIPIENT_MOOD[recipient] ?? [] : [])].filter(Boolean) as string[];
    return [...products]
      .filter((p) => p.price <= budget * 100)
      .map((p) => ({
        p,
        score:
          p.moods.filter((m) => wanted.includes(m)).length * 10 +
          p.popularity / 10 +
          (p.moods.includes("Giftable") ? 4 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => r.p);
  }, [step, products, mood, recipient, budget]);

  if (!ui.giftOpen) return null;
  const close = () => {
    setUi({ giftOpen: false });
    window.setTimeout(() => {
      setStep(0);
      setRecipient(null);
      setMood(null);
      setBudget(150);
    }, 300);
  };

  const optionCls =
    "rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-ivory transition-all duration-300 hover:border-gold/50 hover:bg-gold/10";

  return (
    <Modal onClose={close}>
      <div className="p-7">
        <p className="eyebrow flex items-center gap-2">
          <Gift size={12} /> Gift finder
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-ivory">
          {step === 0 && "Who is the lucky one?"}
          {step === 1 && "What should it feel like?"}
          {step === 2 && "What's the budget?"}
          {step === 3 && "Three gifts, zero risk"}
        </h2>

        {/* progress */}
        <div className="mt-4 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cx(
                "h-1 flex-1 rounded-full transition-all duration-500",
                step > i ? "bg-gold" : step === i ? "bg-gold/50" : "bg-white/10",
              )}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="mt-6 grid gap-2.5">
            {Object.keys(RECIPIENT_MOOD).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRecipient(r);
                  setStep(1);
                }}
                className={cx(optionCls, "flex items-center justify-between")}
              >
                {r} <ArrowRight size={14} className="text-gold" />
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {MOODS.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => {
                  setMood(m.name);
                  setStep(2);
                }}
                className={optionCls}
              >
                <span className="block font-semibold">{m.name}</span>
                <span className="mt-0.5 block text-[0.65rem] font-normal text-mist">{m.hint}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 px-1">
            <p className="text-center font-display text-4xl font-semibold text-gold-grad">{money(budget * 100)}</p>
            <input
              type="range"
              min={40}
              max={150}
              step={5}
              value={budget}
              onChange={(e) => {
                const v = Number(e.target.value);
                e.currentTarget.style.setProperty("--val", `${((v - 40) / 110) * 100}%`);
                setBudget(v);
              }}
              className="range-gold mt-6 w-full"
              style={{ ["--val" as never]: `${((budget - 40) / 110) * 100}%` }}
              aria-label="Gift budget"
            />
            <div className="mt-2 flex justify-between text-[0.62rem] tracking-widest text-mist uppercase">
              <span>$40</span>
              <span>$150+</span>
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-gold mt-8 w-full rounded-full py-3.5 text-xs font-bold tracking-widest uppercase"
            >
              Find their gift
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 space-y-3">
            {results.length === 0 && (
              <p className="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-center text-xs text-mist">
                Nothing fits that budget yet — try stretching it a little.
              </p>
            )}
            {results.map((p, i) => (
              <div
                key={p.slug}
                className="pop-in flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} className="size-16 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-ivory">
                    {i === 0 && <PartyPopper size={12} className="shrink-0 text-gold" />}
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-xs">
                    <span className="font-semibold text-gold-2">{money(p.price)}</span>
                    <span className="ml-2 text-mist">{p.rating.toFixed(1)} ★</span>
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Add ${p.name} to cart`}
                  onClick={() => {
                    addToCart(p.slug);
                    notify("Gift secured", "Gift wrap is free — we insist.", "success");
                  }}
                  className="btn-gold grid size-9 shrink-0 place-items-center rounded-full"
                >
                  <ShoppingBag size={13} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setStep(0)}
              className="mx-auto mt-2 flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-widest text-mist uppercase transition-colors hover:text-ivory"
            >
              <RotateCcw size={11} /> Start over
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
