// Shared types, constants and helpers for the NovaNest storefront.

export type Product = {
  id: number;
  slug: string;
  name: string;
  brand?: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  category: string;
  moods: string[];
  price: number; // cents
  originalPrice: number; // cents
  rating: number; // 0 - 5
  reviewCount: number;
  popularity: number; // 0 - 100
  stock: number;
  badge: string | null;
  image: string;
  gallery?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  colors?: string[];
  deliveryTime?: string;
  warranty?: string;
  isNew: boolean;
  isTrending: boolean;
};

export type CartLine = {
  slug: string;
  qty: number;
  bundle?: boolean;
};

export type SortKey = "popular" | "rating" | "price-asc" | "price-desc" | "newest";

export type Filters = {
  category: string; // "All" or category name
  mood: string | null;
  maxPrice: number; // dollars
  minRating: number; // 0 | 4 | 4.5
  sort: SortKey;
  query: string;
};

export const DEFAULT_FILTERS: Filters = {
  category: "All",
  mood: null,
  maxPrice: 800,
  minRating: 0,
  sort: "popular",
  query: "",
};

export const CATEGORIES = [
  {
    name: "Smart Home",
    tagline: "Intelligent pieces that quietly run your home.",
    image: "/images/product-dock.jpg",
  },
  {
    name: "Desk Setup",
    tagline: "Focus-grade essentials for beautiful deep work.",
    image: "/images/stock/deskmat.jpg",
  },
  {
    name: "Home Decor",
    tagline: "Sculptural objects that warm every corner.",
    image: "/images/product-shelf.jpg",
  },
  {
    name: "Wellness",
    tagline: "Rituals of calm, designed for daily life.",
    image: "/images/product-candles.jpg",
  },
  {
    name: "Gifts",
    tagline: "Considered pieces they will actually keep.",
    image: "/images/limited-drop.jpg",
  },
  {
    name: "Travel Essentials",
    tagline: "Carry-everywhere companions, beautifully built.",
    image: "/images/product-pouch.jpg",
  },
] as const;

export const MOODS = [
  { name: "Calm", hint: "Slow evenings & soft light" },
  { name: "Focus", hint: "Deep work, zero clutter" },
  { name: "Cozy", hint: "Warm textures, warm corners" },
  { name: "Luxury", hint: "The elevated everyday" },
  { name: "Giftable", hint: "Ready to be unwrapped" },
] as const;

export const FREE_SHIPPING_THRESHOLD = 7500; // cents
export const FLAT_SHIPPING = 695; // cents
export const PROMO_CODES: Record<string, number> = {
  NOVA10: 0.1,
  CIRCLE15: 0.15,
};

export function money(cents: number): string {
  const value = cents / 100;
  return value % 1 === 0
    ? `$${value.toLocaleString("en-US")}`
    : `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function discountPct(p: Product): number {
  if (p.originalPrice <= p.price) return 0;
  return Math.round((1 - p.price / p.originalPrice) * 100);
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function applyFilters(products: Product[], f: Filters): Product[] {
  const q = f.query.trim().toLowerCase();
  const list = products.filter((p) => {
    if (f.category !== "All" && p.category !== f.category) return false;
    if (f.mood && !p.moods.includes(f.mood)) return false;
    if (p.price > f.maxPrice * 100) return false;
    if (p.rating < f.minRating) return false;
    if (q) {
      const hay = `${p.name} ${p.brand ?? ""} ${p.description} ${p.category} ${p.moods.join(" ")} ${(p.features ?? []).join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  switch (f.sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "newest":
      return list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.popularity - a.popularity);
    default:
      return list.sort((a, b) => b.popularity - a.popularity);
  }
}
