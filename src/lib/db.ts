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

const g = globalThis as unknown as { __psDb?: Promise<Query> };

async function init(): Promise<Query> {
  let q: Query;
  if (process.env.DATABASE_URL) {
    const { default: postgres } = await import("postgres");
    const sql = postgres(process.env.DATABASE_URL, { max: 5, prepare: false });
    q = async (text, params = []) => (await sql.unsafe(text, params as never[])) as unknown as Row[];
    for (const stmt of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) await sql.unsafe(stmt);
  } else {
    const { PGlite } = await import("@electric-sql/pglite");
    const { mkdirSync } = await import("node:fs");
    const dir = process.env.PGLITE_DIR ?? "./.data/pglite";
    mkdirSync(dir, { recursive: true });
    const db = new PGlite(dir);
    await db.exec(SCHEMA);
    q = async (text, params = []) => (await db.query<Row>(text, params)).rows;
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
