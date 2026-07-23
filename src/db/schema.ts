import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand"),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  longDescription: text("long_description"),
  category: text("category").notNull(),
  moods: text("moods").array().notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price").notNull(),
  rating: doublePrecision("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  popularity: integer("popularity").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  badge: text("badge"),
  image: text("image").notNull(),
  gallery: text("gallery").array(),
  features: text("features").array(),
  specifications: jsonb("specifications"),
  colors: text("colors").array(),
  deliveryTime: text("delivery_time"),
  warranty: text("warranty"),
  isNew: boolean("is_new").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("website"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;
