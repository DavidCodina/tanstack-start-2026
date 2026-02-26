import { createServerFn } from '@tanstack/react-start'
import {
  // asc,
  desc,
  eq
  // ilike
  // sql // Run raw SQL inside of Drizzle.
} from 'drizzle-orm'

import { db } from '@/db'
import { UserPreferencesTable, UserTable, safeUserFields } from '@/db/schema'
import { codes } from '@/utils'

/* ========================================================================
     
======================================================================== */

export const getUsers = createServerFn({
  method: 'GET'
}).handler(async (_ctx) => {
  try {
    ///////////////////////////////////////////////////////////////////////////
    //
    // One can also use the relational query API.
    //
    // const safeUsers = await db.query.UserTable.findMany({
    //   columns: { password: false },
    //   // There is also a non-function syntax.
    //   // where: (users, funcs) => {
    //   //   const { ilike } = funcs
    //   //   return ilike(users.email, 'david%')
    //   // },
    //   with: {
    //     // preferences: true
    //     preferences: {
    //       columns: {
    //         emailUpdates: true
    //       }
    //     }
    //   },
    //   // There is also a non-function syntax.
    //   orderBy: (users, funcs) => {
    //     const { desc } = funcs
    //     return desc(users.createdAt)
    //   }
    //   // limit: 1,
    //   // offset: 0,
    //   // extras: {
    //   //   // ⚠️ Gotcha! If you write this wrong it sometimes fails silently,
    //   //   // and gives you back null users. See WDS at 38:00 for a demo:
    //   //   // https://www.youtube.com/watch?v=7-NZ0MlPpJA&t=57s
    //   //   lowerCaseUserName: sql<string>`lower(${UserTable.username})`.as(
    //   //     'lowerCaseUserName'
    //   //   )
    //   // }
    // })
    //
    // However, this requires that you define relations in the UserTable.ts schema.
    //
    //   export const UserTableRelations = relations(UserTable, ({ one }) => ({
    //     preferences: one(UserPreferencesTable, {
    //       fields: [UserTable.id],
    //       references: [UserPreferencesTable.userId]
    //     })
    //   }))
    //
    // However, the relations API is set to change in the near future, so it may
    // be better to use the more explicit approach.
    //
    ///////////////////////////////////////////////////////////////////////////

    // const safeUsers = await db.select(safeUserFields).from(UserTable)

    const safeUsers = await db
      .select({
        ...safeUserFields,
        preferences: UserPreferencesTable
      })
      .from(UserTable) // Explore other methods after this
      .leftJoin(
        UserPreferencesTable,
        eq(UserTable.id, UserPreferencesTable.userId)
      )
      // .where(ilike(UserTable.email, 'david%'))
      .orderBy(desc(UserTable.createdAt))

    return {
      code: codes.OK,
      data: safeUsers,
      message: 'success',
      success: true
    }
  } catch (_err) {
    return {
      code: codes.INTERNAL_SERVER_ERROR,
      data: null,
      message: 'fail',
      success: false
    }
  }
})
