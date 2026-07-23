"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CreditCard, Mail, MapPin, Send, Sparkles } from "lucide-react";
import { scrollToId, useApp } from "@/components/app-provider";
import { MeridianLogo } from "@/components/navbar";
import { Reveal } from "@/components/ui";

export function NewsletterBlock() {
  const { notify } = useApp();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "circle" }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setState("idle");
        return;
      }
      setState("done");
      notify("Welcome to the Circle", data.message, "success");
    } catch {
      setError("Network hiccup — please try again.");
      setState("idle");
    }
  };

  return (
    <section id="circle" className="relative scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/25 px-6 py-14 text-center sm:px-14">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(201,163,92,0.16),transparent_60%)]" />
            <div className="absolute inset-0 -z-10 bg-night-2" />
            <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
            <span className="spin-slow absolute top-10 left-10 hidden text-gold/25 sm:block">
              <Sparkles size={26} />
            </span>
            <span className="spin-slow absolute right-12 bottom-10 hidden text-teal/25 sm:block" style={{ animationDuration: "20s" }}>
              <Sparkles size={20} />
            </span>

            <p className="eyebrow">The Meridian Circle</p>
            <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl leading-tight font-semibold text-ivory sm:text-4xl">
              First looks, private drops, <em className="text-gold-grad italic">quiet discounts</em>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mist">
              One beautifully composed email a week — early access to limited drops, styling notes
              and Circle-only pricing. Never noise.
            </p>

            {state === "done" ? (
              <div className="pop-in mx-auto mt-9 flex max-w-md flex-col items-center gap-2 rounded-3xl border border-teal/35 bg-teal/10 px-6 py-7">
                <span className="grid size-11 place-items-center rounded-full bg-teal/15 text-teal">
                  <Send size={17} />
                </span>
                <p className="text-sm font-bold text-ivory">You're in the Circle.</p>
                <p className="text-xs text-mist">
                  A welcome note — and a code for 15% off — is on its way to {email}.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
                <label className="group flex flex-1 items-center gap-2.5 rounded-full border border-white/15 bg-night/60 px-5 py-3.5 backdrop-blur-md transition-all focus-within:border-gold/60 focus-within:shadow-[0_0_0_4px_rgba(201,163,92,0.1)]">
                  <Mail size={15} className="shrink-0 text-mist transition-colors group-focus-within:text-gold" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-mist/60"
                  />
                </label>
                <button
                  type="submit"
                  disabled={state === "busy"}
                  className="btn-gold flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-xs font-bold tracking-widest uppercase disabled:opacity-60"
                >
                  {state === "busy" ? "Joining…" : "Join the Circle"}
                  <ArrowRight size={13} />
                </button>
              </form>
            )}
            {error && state !== "done" && <p className="mt-3 text-xs font-medium text-coral">{error}</p>}
            <p className="mt-5 text-[0.62rem] tracking-[0.18em] text-mist/70 uppercase">
              No spam · Unsubscribe anytime · 12,400 members and counting
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const SOCIALS = [
  {
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4l7.2 9.3L4.4 20h2.5l5.3-5.2L16.8 20H20l-7.5-9.7L19.3 4h-2.5l-4.7 4.7L8.1 4H4z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 4h3v4h-3c-.6 0-1 .4-1 1v3h4l-.5 4H14v8h-4v-8H7v-4h3V9c0-2.8 2.2-5 5-5z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const FOOTER_COLS: { title: string; links: { label: string; target: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All products", target: "shop" },
      { label: "Categories", target: "categories" },
      { label: "Trending now", target: "trending" },
      { label: "Limited drop", target: "drop" },
      { label: "Build your corner", target: "corner" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our story", target: "story" },
      { label: "Reviews", target: "reviews" },
      { label: "The Circle", target: "circle" },
      { label: "Categories", target: "categories" },
      { label: "Gift finder", target: "gift" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Your cart", target: "cart" },
      { label: "Your account", target: "account" },
      { label: "Wishlist", target: "wishlist" },
      { label: "New arrivals", target: "new_arrivals" },
      { label: "The Circle", target: "circle" },
    ],
  },
];

export function Footer() {
  const { setUi, setFilters, resetFilters, notify } = useApp();
  const [miniEmail, setMiniEmail] = useState("");

  const go = (target: string) => {
    if (target === "cart") return setUi({ cartOpen: true });
    if (target === "account") return setUi({ accountOpen: true });
    if (target === "wishlist") return setUi({ wishOpen: true });
    if (target === "gift") return setUi({ giftOpen: true });
    if (target === "new_arrivals") {
      resetFilters();
      setFilters({ sort: "newest" });
      scrollToId("shop");
      return;
    }
    if (target === "shop") {
      resetFilters();
    }
    scrollToId(target);
  };

  const miniSubscribe = async () => {
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: miniEmail, source: "footer" }),
    });
    if (res.ok) {
      notify("Subscribed", "Welcome to the Meridian Circle.", "success");
      setMiniEmail("");
    } else {
      const data = (await res.json()) as { error?: string };
      notify("Couldn't subscribe", data.error ?? "Please try again.", "info");
    }
  };

  return (
    <footer className="relative border-t border-white/8 bg-night-2/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <MeridianLogo />
            <p className="mt-5 max-w-sm text-xs leading-relaxed text-mist">
              Curated essentials that elevate everyday living. Designed for the corners where life
              actually happens — shipped carbon-neutral, wrapped plastic-free.
            </p>
            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  aria-label={`Meridian Living on ${s.label}`}
                  onClick={() => notify("Follow along", `@meridian.living on ${s.label}`, "info")}
                  className="grid size-10 place-items-center rounded-full border border-white/10 text-mist transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold-2 [&>svg]:h-4 [&>svg]:w-4"
                >
                  {s.icon}
                </button>
              ))}
            </div>
            <div className="mt-7">
              <p className="text-[0.62rem] font-bold tracking-[0.25em] text-mist uppercase">Weekly dispatch</p>
              <div className="mt-2.5 flex max-w-xs items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5 focus-within:border-gold/60">
                <input
                  type="email"
                  value={miniEmail}
                  onChange={(e) => setMiniEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && miniEmail.includes("@") && miniSubscribe()}
                  placeholder="Email address"
                  className="w-full bg-transparent text-xs text-ivory outline-none placeholder:text-mist/60"
                  aria-label="Email for newsletter"
                />
                <button
                  type="button"
                  aria-label="Subscribe"
                  onClick={() => miniEmail.includes("@") && miniSubscribe()}
                  className="text-gold transition-transform hover:translate-x-0.5"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <p className="text-[0.65rem] font-bold tracking-[0.28em] text-gold-2 uppercase">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l, i) => (
                    <li key={`${l.label}-${i}`}>
                      <button
                        type="button"
                        onClick={() => go(l.target)}
                        className="group flex items-center gap-1.5 text-xs text-mist transition-colors hover:text-ivory"
                      >
                        <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-3" />
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/8 pt-8 sm:flex-row">
          <p className="flex items-center gap-2 text-[0.65rem] text-mist">
            <MapPin size={11} className="text-gold" /> © {new Date().getFullYear()} Meridian Living Co. · All rights reserved.
          </p>
          <div className="flex items-center gap-2" aria-label="Accepted payment methods">
            <CreditCard size={16} className="mr-1 text-mist" />
            {["VISA", "MC", "AMEX", "PAYPAL", "APPLE PAY"].map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[0.55rem] font-bold tracking-wider text-mist"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
