"use client";

import { useState } from "react";
import { ArrowRight, Gift, Heart, ShoppingBag, Tag, Trash2, Truck, X } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, money } from "@/lib/shop";
import { useApp } from "@/components/app-provider";
import { QtyStepper } from "@/components/ui";

export function CartDrawer() {
  const {
    ui,
    setUi,
    cartDetails,
    cartCount,
    subtotal,
    savings,
    promoDiscount,
    shipping,
    cartTotal,
    promo,
    giftWrap,
    setGiftWrap,
    waxNote,
    setWaxNote,
    applyPromo,
    updateQty,
    removeLine,
    notify,
  } = useApp();
  const [code, setCode] = useState("");

  if (!ui.cartOpen) return null;
  const close = () => setUi({ cartOpen: false });
  const remaining = FREE_SHIPPING_THRESHOLD - (subtotal - promoDiscount);
  const progress = Math.min(((subtotal - promoDiscount) / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="fixed inset-0 z-50">
      <div className="fade-in absolute inset-0 bg-night/75 backdrop-blur-sm" onClick={close} />
      <aside className="drawer-in glass-deep absolute inset-y-0 right-0 flex w-full max-w-md flex-col sm:m-3 sm:rounded-[2rem]">
        <header className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-ivory">
            <ShoppingBag size={18} className="text-gold" />
            Your cart
            <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[0.65rem] font-bold text-gold-2">
              {cartCount}
            </span>
          </h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={close}
            className="grid size-9 place-items-center rounded-full border border-white/12 text-mist transition-colors hover:text-ivory"
          >
            <X size={15} />
          </button>
        </header>

        {/* free shipping progress */}
        {cartCount > 0 && (
          <div className="border-b border-white/8 px-6 py-4">
            <p className="flex items-center gap-2 text-[0.7rem] text-mist">
              <Truck size={13} className="text-teal" />
              {remaining > 0 ? (
                <>
                  <span className="font-semibold text-teal">{money(remaining)}</span> away from free shipping
                </>
              ) : (
                <span className="font-semibold text-teal">Free shipping unlocked — nicely done.</span>
              )}
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal/80 to-gold transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cartDetails.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="grid size-16 place-items-center rounded-full border border-dashed border-white/15 text-mist">
                <ShoppingBag size={22} />
              </span>
              <p className="font-display text-lg font-semibold text-ivory">Your cart is beautifully empty</p>
              <p className="max-w-[15rem] text-xs leading-relaxed text-mist">
                Add a lamp, a throw, a small ritual — the good kind of clutter.
              </p>
              <button
                type="button"
                onClick={close}
                className="btn-gold mt-2 rounded-full px-6 py-3 text-xs font-bold tracking-widest uppercase"
              >
                Start browsing
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartDetails.map(({ line, product, unit }) => (
                <li key={`${line.slug}-${line.bundle ? "b" : "r"}`} className="group flex gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      setUi({ quickView: product.slug });
                    }}
                    className="shrink-0 overflow-hidden rounded-2xl"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt={product.name} className="size-20 object-cover transition-transform duration-500 group-hover:scale-105" />
                  </button>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ivory">{product.name}</p>
                        {line.bundle && (
                          <p className="mt-0.5 flex items-center gap-1 text-[0.62rem] font-semibold text-teal">
                            <Tag size={9} /> Bundle price · 15% off
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => removeLine(line.slug, line.bundle)}
                        className="text-mist transition-colors hover:text-coral"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QtyStepper small qty={line.qty} onChange={(d) => updateQty(line.slug, d, line.bundle)} />
                      <p className="text-sm font-bold text-ivory">
                        {money(unit * line.qty)}
                        {unit < product.originalPrice && (
                          <span className="ml-2 text-[0.65rem] font-normal text-mist line-through">
                            {money(product.originalPrice * line.qty)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartDetails.length > 0 && (
          <footer className="border-t border-white/8 px-6 py-5">
            {/* promo */}
            {promo ? (
              <p className="mb-3 flex items-center justify-between rounded-2xl border border-teal/35 bg-teal/10 px-4 py-2.5 text-xs">
                <span className="flex items-center gap-2 font-semibold text-teal">
                  <Gift size={13} /> {promo.code} — {Math.round(promo.pct * 100)}% off applied
                </span>
                <button
                  type="button"
                  className="text-mist hover:text-coral"
                  onClick={() => applyPromo("__remove__")}
                >
                  <X size={13} />
                </button>
              </p>
            ) : (
              <form
                className="mb-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!code.trim()) return;
                  if (applyPromo(code)) {
                    notify("Promo applied", `${code.trim().toUpperCase()} is now active.`, "success");
                    setCode("");
                  } else {
                    notify("Invalid code", "Try NOVA10 for 10% off.", "info");
                  }
                }}
              >
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Promo code (try NOVA10)"
                  className="flex-1 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5 text-xs text-ivory outline-none placeholder:text-mist/60 focus:border-gold/60"
                />
                <button type="submit" className="btn-ghost rounded-full px-4 py-2.5 text-[0.65rem] font-bold tracking-widest uppercase">
                  Apply
                </button>
              </form>
            )}

            {/* Luxury Gift Options */}
            <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer text-xs">
                <span className="flex items-center gap-2 text-ivory font-medium">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="accent-gold rounded"
                  />
                  🎁 Luxury Gold Foil Gift Box
                </span>
                <span className="text-gold-2 font-semibold">+$7.00</span>
              </label>

              {giftWrap && (
                <input
                  type="text"
                  value={waxNote}
                  onChange={(e) => setWaxNote(e.target.value)}
                  placeholder="Custom Wax Sealed Note (Optional)..."
                  className="w-full rounded-xl border border-white/10 bg-night/80 px-3 py-1.5 text-xs text-ivory outline-none focus:border-gold/60"
                />
              )}
            </div>

            <dl className="space-y-1.5 text-xs text-mist">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-ivory">{money(subtotal)}</dd>
              </div>
              {giftWrap && (
                <div className="flex justify-between text-gold-2">
                  <dt>Gift Wrapping</dt>
                  <dd className="font-semibold">$7.00</dd>
                </div>
              )}
              {savings > 0 && (
                <div className="flex justify-between">
                  <dt>You're saving</dt>
                  <dd className="font-semibold text-teal">−{money(savings + promoDiscount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="font-semibold text-ivory">{shipping === 0 ? "Free" : money(shipping)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-white/10 pt-2.5">
                <dt className="text-sm font-bold text-ivory">Total</dt>
                <dd className="font-display text-xl font-semibold text-gold-grad">
                  {money(cartTotal + (giftWrap ? 700 : 0))}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => {
                close();
                window.location.href = "/checkout";
              }}
              className="btn-gold group mt-4 flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-xs font-bold tracking-widest uppercase"
            >
              Secure checkout
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.62rem] text-mist">
              <Heart size={9} className="text-coral" /> Plastic-free packaging · 30-day returns · 24/7 support
            </p>
          </footer>
        )}
      </aside>
    </div>
  );
}
