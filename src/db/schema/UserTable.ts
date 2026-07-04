//# Add a comments table. See the Neon/Drizzle tutorial here:
//# https://www.youtube.com/watch?v=hIYNOiZXQ7Y

import {
  boolean,
  // index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  // serial
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

export const UserRoleEnum = pgEnum('userRole', ['USER', 'ADMIN'])

export const UserTable = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // email: text('email').notNull().unique(),
    // The email field already has .unique() which creates an index automatically.
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: text('username').notNull().unique(),
    // .$default(() => 0), // .$type<12 | 24>(), // .notNull(),
    age: integer('age'),
    role: UserRoleEnum('role').default('USER').notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow()
  }
  // Callback syntax is deprecated.
  // (_table) => { return {} }
)

// In Drizzle ORM v0.29+, indexes should be defined as separate exports after the table
// definition rather than in a callback function. The .unique() constraint already creates
// an index on the email field, so the additional named index is optional but shown here
// for completeness.

// Since email already has .unique(), this index is redundant but kept for example
// export const emailIndex = index('emailIndex').on(UserTable.email)

/* ========================================================================
     
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This is an example of a one-to-one relationship between the UserTable and
// UserPreferencesTable. Here's what's happening:
//
//   1. UserTable: Contains user information with an id as primary key.
//   2. UserPreferencesTable: Contains user preferences with a userId
//      field that references the UserTable.id.
//
// This creates a 1:1 relationship where:
//   - Each user preferences record belongs to exactly one user
//   - Each user can have associated preferences.
//
// Note: Creating a UserPreferencesTable is the more idiomatic PostgreSQL approach,
// and it's what you'll see in most production-grade relational systems.
// Coming from MongoDB, I'm tempted to simply have a preferences field direclty
// in the UserTable (JSON/JSONB).
//
/////////////////////////
//
// Why Not JSONB?
//
// JSONB is real and useful in PostgreSQL, but it's
// best reserved for truly dynamic, schema-less data — things where you genuinely
// don't know the shape of the data ahead of time (e.g., user-defined custom fields,
// third-party webhook payloads, metadata that varies per record type).
//
// Using JSONB for preferences is essentially re-importing MongoDB habits into PostgreSQL,
// and you lose most of what makes Postgres valuable:
//
//   - No column-level constraints — you can't enforce NOT NULL, type safety, or defaults on individual fields inside a JSON blob at the DB level
//   - No easy indexing — you can index JSONB fields, but it's more complex and less efficient than indexing a proper column
//   - No schema enforcement — a typo like "emailUdpates": true silently succeeds
//   - Harder to query and migrate — preferences->>'emailUpdates' vs. email_updates is noisier, and evolving the shape requires raw SQL gymnastics
//
/////////////////////////
//
// Why A Separate Table Is Correct:
//
// The UserPreferencesTable approach is right for several reasons:
//
//   1. It normalizes the schema properly. Preferences are a distinct entity with their own lifecycle.
//      A user exists whether or not they've set preferences — that 0-or-1 relationship you noted in your
//      comments is actually correct modeling.
//
//   2. It keeps your UserTable clean and focused. As preference fields grow (theme, language, notification types,
//      privacy settings...), you don't bloat the core user row.
//
//   3. Each field is a real, typed, constrained column. Your emailUpdates boolean NOT NULL DEFAULT false is enforced
//      at the database level — no application code needed to police it.
//
//   4. It's independently queryable and indexable. If you ever need to find all users with email updates enabled,
//      that's a trivial indexed query.
//
///////////////////////////////////////////////////////////////////////////

export const UserPreferencesTable = pgTable('userPreferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  emailUpdates: boolean('emailUpdates').default(false).notNull(),
  // Doing this sets up a foreign key constraint on the userId field.
  userId: uuid('userId')
    .references(() => UserTable.id, {
      onDelete: 'cascade'
    }) // foreign key, so userId must point to a real user
    .notNull()
    ///////////////////////////////////////////////////////////////////////////
    //
    // .unique prevents a second preferences row for the same user.
    // This ensures each user can have only one preferences record.
    // It adds a UNIQUE constraint on the userId column in userPreferences.
    //
    // This means the database will reject any attempt to insert a second preferences row for the same user.
    // However, there's currently no constraint forcing a user to have a preferences record at all.
    // So it's technically a 0-or-1 : 1 relationship.
    //
    // The .unique() on userId is the correct and sufficient mechanism at the database level to
    // prevent duplicate preferences per user. The comment is accurate. You just also need the
    // relations() definitions if you want Drizzle's query API (db.query) to traverse that relationship.
    //
    ///////////////////////////////////////////////////////////////////////////
    .unique()
})

/* ========================================================================
     
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This is an example of a one-to-many relationship.
//
///////////////////////////////////////////////////////////////////////////

export const PostTable = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  // title: text('title').notNull(),
  title: varchar('title', { length: 255 }).notNull(), // .unique(),
  averageRating: real('averageRating').default(0).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  authorId: uuid('authorId')
    .references(() => UserTable.id, { onDelete: 'cascade' })
    .notNull()
})

/* ========================================================================
     
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This is an example of a many-to-many relationship. Each post can have
// many tags, and each tag can belong to many posts.
// In the WDS tutorial, he calls the the CategoryTable at 26:30:
// https://www.youtube.com/watch?v=7-NZ0MlPpJA
//
///////////////////////////////////////////////////////////////////////////

export const PostTagTable = pgTable('postTags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique()
})

// Also in WDS tutorial at 26:30, we create a join table.
// This table hooks together posts and tags.
// In other words, given some post, let's say we want to assign it to a tag/cateogry.
// I believe we would send a query to the database witht the postId and postTagId.
// We still need to build out the feature in the UI.
export const PostTagAssignmentTable = pgTable(
  'postTagAssignments',
  {
    postId: uuid('postId')
      // When a post is deleted → all PostTagAssignmentTable records with that postId get deleted.
      .references(() => PostTable.id, { onDelete: 'cascade' })
      .notNull(),
    postTagId: uuid('postTagId')
      // When a postTag is deleted → all PostTagAssignmentTable records with that postTagId get deleted
      .references(() => PostTagTable.id, { onDelete: 'cascade' })
      .notNull()
  },
  (table) => [
    // primaryKey({ columns: [table.postId, table.postTagId] })
    // Or PK with custom name - naming the primary key doesn't create a queryable column.
    // The name option only controls what the constraint itself is called at the database level
    // — it's cosmetic/organizational, purely for the SQL DDL
    //
    // The primary key is a logical constraint on the existing columns, not a physical column
    // that gets stored in each record. When you query the table, you'll only see the postId
    // and postTagId columns in the results.
    primaryKey({ name: 'id', columns: [table.postId, table.postTagId] })
  ]
)

/* ========================================================================
                              Relations
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The "userPreferences" column you see in Drizzle Studio is showing the table
// relationship, but it doesn't automatically include the related data in your queries.
//
// One approach to including userPreferences is to do this in getUsers.ts:
//
//   const safeUsers = await db.query.UserTable.findMany({
//     columns: { password: false },
//     with: { preferences: true }
//   })
//
// However, this requires that you define relations here. That said, I think
// the relations API is set to change in the near future, so I'm sticking with
// the more explicit approach.
//
//   const safeUsers = await db
//     .select({ ...safeUserFields, preferences: UserPreferencesTable })
//     .from(UserTable)
//     .leftJoin(UserPreferencesTable, eq(UserTable.id, UserPreferencesTable.userId))
//
///////////////////////////////////////////////////////////////////////////

//# See WDS at 41:00 : https://www.youtube.com/watch?v=7-NZ0MlPpJA&t=57s
//# Review all relationships and what they imply with AI.
//# Have AI generate descriptions of each relationship.

//# Break these out into separate files after doing an AI review.

export const UserTableRelations = relations(UserTable, (helpers) => {
  const { one, many } = helpers
  return {
    // A user may have one preferences record.
    preferences: one(UserPreferencesTable, {
      // The `fields` property defines the column on THIS table (UserTable) that
      // is used to match the column on the OTHER table (UserPreferencesTable).
      fields: [UserTable.id],
      // The `references` property defines the column on the OTHER table (UserPreferencesTable)
      // that is used to match the column on THIS table.
      // UserPreferencesTable.userId is the FK that points back to UserTable.id.
      // Even though the FK lives over there, we still call it "references" here.
      references: [UserPreferencesTable.userId]
    }),
    posts: many(PostTable)
  }
})

export const UserPreferencesTableRelations = relations(
  UserPreferencesTable,
  (helpers) => {
    // A preferences record may belong to one user
    const { one } = helpers
    return {
      user: one(UserTable, {
        // The `fields` property defines the column on THIS table (UserPreferencesTable) that
        // is used to match the column on the OTHER table (UserTable).
        fields: [UserPreferencesTable.userId],
        // The `references` property defines the column on the OTHER table (UserTable)
        // that is used to match the column on THIS table.
        // UserTable.id is the PK that UserPreferencesTable.userId points back to.
        // Even though the PK lives over there, we still call it "references" here.
        references: [UserTable.id]
      })
    }
  }
)

export const PostTableRelations = relations(PostTable, (helpers) => {
  const { one, many } = helpers

  return {
    author: one(UserTable, {
      fields: [PostTable.authorId],
      references: [UserTable.id]
    }),
    postTagAssignments: many(PostTagAssignmentTable)
  }
})

export const PostTagTableRelations = relations(PostTagTable, (helpers) => {
  const { many } = helpers
  return {
    postTagAssignments: many(PostTagAssignmentTable)
  }
})

export const PostTagAssignmentTableRelations = relations(
  PostTagAssignmentTable,
  (helpers) => {
    const { one } = helpers
    return {
      post: one(PostTable, {
        fields: [PostTagAssignmentTable.postId],
        references: [PostTable.id]
      }),
      postTag: one(PostTagTable, {
        fields: [PostTagAssignmentTable.postTagId],
        references: [PostTagTable.id]
      })
    }
  }
)

/* ========================================================================

======================================================================== */
// Note: In practice we could change the key names to get back modified key names.
// const safeUserFields = { userId: UserTable.id, userEmail: UserTable.email, ... }

// Use this within a db.select to specify safe user fields.
export const safeUserFields = {
  id: UserTable.id,
  email: UserTable.email,
  username: UserTable.username,
  age: UserTable.age,
  role: UserTable.role,
  createdAt: UserTable.createdAt,
  updatedAt: UserTable.updatedAt
}

// Use this within a db.query to specify safe user columns.
export const safeUserColumns = {
  id: true,
  email: true,
  username: true,
  age: true,
  role: true,
  createdAt: true,
  updatedAt: true
}
