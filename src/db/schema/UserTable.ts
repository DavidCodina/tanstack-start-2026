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
///////////////////////////////////////////////////////////////////////////

export const UserPreferencesTable = pgTable('userPreferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  emailUpdates: boolean('emailUpdates').default(false).notNull(),
  // Doing this sets up a foreign key constraint on the userId field.
  userId: uuid('userId')
    .references(() => UserTable.id, {
      onDelete: 'cascade'
    })
    .notNull()
    .unique() // This ensures each user can have only one preferences record
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
//
///////////////////////////////////////////////////////////////////////////

export const PostTagTable = pgTable('postTags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique()
})

// Link the posts and postTags together.
export const PostTagAssignmentTable = pgTable('postTagAssignments', {
  postId: uuid('postId')
    // When a post is deleted → all PostTagAssignmentTable records with that postId get deleted.
    .references(() => PostTable.id, { onDelete: 'cascade' })
    .notNull(),
  postTagId: uuid('postTagId')
    // When a postTag is deleted → all PostTagAssignmentTable records with that postTagId get deleted
    .references(() => PostTagTable.id, { onDelete: 'cascade' })
    .notNull()
})

///////////////////////////////////////////////////////////////////////////
//
// In modern Drizzle ORM (v0.30+), composite primary keys should be defined
// as separate exports after the table definition using the primaryKey() function.
// In the PostTagAssignmentTable example, the table will only have the two columns:
// postId and postTagId. The primaryKey() export creates a database constraint that ensures:
//
//   - The combination of postId and postTagId values must be unique across all rows
//   - This combination can be used as the primary key to identify each record
//   - Neither column can contain NULL values (though they're already marked as .notNull())
//
// The primary key is a logical constraint on the existing columns, not a physical column
// that gets stored in each record. When you query the table, you'll only see the postId
// and postTagId columns in the results.
//
///////////////////////////////////////////////////////////////////////////
export const PostTagAssignmentTablePrimaryKey = primaryKey({
  columns: [PostTagAssignmentTable.postId, PostTagAssignmentTable.postTagId]
})

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
    preferences: one(UserPreferencesTable, {
      fields: [UserTable.id],
      references: [UserPreferencesTable.userId]
    }),
    posts: many(PostTable)
  }
})

export const UserPreferencesTableRelations = relations(
  UserPreferencesTable,
  (helpers) => {
    const { one } = helpers
    return {
      user: one(UserTable, {
        fields: [UserPreferencesTable.userId],
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

export const safeUserFields = {
  id: UserTable.id,
  email: UserTable.email,
  username: UserTable.username,
  age: UserTable.age,
  role: UserTable.role,
  createdAt: UserTable.createdAt,
  updatedAt: UserTable.updatedAt
}
