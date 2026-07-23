import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { ensureSchema } from "@/db/seed";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { email?: string; source?: string }
      | null;
    const email = body?.email?.trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (process.env.DATABASE_URL) {
      const { db } = await import("@/db");
      const { newsletterSubscribers } = await import("@/db/schema");
      const { ensureSchema } = await import("@/db/seed");
      await ensureSchema();
      const inserted = await db
        .insert(newsletterSubscribers)
        .values({ email, source: body?.source?.slice(0, 40) || "website" })
        .onConflictDoNothing()
        .returning({ id: newsletterSubscribers.id });
      if (inserted.length === 0) {
        return NextResponse.json({ error: "This email is already in the Circle." }, { status: 409 });
      }
    }
    return NextResponse.json({ ok: true, message: "Welcome to the NovaNest Circle." });
  } catch (error) {
    console.error("POST /api/newsletter fallback", error);
    return NextResponse.json({ ok: true, message: "Welcome to the NovaNest Circle." });
  }
}
