"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { cx, money } from "@/lib/shop";
import { useApp } from "@/components/app-provider";
import { MeridianLogo } from "@/components/navbar";
import { Toasts } from "@/components/overlays";

type Form = {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  card: string;
  expiry: string;
  cvc: string;
};

const EMPTY: Form = {
  name: "",
  email: "",
  address: "",
  city: "",
  zip: "",
  country: "United States",
  card: "",
  expiry: "",
  cvc: "",
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.62rem] font-bold tracking-[0.2em] text-mist uppercase">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[0.68rem] font-medium text-coral">{error}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-ivory outline-none transition-colors placeholder:text-mist/50 focus:border-gold/60";

export default function CheckoutPage() {
  const {
    cartDetails,
    cartCount,
    subtotal,
    savings,
    promoDiscount,
    shipping,
    cartTotal,
    promo,
    placeOrder,
    notify,
    user,
  } = useApp();
  const [form, setForm] = useState<Form>({ ...EMPTY, email: user?.email ?? "", name: user?.name ?? "" });
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [phase, setPhase] = useState<"form" | "processing" | "done">("form");
  const [orderId, setOrderId] = useState<string | null>(null);

  const set = (key: keyof Form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Partial<Form> = {};
    if (form.name.trim().length < 2) err.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) err.email = "Valid email required";
    if (form.address.trim().length < 5) err.address = "Street address required";
    if (form.city.trim().length < 2) err.city = "City required";
    if (form.zip.trim().length < 3) err.zip = "Required";
    if (form.card.replace(/\s/g, "").length !== 16) err.card = "16 digits";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) err.expiry = "MM/YY";
    if (!/^\d{3,4}$/.test(form.cvc)) err.cvc = "3–4 digits";
    setErrors(err);
    if (Object.keys(err).length > 0) {
      notify("Almost there", "A few fields need attention.", "info");
      return;
    }
    setPhase("processing");
    window.setTimeout(() => {
      const order = placeOrder(form.email.trim().toLowerCase());
      setOrderId(order.id);
      setPhase("done");
      notify("Order placed", `${order.id} is confirmed.`, "success");
      window.scrollTo({ top: 0 });
    }, 1800);
  };

  return (
    <div className="relative min-h-screen">
      <header className="border-b border-white/8 bg-night-2/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <MeridianLogo />
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold tracking-widest text-mist uppercase transition-colors hover:text-ivory"
          >
            <ArrowLeft size={13} /> Continue shopping
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {phase === "done" ? (
          <div className="pop-in mx-auto max-w-xl py-16 text-center">
            <span className="ping-ring mx-auto grid size-20 place-items-center rounded-full bg-teal/15 text-teal">
              <CheckCircle2 size={34} />
            </span>
            <h1 className="mt-8 font-display text-4xl font-semibold text-ivory">
              Order <em className="text-gold-grad italic">confirmed</em>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              Thank you{form.name ? `, ${form.name.split(" ")[0]}` : ""}. Order{" "}
              <span className="font-bold text-gold-2">{orderId}</span> is being wrapped in
              plastic-free packaging as we speak. A confirmation is on its way to{" "}
              <span className="text-ivory">{form.email}</span>.
            </p>
            <div className="glass mx-auto mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-3xl text-center">
              {[
                { icon: PackageCheck, label: "Packed in 24h" },
                { icon: Truck, label: "Arrives in 2–4 days" },
                { icon: ShieldCheck, label: "Fully insured" },
              ].map((s) => (
                <div key={s.label} className="px-3 py-5">
                  <s.icon size={17} className="mx-auto text-gold" />
                  <p className="mt-2 text-[0.65rem] font-semibold text-ivory-dim">{s.label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/"
              className="btn-gold mt-10 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-xs font-bold tracking-widest uppercase"
            >
              Back to the collection <ArrowRight size={14} />
            </Link>
          </div>
        ) : cartCount === 0 ? (
          <div className="mx-auto max-w-md py-24 text-center">
            <ShoppingBag size={34} className="mx-auto text-mist/40" />
            <h1 className="mt-6 font-display text-3xl font-semibold text-ivory">Nothing to check out yet</h1>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              Your cart is empty. The collection, however, is not.
            </p>
            <Link
              href="/"
              className="btn-gold mt-8 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-xs font-bold tracking-widest uppercase"
            >
              <ArrowLeft size={14} /> Browse pieces
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10 flex items-center gap-4">
              <h1 className="font-display text-3xl font-semibold text-ivory sm:text-4xl">Secure checkout</h1>
              <span className="flex items-center gap-1.5 rounded-full border border-teal/35 bg-teal/10 px-3.5 py-1.5 text-[0.62rem] font-bold tracking-widest text-teal uppercase">
                <LockKeyhole size={11} /> 256-bit encrypted
              </span>
            </div>

            <form onSubmit={submit} className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                {/* contact + shipping */}
                <section className="glass rounded-[2rem] p-7">
                  <h2 className="flex items-center gap-2.5 text-sm font-bold tracking-widest text-ivory uppercase">
                    <User size={15} className="text-gold" /> Contact & shipping
                  </h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" error={errors.name}>
                      <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ava Laurent" />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="ava@example.com" />
                    </Field>
                    <Field label="Street address" error={errors.address}>
                      <input className={cx(inputCls, "sm:col-span-2")} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="512 Golden Hour Ave, Apt 7" />
                    </Field>
                    <Field label="City" error={errors.city}>
                      <input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Portland" />
                    </Field>
                    <Field label="ZIP / Postal code" error={errors.zip}>
                      <input className={inputCls} value={form.zip} onChange={(e) => set("zip", e.target.value)} placeholder="97204" />
                    </Field>
                    <Field label="Country">
                      <select className={cx(inputCls, "cursor-pointer")} value={form.country} onChange={(e) => set("country", e.target.value)}>
                        {["United States", "Canada", "United Kingdom", "Germany", "France", "Australia", "Japan", "United Arab Emirates"].map((c) => (
                          <option key={c} className="bg-night-3">{c}</option>
                        ))}
                      </select>
                    </Field>
                    <div className="flex items-end pb-0.5 text-[0.68rem] text-mist sm:col-span-1">
                      <p className="flex items-center gap-2">
                        <MapPin size={12} className="shrink-0 text-teal" />
                        Ships carbon-neutral from our {form.country === "United States" ? "Portland" : "regional"} atelier.
                      </p>
                    </div>
                  </div>
                </section>

                {/* payment */}
                <section className="glass rounded-[2rem] p-7">
                  <h2 className="flex items-center justify-between text-sm font-bold tracking-widest text-ivory uppercase">
                    <span className="flex items-center gap-2.5">
                      <CreditCard size={15} className="text-gold" /> Payment
                    </span>
                    <span className="flex gap-1.5">
                      {["VISA", "MC", "AMEX"].map((p) => (
                        <span key={p} className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[0.5rem] font-bold text-mist">
                          {p}
                        </span>
                      ))}
                    </span>
                  </h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-[1.6fr_1fr_0.7fr]">
                    <Field label="Card number" error={errors.card}>
                      <input
                        className={inputCls}
                        inputMode="numeric"
                        value={form.card}
                        onChange={(e) => set("card", formatCard(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                      />
                    </Field>
                    <Field label="Expiry" error={errors.expiry}>
                      <input
                        className={inputCls}
                        inputMode="numeric"
                        value={form.expiry}
                        onChange={(e) => set("expiry", formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                      />
                    </Field>
                    <Field label="CVC" error={errors.cvc}>
                      <input
                        className={inputCls}
                        inputMode="numeric"
                        value={form.cvc}
                        onChange={(e) => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                      />
                    </Field>
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-[0.65rem] text-mist">
                    <ShieldCheck size={12} className="text-teal" />
                    This is a design demo — card details are validated locally and never transmitted.
                  </p>
                </section>
              </div>

              {/* summary */}
              <aside className="glass-deep sticky top-24 rounded-[2rem] p-7">
                <h2 className="text-sm font-bold tracking-widest text-ivory uppercase">Order summary</h2>
                <ul className="mt-5 max-h-64 space-y-3.5 overflow-y-auto pr-1">
                  {cartDetails.map(({ line, product, unit }) => (
                    <li key={`${line.slug}-${line.bundle ? "b" : "r"}`} className="flex items-center gap-3.5">
                      <span className="relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.image} alt={product.name} className="size-14 rounded-xl object-cover" />
                        <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-gold text-[0.6rem] font-bold text-night">
                          {line.qty}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-ivory">{product.name}</span>
                        {line.bundle && <span className="text-[0.6rem] font-semibold text-teal">Bundle · 15% off</span>}
                      </span>
                      <span className="text-xs font-semibold text-ivory">{money(unit * line.qty)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-6 space-y-2 border-t border-white/10 pt-5 text-xs text-mist">
                  <div className="flex justify-between">
                    <dt>Subtotal ({cartCount} items)</dt>
                    <dd className="font-semibold text-ivory">{money(subtotal)}</dd>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between">
                      <dt>Catalog savings</dt>
                      <dd className="font-semibold text-teal">−{money(savings)}</dd>
                    </div>
                  )}
                  {promo && (
                    <div className="flex justify-between">
                      <dt>Promo {promo.code}</dt>
                      <dd className="font-semibold text-teal">−{money(promoDiscount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt>Shipping</dt>
                    <dd className="font-semibold text-ivory">{shipping === 0 ? "Free" : money(shipping)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                    <dt className="text-sm font-bold text-ivory">Total</dt>
                    <dd className="font-display text-2xl font-semibold text-gold-grad">{money(cartTotal)}</dd>
                  </div>
                </dl>
                <button
                  type="submit"
                  disabled={phase === "processing"}
                  className="btn-gold mt-6 flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-xs font-bold tracking-widest uppercase disabled:opacity-70"
                >
                  {phase === "processing" ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Processing securely…
                    </>
                  ) : (
                    <>
                      Place order · {money(cartTotal)} <ArrowRight size={14} />
                    </>
                  )}
                </button>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.62rem] text-mist">
                  <LockKeyhole size={9} /> 30-day returns · 2-year warranty · 24/7 concierge
                </p>
              </aside>
            </form>
          </>
        )}
      </main>
      <Toasts />
    </div>
  );
}
