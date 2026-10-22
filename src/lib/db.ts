import "server-only";

/**
 * Tiny SQL layer. Uses Postgres when DATABASE_URL is set (production), otherwise an embedded
 * PGlite database stored in ./.data/pglite so local development needs no setup.
 * Both speak the same SQL dialect, so queries below work unchanged.
 */
type Row = Record<string, unknown>;
type Query = (text: string, params?: unknown[]) => Promise<Row[]>;

const SCHEMA = `
create table if not exists profiles (
  id text primary key,
  created_at timestamptz not null default now(),
  locale text not null,
  answers jsonb not null,
  profile jsonb not null,
  paid boolean not null default false
);
create table if not exists orders (
  id text primary key,
  profile_id text not null references profiles(id),
  amount integer not null,
  status text not null,
  snap_token text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  raw jsonb
);
create index if not exists orders_profile_idx on orders(profile_id);
create table if not exists settings (
  key text primary key,
  value jsonb not null
);
create table if not exists feedback (
  id serial primary key,
  profile_id text not null references profiles(id),
  perfume_id text not null,
  rating integer not null,
  created_at timestamptz not null default now()
);
`;

/**
 * Pass plain objects for jsonb columns. postgres.js encodes them itself (a pre-stringified
 * string would be stored as a JSON string, double-encoded); PGlite needs the JSON text.
 */
function toPgliteParam(p: unknown) {
  return p !== null && typeof p === "object" && !(p instanceof Date) ? JSON.stringify(p) : p;
}

const g = globalThis as unknown as { __psDb?: Promise<Query> };

async function init(): Promise<Query> {
  let q: Query;
  // Vercel's Neon/Postgres integrations expose DATABASE_URL or POSTGRES_URL.
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url && process.env.VERCEL) {
    throw new Error("DATABASE_URL is not set. Vercel has no persistent disk, so the embedded PGlite fallback cannot be used. Connect a Postgres database (e.g. Neon) in the Vercel dashboard.");
  }
  if (url) {
    const { default: postgres } = await import("postgres");
    // Serverless: keep few connections per instance; prepare:false works with transaction poolers (Neon, Supabase).
    const sql = postgres(url, { max: process.env.VERCEL ? 1 : 5, prepare: false, idle_timeout: 20 });
    q = async (text, params = []) => (await sql.unsafe(text, params as never[])) as unknown as Row[];
    for (const stmt of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) await sql.unsafe(stmt);
  } else {
    const { PGlite } = await import("@electric-sql/pglite");
    const { mkdirSync } = await import("node:fs");
    const dir = process.env.PGLITE_DIR ?? "./.data/pglite";
    mkdirSync(dir, { recursive: true });
    const db = new PGlite(dir);
    await db.exec(SCHEMA);
    q = async (text, params = []) => (await db.query<Row>(text, params.map(toPgliteParam))).rows;
  }
  return q;
}

export function db(): Promise<Query> {
  if (!g.__psDb) g.__psDb = init().catch((e) => { g.__psDb = undefined; throw e; });
  return g.__psDb;
}

export async function query<T = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  const q = await db();
  return (await q(text, params)) as T[];
}
