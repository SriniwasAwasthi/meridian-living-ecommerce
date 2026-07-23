"use client";

import { useState } from "react";
import { Eye, Flame, ShoppingBag, Sparkles, X } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { Badge, Price, Reveal, SectionHead, Stars } from "@/components/ui";
import { cx, type Product } from "@/lib/shop";

type Hotspot = {
  id: string;
  productSlug: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
};

type Look = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  hotspots: Hotspot[];
};

const LOOKS: Look[] = [
  {
    id: "desk-setup",
    name: "The Executive Workstation",
    tagline: "Focus-grade wood, aluminum, and warm ambient light engineered for deep work.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1400&q=85",
    hotspots: [
      { id: "chair", productSlug: "ergonomic-mesh-task-chair", x: 24, y: 48, title: "Ergonomic Mesh Chair" },
      { id: "lamp", productSlug: "minimalist-touch-rgb-desk-lamp", x: 49, y: 81, title: "Touch RGB Desk Lamp" },
      { id: "keyboard", productSlug: "wireless-mechanical-keyboard", x: 48, y: 68, title: "Wireless Mechanical Keyboard" },
      { id: "mouse", productSlug: "precision-wireless-ergonomic-mouse", x: 71, y: 74, title: "Ergonomic Mouse" },
      { id: "mat", productSlug: "meridian-full-grain-leather-desk-mat", x: 52, y: 86, title: "Leather Desk Mat" },
      { id: "monitor", productSlug: "34-inch-ultrawide-curved-monitor", x: 50, y: 30, title: "34-Inch Curved Monitor" }
    ]
  },
  {
    id: "living-room",
    name: "Nordic Evening Sanctuary",
    tagline: "Sculptural ceramics, organic wool textures, and soft evening glow.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85",
    hotspots: [
      { id: "throw", productSlug: "cloudknit-merino-chunky-throw", x: 38, y: 75, title: "CloudKnit Merino Throw" },
      { id: "lamp-nordic", productSlug: "nordic-opal-glass-table-lamp", x: 78, y: 40, title: "Nordic Glass Table Lamp" },
      { id: "plant", productSlug: "potted-fiddle-leaf-fig-tree", x: 15, y: 48, title: "Fiddle Leaf Fig Tree" },
      { id: "vase", productSlug: "artisan-terracotta-ceramic-vase", x: 62, y: 55, title: "Ceramic Artisan Vase" },
      { id: "mirror", productSlug: "brushed-brass-arch-wall-mirror", x: 45, y: 30, title: "Arch Wall Mirror" }
    ]
  },
  {
    id: "wellness-suite",
    name: "The Zen Ritual Suite",
    tagline: "Ultrasonic mist, botanical oils, and evening calm designed for daily restoration.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1400&q=85",
    hotspots: [
      { id: "diffuser", productSlug: "matte-ceramic-ultrasonic-diffuser", x: 42, y: 45, title: "Ceramic Aroma Diffuser" },
      { id: "candles", productSlug: "soy-wax-amber-candle-trio-set", x: 68, y: 50, title: "Soy Wax Candle Trio" },
      { id: "tea", productSlug: "artisanal-organic-loose-leaf-tea-collection", x: 28, y: 65, title: "Organic Loose Leaf Tea" },
      { id: "cushion", productSlug: "organic-buckwheat-meditation-cushion", x: 52, y: 78, title: "Meditation Cushion" }
    ]
  }
];

