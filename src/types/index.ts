import type { SUPPORTED_OAUTH_PROVIDERS } from '@/lib/constants'
import type { auth } from '@/lib/auth'
import type { UserTable } from '@/db/schema'
import type { UseQueryResult } from '@tanstack/react-query'
import type { FileRouteTypes } from '@/routeTree.gen'
import type { CustomError, codes } from '@/utils'

/* ========================================================================

======================================================================== */

export type FileRoute = FileRouteTypes['to']

export { CustomError }

export type Code = (typeof codes)[keyof typeof codes]

export type ResBody<DataType> = {
  code: Code
  data: DataType
  errors?: Record<string, string> | null
  message: string
  success: boolean
  // Adding this makes the type more flexible, while still being informative. That
  // said, if you need additional properties, it's MUCH safer to write a custom type.
  // [key: string]: any
}

export type ResponsePromise<T = unknown> = Promise<ResBody<T>>

///////////////////////////////////////////////////////////////////////////
//
// While this type could be useful if you're passing around a refetch function from
// parent to child, what you probably want to do is use queryClient.refetchQueries.
// This is more idiomatic
//
//   const refetchTodos = () => {
//     return queryClient.refetchQueries({ queryKey: ['todos'] })
//   }
//
///////////////////////////////////////////////////////////////////////////

/** A helper to type a useQuery refetch function.
 * The first generic is the data type.
 * The second generic is the error type.
 */
export type QueryRefetchFn<
  TData = unknown,
  TError = CustomError
> = UseQueryResult<TData, TError>['refetch']

export type Todo = {
  id: string
  name: string
}

/* ======================

====================== */
///////////////////////////////////////////////////////////////////////////
//
// better-auth exports their own User and Session types, but
// they're the default versions (i.e., not inferred):
//
//  import { User, Session } from 'better-auth'
//
// Coding in Flow tutorial does something similar at 38:40.
//
///////////////////////////////////////////////////////////////////////////

export type InferredSession = typeof auth.$Infer.Session
export type Session = InferredSession['session']

///////////////////////////////////////////////////////////////////////////
//
// Note: One could also infer the User type directly from the Drizzle schema.
//
//   export type User = typeof UserTable.$inferSelect
//
// However, they are largely the same with one exception.
// The Drizzle version knows the exact types of the UserRoleEnum,
// While InferredSession['user'] only types it as string.
// Currently, that seems okay, and since 99% of the time we'll be
// betting user off of the session it makes more sense to use this version.
//
///////////////////////////////////////////////////////////////////////////

export type User = InferredSession['user']

// Currently, there's no need to do this because in Better Auth the password
// is not stored on the user record. However, this may still be useful in the
// future if other sensitive fields are added to the UserTable.
// export type SafeUser = Omit<User, 'password'>

export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number]

// UserTable.$inferInsert gets you pretty close,
// but we actually want to nail it down further.
export type CreateUserData = Omit<
  typeof UserTable.$inferInsert,
  'id' | 'createdAt' | 'updatedAt' | 'role'
>
