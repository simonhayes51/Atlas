import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// SQLite keeps the whole app a single deploy: on Railway, mount a volume at
// /data and set DATABASE_PATH=/data/formsink.db. Locally it defaults to
// ./data/formsink.db (gitignored). The connection is lazy so `next build`
// never touches the database file.

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

create table if not exists forms (
  id text primary key,
  user_id text not null references users (id) on delete cascade,
  name text not null,
  notify integer not null default 1,
  redirect_url text,
  created_at text not null default (datetime('now'))
);
create index if not exists forms_user_idx on forms (user_id);

create table if not exists submissions (
  id text primary key,
  form_id text not null references forms (id) on delete cascade,
  data text not null,
  created_at text not null default (datetime('now'))
);
create index if not exists submissions_form_created_idx
  on submissions (form_id, created_at desc);
`;

let db: Database.Database | null = null;

function getDb() {
  if (db) return db;
  const file =
    process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "formsink.db");
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
// Forms
// ---------------------------------------------------------------------------

export type Form = {
  id: string;
  user_id: string;
  name: string;
  notify: number;
  redirect_url: string | null;
  created_at: string;
};

export function createForm(userId: string, name: string): Form {
  // Short public id used in the endpoint URL: /f/<id>
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
  getDb()
    .prepare("insert into forms (id, user_id, name) values (?, ?, ?)")
    .run(id, userId, name);
  return getForm(id)!;
}

export function getForm(id: string): Form | undefined {
  return getDb().prepare("select * from forms where id = ?").get(id) as
    | Form
    | undefined;
}

export function getUserForm(userId: string, id: string): Form | undefined {
  return getDb()
    .prepare("select * from forms where id = ? and user_id = ?")
    .get(id, userId) as Form | undefined;
}

export function listFormsWithCounts(
  userId: string
): Array<Form & { submission_count: number }> {
  return getDb()
    .prepare(
      `select f.*, (select count(*) from submissions s where s.form_id = f.id) as submission_count
       from forms f where f.user_id = ? order by f.created_at desc`
    )
    .all(userId) as Array<Form & { submission_count: number }>;
}

export function countForms(userId: string): number {
  const row = getDb()
    .prepare("select count(*) as n from forms where user_id = ?")
    .get(userId) as { n: number };
  return row.n;
}

export function updateForm(
  userId: string,
  id: string,
  fields: { notify: boolean; redirect_url: string | null }
) {
  getDb()
    .prepare(
      "update forms set notify = ?, redirect_url = ? where id = ? and user_id = ?"
    )
    .run(fields.notify ? 1 : 0, fields.redirect_url, id, userId);
}

export function deleteForm(userId: string, id: string) {
  getDb()
    .prepare("delete from forms where id = ? and user_id = ?")
    .run(id, userId);
}

// ---------------------------------------------------------------------------
// Submissions
// ---------------------------------------------------------------------------

export type Submission = {
  id: string;
  form_id: string;
  data: string; // JSON object of field -> value
  created_at: string;
};

export function insertSubmission(formId: string, data: Record<string, string>) {
  getDb()
    .prepare("insert into submissions (id, form_id, data) values (?, ?, ?)")
    .run(crypto.randomUUID(), formId, JSON.stringify(data));
}

export function listSubmissions(formId: string, limit = 100): Submission[] {
  return getDb()
    .prepare(
      "select * from submissions where form_id = ? order by created_at desc limit ?"
    )
    .all(formId, limit) as Submission[];
}

export function listAllSubmissions(formId: string): Submission[] {
  return getDb()
    .prepare(
      "select * from submissions where form_id = ? order by created_at asc"
    )
    .all(formId) as Submission[];
}

export function countSubmissionsThisMonth(userId: string): number {
  const row = getDb()
    .prepare(
      `select count(*) as n from submissions s
       join forms f on f.id = s.form_id
       where f.user_id = ? and s.created_at >= ?`
    )
    .get(userId, monthStartUtc()) as { n: number };
  return row.n;
}