export function ShopTheLook() {
  const { products, productBySlug, addToCart, setUi, playSound } = useApp();
  const [activeLookId, setActiveLookId] = useState<string>("desk-setup");
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const activeLook = LOOKS.find((l) => l.id === activeLookId) || LOOKS[0];
  const activeProduct: Product | undefined = activeHotspot
    ? productBySlug(activeHotspot.productSlug) ||
      (products ?? []).find((p) => p.name.toLowerCase().includes(activeHotspot.title.toLowerCase())) ||
      (products ?? [])[0]
    : undefined;

  return (
    <section id="shop-the-look" className="relative scroll-mt-28 py-24 bg-night-2/30 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Interactive Spaces"
          title={
            <>
              Shop the <em className="text-gold-grad italic">Look</em>
            </>
          }
          copy="Click any glowing gold hotspot to explore the curated pieces that compose the aesthetic room setup."
        />

        {/* Look Tabs Selector */}
        <Reveal delay={80} className="mt-10 flex justify-center">
          <div className="glass inline-flex flex-wrap gap-2 rounded-full p-2 border border-white/10">
            {LOOKS.map((look) => (
              <button
                key={look.id}
                type="button"
                onClick={() => {
                  playSound("click");
                  setActiveLookId(look.id);
                  setActiveHotspot(null);
                }}
                className={cx(
                  "rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300",
                  activeLookId === look.id
                    ? "btn-gold shadow-lg shadow-gold/20"
                    : "text-mist hover:text-ivory hover:bg-white/5"
                )}
              >
                {look.name}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Hotspot Room Canvas */}
        <Reveal delay={120} className="mt-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl glass">
            <div className="relative aspect-[16/9] min-h-[420px] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeLook.image}
                alt={activeLook.name}
                className="h-full w-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-night/20" />

              {/* Hotspot Pins */}
              {activeLook.hotspots.map((hs) => {
                const isActive = activeHotspot?.id === hs.id;
                return (
                  <div
                    key={hs.id}
                    style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <button
                      type="button"
                      aria-label={hs.title}
                      onClick={() => {
                        playSound("click");
                        setActiveHotspot(isActive ? null : hs);
                      }}
                      className={cx(
                        "group relative grid size-9 place-items-center rounded-full border transition-transform duration-300 hover:scale-125",
                        isActive
                          ? "border-gold bg-gold text-night ring-4 ring-gold/40 scale-125"
                          : "border-gold/80 bg-night/80 text-gold-2 backdrop-blur-md hover:bg-gold hover:text-night"
                      )}
                    >
                      <span className="absolute inset-0 rounded-full bg-gold/50 animate-ping" />
                      <Sparkles size={14} className="relative z-10" />
                    </button>
                  </div>
                );
              })}

              {/* Tagline Badge */}
              <div className="absolute bottom-6 left-6 max-w-md p-4 rounded-2xl glass-deep border border-white/10 backdrop-blur-md">
                <span className="text-[0.62rem] font-bold tracking-[0.2em] text-gold-2 uppercase">Curated Scene</span>
                <h4 className="mt-1 font-display text-lg font-semibold text-ivory">{activeLook.name}</h4>
                <p className="mt-1 text-xs text-mist leading-relaxed">{activeLook.tagline}</p>
              </div>

              {/* Floating Product Popover Card */}
              {activeHotspot && activeProduct && (
                <div className="absolute top-6 right-6 z-30 w-72 pop-in glass-deep rounded-3xl p-5 border border-gold/40 shadow-2xl shadow-black/80">
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(null)}
                    className="absolute top-3 right-3 text-mist hover:text-ivory"
                  >
                    <X size={14} />
                  </button>

                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl mb-3 border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={activeProduct.image} alt={activeProduct.name} className="h-full w-full object-cover" />
                  </div>

                  <span className="text-[0.6rem] font-bold text-teal tracking-widest uppercase">{activeProduct.category}</span>
                  <h5 className="font-display text-base font-semibold text-ivory line-clamp-1">{activeProduct.name}</h5>

                  <div className="mt-2 flex items-center justify-between">
                    <Price cents={activeProduct.price} original={activeProduct.originalPrice} />
                    <div className="flex items-center gap-1">
                      <Stars value={activeProduct.rating} size={11} />
                      <span className="text-[0.68rem] text-mist">{activeProduct.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(activeProduct.slug);
                        playSound("cart");
                      }}
                      className="btn-gold flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-[0.68rem] font-bold tracking-widest uppercase"
                    >
                      <ShoppingBag size={12} /> Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => setUi({ quickView: activeProduct.slug })}
                      className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/5 text-ivory hover:border-gold"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
