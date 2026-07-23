import { NextResponse } from "next/server";
import { CATALOG } from "@/lib/catalog-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const { desc } = await import("drizzle-orm");
      const { db } = await import("@/db");
      const { products } = await import("@/db/schema");
      const { ensureSeeded } = await import("@/db/seed");
      await ensureSeeded();
      const rows = await db.select().from(products).orderBy(desc(products.popularity));
      return NextResponse.json({ products: rows });
    }
    return NextResponse.json({ products: CATALOG });
  } catch (error) {
    console.error("GET /api/products database query failed, using CATALOG fallback", error);
    return NextResponse.json({ products: CATALOG });
  }
}
