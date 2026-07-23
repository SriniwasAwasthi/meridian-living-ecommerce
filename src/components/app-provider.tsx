"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  applyFilters,
  DEFAULT_FILTERS,
  FLAT_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODES,
  type CartLine,
  type Filters,
  type Product,
} from "@/lib/shop";

export function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/") {
    window.location.href = `/#${id}`;
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    const yOffset = -90;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export type Toast = { id: number; title: string; message?: string; kind: "cart" | "wish" | "info" | "success" };

export type UserProfile = { name: string; email: string; joinedAt: string };

export type Order = {
  id: string;
  email: string;
  items: { slug: string; name: string; qty: number; unit: number }[];
  total: number;
  placedAt: string;
};

type UiState = {
  cartOpen: boolean;
  wishOpen: boolean;
  accountOpen: boolean;
  compareOpen: boolean;
  giftOpen: boolean;
  mobileNavOpen: boolean;
  aiOpen: boolean;
  vipOpen: boolean;
  quickView: string | null; // slug
};

export type CartDetail = {
  line: CartLine;
  product: Product;
  unit: number;
};

type AppContextValue = {
  products: Product[] | null;
  loading: boolean;
  cart: CartLine[];
  cartDetails: CartDetail[];
  cartCount: number;
  subtotal: number;
  savings: number;
  promoDiscount: number;
  shipping: number;
  cartTotal: number;
  promo: { code: string; pct: number } | null;
  wishlist: string[];
  compare: string[];
  toasts: Toast[];
  ui: UiState;
  filters: Filters;
  filtered: Product[];
  user: UserProfile | null;
  orders: Order[];
  soundEnabled: boolean;
  giftWrap: boolean;
  waxNote: string;
  setGiftWrap: (val: boolean) => void;
  setWaxNote: (text: string) => void;
  toggleSound: () => void;
  playSound: (type: "click" | "cart" | "chime") => void;
  addToCart: (slug: string, opts?: { qty?: number; bundle?: boolean; silent?: boolean }) => void;
  updateQty: (slug: string, delta: number, bundle?: boolean) => void;
  removeLine: (slug: string, bundle?: boolean) => void;
  clearCart: () => void;
  toggleWish: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  notify: (title: string, message?: string, kind?: Toast["kind"]) => void;
  setUi: (patch: Partial<UiState>) => void;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
  applyPromo: (code: string) => boolean;
  signIn: (profile: UserProfile) => void;
  signOut: () => void;
  placeOrder: (email: string) => Order;
  productBySlug: (slug: string) => Product | undefined;
};

const AppContext = createContext<AppContextValue | null>(null);

