"use client";

import { Camera, ShoppingBag } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { Reveal, SectionHead } from "@/components/ui";

const UGC_POSTS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
    author: "@minimalist_workspace",
    productSlug: "wireless-mechanical-keyboard",
    productName: "Mechanical Keyboard",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
    author: "@scandi_living",
    productSlug: "nordic-opal-glass-table-lamp",
    productName: "Opal Glass Lamp",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
    author: "@serene_corners",
    productSlug: "matte-ceramic-ultrasonic-diffuser",
    productName: "Ceramic Diffuser",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80",
    author: "@cozy_loft_ny",
    productSlug: "cloudknit-merino-chunky-throw",
    productName: "CloudKnit Throw",
  },
];

export function UgcGallery() {
  const { setUi } = useApp();

  return (
    <section className="py-20 border-t border-white/5 bg-night-2/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[0.62rem] font-bold tracking-[0.25em] text-gold-2 uppercase flex items-center gap-1.5">
              <Camera size={13} /> #MeridianLivingInTheWild
            </span>
            <h3 className="font-display text-2xl font-bold text-ivory mt-1">
              Curated by Our <em className="text-gold-grad italic">Community</em>
            </h3>
          </div>
          <p className="text-xs text-mist max-w-md">
            Tag @meridianliving on Instagram for a chance to be featured in our official gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {UGC_POSTS.map((post, idx) => (
            <Reveal key={post.id} delay={idx * 70}>
              <div className="group relative aspect-square overflow-hidden rounded-3xl border border-white/10 glass">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.author}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-5 flex flex-col justify-end">
                  <span className="text-[0.65rem] font-bold text-gold-2">{post.author}</span>
                  <p className="text-xs font-semibold text-ivory mt-0.5">{post.productName}</p>
                  <button
                    type="button"
                    onClick={() => setUi({ quickView: post.productSlug })}
                    className="btn-gold mt-3 flex items-center justify-center gap-1.5 rounded-full py-2 text-[0.65rem] font-bold uppercase"
                  >
                    <ShoppingBag size={12} /> Shop Item
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
