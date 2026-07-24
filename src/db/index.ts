import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

///////////////////////////////////////////////////////////////////////////
// For neon-http, you can omit the schema and still get good functionality,
// but including it doesn't hurt and provides better DX if you want to use
// it in your IDE. You only need it if you want to use Relational Queries
// (the db.query API).
//
//
// The neon-http driver (and most drivers) can run in two modes:
//
//   1. Query builder only (db.select(), db.insert(), db.update(), etc.) — this works with
//   zero schema knowledge. Drizzle just generates SQL from the table objects you pass in
//   directly (db.select().from(UserTable)). You don't need schema in the drizzle() call
//   for this at all.
//
//   2. Relational Query API (db.query.users.findFirst(...), db.query.users.findMany({ with: { sessions: true } }), etc.)
//   — this is the higher-level, Prisma-like API that lets you fetch nested/related data in one call. This mode
//   requires Drizzle to know your full table map and your relations() definitions up front, because it
//   needs to figure out joins, aliasing, and how to nest the result shape. That's exactly what you're
//   providing when you add schema here.
//
//
// Bonus even if you never use db.query
//
// Passing schema also gives you better autocomplete and type inference in some IDE contexts (relations show up in types,
// db.query is available for you to reach for later without wiring anything up), which is why the drizzle docs note it
// "doesn't hurt" even for neon-http.
//
// Is it necessary for the relational API? Yes, unconditionally. If you ever want db.query.users.findMany({ with: { accounts: true } }),
// the schema (with relations) has to be passed into drizzle(...). There's no alternative wiring — that's the only place it's
// read from for that API.
//
///////////////////////////////////////////////////////////////////////////

export const db = drizzle(process.env.DATABASE_URL!, {
  schema
  // logger: true
})
