import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// SQLite keeps the whole app a single deploy: on Railway, mount a volume at
// /data and set DATABASE_PATH=/data/replycraft.db. The connection is lazy
// so `next build` never touches the database file.

const SCHEMA = `
create table if not exists users (
  id text primary key,
  email text not null unique,
  password_hash text not null,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at text not null default (datetime('now'))
);

create table if not exists generations (
  id text primary key,
  user_id text not null references users (id) on delete cascade,
  review text not null,
  reply text not null,
  tone text not null,
  business_name text not null,
  created_at text not null default (datetime('now'))
);
create index if not exists generations_user_created_idx
  on generations (user_id, created_at desc);
`;

let db: Database.Database | null = null;

function getDb() {
  if (db) return db;
  const file =
    process.env.DATABASE_PATH ??
    path.join(process.cwd(), "data", "replycraft.db");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  return db;
}

// created_at columns store UTC "YYYY-MM-DD HH:MM:SS" (SQLite datetime('now')).
function monthStartUtc() {
  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${now.getUTCFullYear()}-${month}-01 00:00:00`;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export type User = {
  id: string;
  email: string;
  password_hash: string;
  plan: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
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

// ---------------------------------------------------------------------------
// Generations
// ---------------------------------------------------------------------------

export type Generation = {
  id: string;
  user_id: string;
  review: string;
  reply: string;
  tone: string;
  business_name: string;
  created_at: string;
};

export function insertGeneration(gen: {
  userId: string;
  review: string;
  reply: string;
  tone: string;
  businessName: string;
}) {
  getDb()
    .prepare(
      `insert into generations (id, user_id, review, reply, tone, business_name)
       values (?, ?, ?, ?, ?, ?)`
    )
    .run(
      crypto.randomUUID(),
      gen.userId,
      gen.review,
      gen.reply,
      gen.tone,
      gen.businessName
    );
}

export function listRecentGenerations(userId: string, limit = 20): Generation[] {
  return getDb()
    .prepare(
      "select * from generations where user_id = ? order by created_at desc limit ?"
    )
    .all(userId, limit) as Generation[];
}

export function countGenerationsThisMonth(userId: string): number {
  const row = getDb()
    .prepare(
      "select count(*) as n from generations where user_id = ? and created_at >= ?"
    )
    .get(userId, monthStartUtc()) as { n: number };
  return row.n;
}
