import type { SUPPORTED_OAUTH_PROVIDERS } from '@/lib/constants'
import type { auth } from '@/lib/auth'
import type { UserTable } from '@/db/schema'
import type { UseQueryResult } from '@tanstack/react-query'
import type { FileRouteTypes } from '@/routeTree.gen'
import type { CustomError, codes } from '@/utils'

import type { APIError } from 'better-auth/api'

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

///////////////////////////////////////////////////////////////////////////
//
// GiraffeReactor does this at 1:53:30:
// https://www.youtube.com/watch?v=N4meIif7Jtc
//
// BetterAuthErrorCode is an example of the error found on the error.body?.code property of
// instances of APIError. However, even though there are known auth.$ERROR_CODES, the actual
// type of error.body?.code on the APIError is: string | undefined;
// Presumably, this was loosely typed to allow for developers to add their own error codes
// - like our custom "EMAIL_BLACKLISTED" code.
//
// "ACCOUNT_NOT_FOUND", "ASYNC_VALIDATION_NOT_SUPPORTED", "BODY_MUST_BE_AN_OBJECT",
// "CALLBACK_URL_REQUIRED", "CHANGE_EMAIL_DISABLED", "CREDENTIAL_ACCOUNT_NOT_FOUND",
// "CROSS_SITE_NAVIGATION_LOGIN_BLOCKED", "EMAIL_ALREADY_VERIFIED", "EMAIL_CAN_NOT_BE_UPDATED",
// "EMAIL_MISMATCH", "EMAIL_NOT_VERIFIED", "FAILED_TO_CREATE_SESSION", "FAILED_TO_CREATE_USER",
// "FAILED_TO_CREATE_VERIFICATION", "FAILED_TO_GET_SESSION", "FAILED_TO_GET_USER_INFO",
// "FAILED_TO_UNLINK_LAST_ACCOUNT", "FAILED_TO_UPDATE_USER", ...
//
///////////////////////////////////////////////////////////////////////////

export type BetterAuthErrorCode =
  | keyof typeof auth.$ERROR_CODES
  | 'EMAIL_BLACKLISTED'
  | 'PASSWORD_INVALID'
  | 'LOGIN_FAILED'
  | 'REGISTRATION_FAILED'

///////////////////////////////////////////////////////////////////////////
//
// BetterAuthStatusCode is an example of the error code that can be passed into APIError constructor:
//
//   throw new APIError('USER_ALREADY_EXISTS', {
//     code: 'EMAIL_BLACKLISTED',
//     message: 'This email is blacklisted.'
//   })
//
// It also shows up as the error.status on instances of APIError:
//
//   if (error instanceof APIError) {
//     if (error.status === 'ACCEPTED') {
//     }
//   }
//
// "ACCEPTED", "BAD_GATEWAY", "BAD_REQUEST", "CONFLICT", "CREATED", "EXPECTATION_FAILED", "FAILED_DEPENDENCY",
// "FORBIDDEN", "FOUND", "GATEWAY_TIMEOUT", "GONE", "HTTP_VERSION_NOT_SUPPORTED", "I'M_A_TEAPOT", "INSUFFICIENT_STORAGE",
// "INTERNAL_SERVER_ERROR", "LENGTH_REQUIRED", "LOCKED", "LOOP_DETECTED", "METHOD_NOT_ALLOWED", "MISDIRECTED_REQUEST",
// "MOVED_PERMANENTLY", "MULTIPLE_CHOICES", "NETWORK_AUTHENTICATION_REQUIRED", "NOT_ACCEPTABLE", "NOT_EXTENDED",
// "NOT_FOUND", "NOT_IMPLEMENTED", "NOT_MODIFIED", "NO_CONTENT", "OK", "PAYLOAD_TOO_LARGE", "PAYMENT_REQUIRED",
// "PRECONDITION_FAILED", "PRECONDITION_REQUIRED", "PROXY_AUTHENTICATION_REQUIRED", "RANGE_NOT_SATISFIABLE",
// "REQUEST_HEADER_FIELDS_TOO_LARGE", "REQUEST_TIMEOUT", "SEE_OTHER", "SERVICE_UNAVAILABLE", "TEMPORARY_REDIRECT",
// "TOO_EARLY", "TOO_MANY_REQUESTS", "UNAUTHORIZED", "UNAVAILABLE_FOR_LEGAL_REASONS", "UNPROCESSABLE_ENTITY",
// "UNSUPPORTED_MEDIA_TYPE", "UPGRADE_REQUIRED", "URI_TOO_LONG", "VARIANT_ALSO_NEGOTIATES"
//
///////////////////////////////////////////////////////////////////////////

export type BetterAuthStatusCode = ConstructorParameters<typeof APIError>[0]
