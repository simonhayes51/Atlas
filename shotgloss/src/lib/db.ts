import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// SQLite keeps the whole app a single deploy: on Railway, mount a volume at
// /data and set DATABASE_PATH=/data/shotgloss.db. The editor is fully
// client-side — this database only tracks accounts and subscription state.
// The connection is lazy so `next build` never touches the database file.

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
`;

let db: Database.Database | null = null;

function getDb() {
  if (db) return db;
  const file =
    process.env.DATABASE_PATH ??
    path.join(process.cwd(), "data", "shotgloss.db");
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
