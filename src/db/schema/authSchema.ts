import { relations /* , sql */ } from 'drizzle-orm'
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp
  // uniqueIndex
} from 'drizzle-orm/pg-core'

/* ========================================================================

======================================================================== */

export const UserRoleEnum = pgEnum('userRole', ['USER', 'ADMIN'])

export const UserTable = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ///////////////////////////////////////////////////////////////////////////
  //
  // BetterAuth normalizes the email to lowercase before checking/inserting and treats david@example.com and DAVID@example.com
  // as the same account. Because the email is already present (after normalization) the library intentionally does not create
  // a second record — the endpoint returns a success-like response to avoid leaking whether an account already exists.
  // That said, the application code in the register.ts server function does this:
  //
  //   const [existingUser] = await db
  //     .select(safeUserFields)
  //     .from(UserTable)
  //     .where(eq(sql`lower(${UserTable.email})`, email.toLowerCase()))
  //     .limit(1)
  //   if (existingUser) { formErrors.email = 'Invalid email.' }
  //
  // The formErrors.email is opaque enough to not count as explicitly exposing that a user with
  // that email already exists and yet still allows us to provide an error message to the user.
  // That said, it still somewhat implies that the email is already taken.
  //
  // In any case, the larger point here is that emails that only different in case are ultimately
  // normalized to lowercase (by Better Auth) before they reach the database.
  //
  ///////////////////////////////////////////////////////////////////////////
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  ///////////////////////////////////////////////////////////////////////////
  //
  // Additional Fields:
  //
  //   - WDS at 1:49:45
  //   - Coding in Flow at 38:00
  //
  // Added role property. However, I think BETTER-AUTH will still be
  // unaware of it. To inform BETTER-AUTH, do this in lib/auth.ts:
  //
  //   user: {
  //     additionalFields: {
  //       role: { type: 'string', input: false }
  //     }
  //   }
  //
  ///////////////////////////////////////////////////////////////////////////
  role: UserRoleEnum('role').default('USER').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
})

// Use this within a db.select to specify safe user fields.
export const safeUserFields = {
  id: UserTable.id,
  name: UserTable.name,
  email: UserTable.email,
  image: UserTable.image,
  role: UserTable.role,
  createdAt: UserTable.createdAt,
  updatedAt: UserTable.updatedAt
}

// Use this within a db.query to specify safe user columns.
export const safeUserColumns = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  createdAt: true,
  updatedAt: true
}

/* ========================================================================

======================================================================== */

export const SessionTable = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => UserTable.id, { onDelete: 'cascade' })
  },
  (table) => [index('session_userId_idx').on(table.userId)]
)

/* ========================================================================

======================================================================== */

export const AccountTable = pgTable(
  'accounts',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => UserTable.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  (table) => [index('account_userId_idx').on(table.userId)]
)

/* ========================================================================

======================================================================== */

export const VerificationTable = pgTable(
  'verifications',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
)

/* ========================================================================

======================================================================== */

export const UserTableRelations = relations(UserTable, ({ many }) => ({
  sessions: many(SessionTable),
  accounts: many(AccountTable)
}))

export const SessionTableRelations = relations(SessionTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [SessionTable.userId],
    references: [UserTable.id]
  })
}))

export const AccountTableRelations = relations(AccountTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [AccountTable.userId],
    references: [UserTable.id]
  })
}))
