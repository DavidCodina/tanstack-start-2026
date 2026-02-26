// This is an example of a type that can be used as a client/server contract for API calls.

import type { UserTable } from '@/db/schema'
import type { UseQueryResult } from '@tanstack/react-query'
import type { FileRouteTypes } from '@/routeTree.gen'
import type { CustomError, codes } from '@/utils'

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

export type User = typeof UserTable.$inferSelect

export type SafeUser = Omit<User, 'password'>

// UserTable.$inferInsert gets you pretty close,
// but we actually want to nail it down further.
export type CreateUserData = Omit<
  typeof UserTable.$inferInsert,
  'id' | 'createdAt' | 'updatedAt' | 'role'
>