const UI_DEFAULT: UiState = {
  cartOpen: false,
  wishOpen: false,
  accountOpen: false,
  compareOpen: false,
  giftOpen: false,
  mobileNavOpen: false,
  aiOpen: false,
  vipOpen: false,
  quickView: null,
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function playWebAudioSound(type: "click" | "cart" | "chime") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "click") {
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === "cart") {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "chime") {
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch {}
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ui, setUiState] = useState<UiState>(UI_DEFAULT);
  const [filters, setFilterState] = useState<Filters>(DEFAULT_FILTERS);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promo, setPromo] = useState<{ code: string; pct: number } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [giftWrap, setGiftWrap] = useState(false);
  const [waxNote, setWaxNote] = useState("");
  const hydrated = useRef(false);
  const toastId = useRef(0);

  const playSound = useCallback((type: "click" | "cart" | "chime") => {
    if (soundEnabled) playWebAudioSound(type);
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) playWebAudioSound("chime");
      return next;
    });
  }, []);

  // Fetch catalog with fallback to seed CATALOG
  useEffect(() => {
    let alive = true;
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: { products?: (Product & { moods: string[] | null })[] }) => {
        if (!alive) return;
        if (data.products && data.products.length >= 90) {
          setProducts(
            data.products.map((p) => ({ ...p, moods: p.moods ?? [] })),
          );
        } else {
          import("@/lib/catalog-data").then(({ CATALOG }) => {
            if (alive) setProducts(CATALOG);
          });
        }
      })
      .catch(() => {
        if (alive) {
          import("@/lib/catalog-data").then(({ CATALOG }) => {
            if (alive) setProducts(CATALOG);
          });
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  // Hydrate persisted state
  useEffect(() => {
    setCart(read<CartLine[]>("nn-cart", []));
    setWishlist(read<string[]>("nn-wish", []));
    setCompare(read<string[]>("nn-compare", []));
    setUser(read<UserProfile | null>("nn-user", null));
    setOrders(read<Order[]>("nn-orders", []));
    setPromo(read<{ code: string; pct: number } | null>("nn-promo", null));
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (hydrated.current) localStorage.setItem("nn-cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    if (hydrated.current) localStorage.setItem("nn-wish", JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    if (hydrated.current) localStorage.setItem("nn-compare", JSON.stringify(compare));
  }, [compare]);
  useEffect(() => {
    if (hydrated.current) localStorage.setItem("nn-user", JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    if (hydrated.current) localStorage.setItem("nn-orders", JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    if (hydrated.current) localStorage.setItem("nn-promo", JSON.stringify(promo));
  }, [promo]);

  const setUi = useCallback((patch: Partial<UiState>) => {
    setUiState((prev) => ({ ...prev, ...patch }));
  }, []);

  const notify = useCallback((title: string, message?: string, kind: Toast["kind"] = "info") => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { id, title, message, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const productBySlug = useCallback(
    (slug: string) => products?.find((p) => p.slug === slug),
    [products],
  );

  const addToCart = useCallback(
    (slug: string, opts?: { qty?: number; bundle?: boolean; silent?: boolean }) => {
      const qty = opts?.qty ?? 1;
      const bundle = opts?.bundle ?? false;
      setCart((prev) => {
        const idx = prev.findIndex((l) => l.slug === slug && Boolean(l.bundle) === bundle);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: Math.min(next[idx].qty + qty, 99) };
          return next;
        }
        return [...prev, { slug, qty, bundle }];
      });
      if (!opts?.silent) {
        const p = productBySlug(slug);
        notify("Added to cart", p ? p.name : undefined, "cart");
        setUi({ cartOpen: true });
      }
    },
    [notify, productBySlug, setUi],
  );

  const updateQty = useCallback((slug: string, delta: number, bundle = false) => {
    setCart((prev) =>
      prev
        .map((l) =>
          l.slug === slug && Boolean(l.bundle) === bundle
            ? { ...l, qty: Math.min(Math.max(l.qty + delta, 0), 99) }
            : l,
        )
        .filter((l) => l.qty > 0),
    );
  }, []);

  const removeLine = useCallback((slug: string, bundle = false) => {
    setCart((prev) => prev.filter((l) => !(l.slug === slug && Boolean(l.bundle) === bundle)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWish = useCallback(
    (slug: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(slug);
        const p = productBySlug(slug);
        notify(exists ? "Removed from wishlist" : "Saved to wishlist", p?.name, "wish");
        return exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      });
    },
    [notify, productBySlug],
  );

  const toggleCompare = useCallback(
    (slug: string) => {
      setCompare((prev) => {
        if (prev.includes(slug)) return prev.filter((s) => s !== slug);
        if (prev.length >= 3) {
          notify("Compare is full", "You can compare up to 3 pieces at once.", "info");
          return prev;
        }
        return [...prev, slug];
      });
    },
    [notify],
  );

  const clearCompare = useCallback(() => setCompare([]), []);

  const setFilters = useCallback((patch: Partial<Filters>) => {
    setFilterState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => setFilterState(DEFAULT_FILTERS), []);

  const applyPromo = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    const pct = PROMO_CODES[normalized];
    if (pct) {
      setPromo({ code: normalized, pct });
      return true;
    }
    setPromo(null);
    return false;
  }, []);

  const signIn = useCallback(
    (profile: UserProfile) => {
      setUser(profile);
      notify(`Welcome, ${profile.name.split(" ")[0]}`, "Your Meridian Living account is ready.", "success");
    },
    [notify],
  );

  const signOut = useCallback(() => {
    setUser(null);
    notify("Signed out", "See you soon.", "info");
  }, [notify]);

  const cartDetails = useMemo<CartDetail[]>(() => {
    if (!products) return [];
    return cart
      .map((line) => {
        const product = products.find((p) => p.slug === line.slug);
        if (!product) return null;
        const unit = line.bundle ? Math.round(product.price * 0.85) : product.price;
        return { line, product, unit };
      })
      .filter((d): d is CartDetail => d !== null);
  }, [cart, products]);

  const cartCount = useMemo(() => cartDetails.reduce((n, d) => n + d.line.qty, 0), [cartDetails]);
  const subtotal = useMemo(() => cartDetails.reduce((n, d) => n + d.unit * d.line.qty, 0), [cartDetails]);
  const savings = useMemo(
    () => cartDetails.reduce((n, d) => n + (d.product.originalPrice - d.unit) * d.line.qty, 0),
    [cartDetails],
  );
  const promoDiscount = useMemo(
    () => (promo ? Math.round(subtotal * promo.pct) : 0),
    [promo, subtotal],
  );
  const shipping = useMemo(() => {
    if (subtotal - promoDiscount <= 0) return 0;
    return subtotal - promoDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  }, [subtotal, promoDiscount]);
  const cartTotal = useMemo(
    () => Math.max(subtotal - promoDiscount, 0) + shipping,
    [subtotal, promoDiscount, shipping],
  );

  const placeOrder = useCallback(
    (email: string): Order => {
      const order: Order = {
        id: `NN-${Date.now().toString(36).toUpperCase()}`,
        email,
        items: cartDetails.map((d) => ({
          slug: d.product.slug,
          name: d.product.name,
          qty: d.line.qty,
          unit: d.unit,
        })),
        total: cartTotal,
        placedAt: new Date().toISOString(),
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      setPromo(null);
      return order;
    },
    [cartDetails, cartTotal],
  );

  const filtered = useMemo(
    () => applyFilters(products ?? [], filters),
    [products, filters],
  );

  const value: AppContextValue = {
    products,
    loading: products === null,
    cart,
    cartDetails,
    cartCount,
    subtotal,
    savings,
    promoDiscount,
    shipping,
    cartTotal,
    promo,
    wishlist,
    compare,
    toasts,
    ui,
    filters,
    filtered,
    user,
    orders,
    soundEnabled,
    giftWrap,
    waxNote,
    setGiftWrap,
    setWaxNote,
    toggleSound,
    playSound,
    addToCart,
    updateQty,
    removeLine,
    clearCart,
    toggleWish,
    toggleCompare,
    clearCompare,
    notify,
    setUi,
    setFilters,
    resetFilters,
    applyPromo,
    signIn,
    signOut,
    placeOrder,
    productBySlug,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
