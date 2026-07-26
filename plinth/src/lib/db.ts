import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// SQLite keeps the whole app a single deploy: on Railway, mount a volume at
// /data and set DATABASE_PATH=/data/plinth.db. The canvas editor renders
// entirely client-side — this database only tracks accounts, subscription
// state, and saved screenshot sets.

const SCHEMA = `
create table if not exists users (
  id text primary key,
  email text not null unique,
  password_hash text not null,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  anthropic_api_key text,
  created_at text not null default (datetime('now'))
);

create table if not exists sets (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  name text not null,
  data text not null,
  thumbnail text,
  updated_at text not null default (datetime('now')),
  created_at text not null default (datetime('now'))
);

create index if not exists sets_user_id_idx on sets(user_id);
`;

let db: Database.Database | null = null;

function getDb() {
  if (db) return db;
  const file =
    process.env.DATABASE_PATH || path.join(process.cwd(), "data", "plinth.db");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA);
  return db;
}

export type User = {
  id: string;
  email: string;
  password_hash: string;
  plan: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  anthropic_api_key: string | null;
  created_at: string;
};

export type SetRow = {
  id: string;
  user_id: string;
  name: string;
  data: string;
  thumbnail: string | null;
  updated_at: string;
  created_at: string;
};

export function createUser(email: string, passwordHash: string): User {
  const id = crypto.randomUUID();
  getDb()
    .prepare("insert into users (id, email, password_hash) values (?, ?, ?)")
    .run(id, email, passwordHash);
  return getUserById(id)!;
}

export function getUserByEmail(email: string): User | undefined {
  return getDb()
    .prepare("select * from users where email = ?")
    .get(email) as User | undefined;
}

export function getUserById(id: string): User | undefined {
  return getDb().prepare("select * from users where id = ?").get(id) as
    | User
    | undefined;
}

export function activateSubscription(
  userId: string,
  customerId: string,
  subscriptionId: string
) {
  getDb()
    .prepare(
      "update users set plan = 'pro', stripe_customer_id = ?, stripe_subscription_id = ? where id = ?"
    )
    .run(customerId, subscriptionId, userId);
}

export function setPlanByCustomerId(customerId: string, plan: "free" | "pro") {
  getDb()
    .prepare("update users set plan = ? where stripe_customer_id = ?")
    .run(plan, customerId);
}

export function clearSubscriptionByCustomerId(customerId: string) {
  getDb()
    .prepare(
      "update users set plan = 'free', stripe_subscription_id = null where stripe_customer_id = ?"
    )
    .run(customerId);
}

// --- Saved screenshot sets ---

export function listSets(userId: string): SetRow[] {
  return getDb()
    .prepare("select * from sets where user_id = ? order by updated_at desc")
    .all(userId) as SetRow[];
}

export function getSet(userId: string, id: string): SetRow | undefined {
  return getDb()
    .prepare("select * from sets where user_id = ? and id = ?")
    .get(userId, id) as SetRow | undefined;
}

export function createSet(
  userId: string,
  name: string,
  data: string,
  thumbnail: string | null
): SetRow {
  const id = crypto.randomUUID();
  getDb()
    .prepare(
      "insert into sets (id, user_id, name, data, thumbnail) values (?, ?, ?, ?, ?)"
    )
    .run(id, userId, name, data, thumbnail);
  return getSet(userId, id)!;
}

export function updateSet(
  userId: string,
  id: string,
  fields: { name?: string; data?: string; thumbnail?: string | null }
): SetRow | undefined {
  const existing = getSet(userId, id);
  if (!existing) return undefined;
  const name = fields.name ?? existing.name;
  const data = fields.data ?? existing.data;
  const thumbnail = fields.thumbnail !== undefined ? fields.thumbnail : existing.thumbnail;
  getDb()
    .prepare(
      "update sets set name = ?, data = ?, thumbnail = ?, updated_at = datetime('now') where user_id = ? and id = ?"
    )
    .run(name, data, thumbnail, userId, id);
  return getSet(userId, id);
}

export function deleteSet(userId: string, id: string) {
  getDb().prepare("delete from sets where user_id = ? and id = ?").run(userId, id);
}

export function countSets(userId: string): number {
  const row = getDb()
    .prepare("select count(*) as c from sets where user_id = ?")
    .get(userId) as { c: number };
  return row.c;
}

export function setAnthropicKey(userId: string, key: string | null) {
  getDb()
    .prepare("update users set anthropic_api_key = ? where id = ?")
    .run(key, userId);
}
