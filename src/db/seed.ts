import { sql } from "drizzle-orm";
import { db } from "@/db";
import { products, type NewProductRow } from "@/db/schema";
import { CATALOG } from "@/lib/catalog-data";

export { CATALOG };

export async function ensureSchema(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      brand TEXT,
      description TEXT NOT NULL,
      short_description TEXT,
      long_description TEXT,
      category TEXT NOT NULL,
      moods TEXT[] NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER NOT NULL,
      rating DOUBLE PRECISION NOT NULL,
      review_count INTEGER NOT NULL,
      popularity INTEGER NOT NULL DEFAULT 0,
      stock INTEGER NOT NULL DEFAULT 0,
      badge TEXT,
      image TEXT NOT NULL,
      gallery TEXT[],
      features TEXT[],
      specifications JSONB,
      colors TEXT[],
      delivery_time TEXT,
      warranty TEXT,
      is_new BOOLEAN NOT NULL DEFAULT FALSE,
      is_trending BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL DEFAULT 'website',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

export async function ensureSeeded(): Promise<void> {
  await ensureSchema();
  const result = await db.execute(sql`SELECT COUNT(*)::int AS count FROM products`);
  const count = (result.rows[0] as { count: number }).count;
  if (count >= 90) return;
  await db.execute(sql`TRUNCATE TABLE products RESTART IDENTITY`);
  await db.insert(products).values(CATALOG as unknown as NewProductRow[]);
}
