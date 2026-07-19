import { createServerFn } from '@tanstack/react-start'

import { APIError } from 'better-auth/api'
// import { sleep } from 'utils/sleep'
import type {
  Code
  // ResponsePromise
} from '@/types'
// import { codes } from '@/utils'

// import { isRedirectError } from 'next/dist/client/components/redirect-error'
// import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

//# import { generateVerificationToken } from 'lib/tokens'
//# import { sendVerificationEmail } from 'lib/mail'

import { auth } from '@/lib/auth'

type RequestData = {
  email: string
  password: string
}

// type Data = any //# Fix this...
// export type LoginResponsePromise = ResponsePromise<Data>
// export type Login = (requestData: RequestData) => LoginResponsePromise
// export type LoginResolvedResponse = Awaited<LoginResponsePromise>

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha:
//
// For Next.js apps, using server-side auth.api.signIn() / auth.api.signOut()
// in server actions for user-initiated login/logout is an anti-pattern. Even
// with the nextCookies() plugin in auth.ts, you will run into client-side state
// sync issues. The UI will not update on the client without a manual refresh.
//
// Better Auth provides client methods specifically designed for React/Next.js that
// handle everything automatically. For actual login/logout triggered by users,
// ALWAYS use the client-side methods. When ARE Server-Side Auth APIs Useful?
//
// In Next.js:
//
//   - auth.api.getSession() - Check auth in Server Components, API routes, middleware, server actions
//   - auth.api.signIn() / signOut() - Pretty much never in typical Next.js apps
//
// In non-React backends (Express, Fastify, etc.):
//
//   - auth.api.signIn() / signOut() - Absolutely, because there's no client-side session management
//
/////////////////////////
//
// Note: It may actually be possible to still use server-side auth.api.signInEmail(), though it's
// basically fighting the framework. Maximilian Schwarzmüller discusses how he had to manually,
// set the cookie here at 3:45: https://www.youtube.com/watch?v=f13cO4CxlUQ
// However, he reached out to Better Auth, and even they told him to prefer using the client-side approach.
//
// Note: I don't think setting this in auth.s fixes the issue:
//
//   plugins: [tanstackStartCookies()],
//
// We can test it out, but I suspect that the client/server sync issue will still exist.
// In other words, I believe that even if you login using this server function, the session
// data from authClient.useSession() will likely not exist.
//
///////////////////////////////////////////////////////////////////////////

export const login = createServerFn({
  method: 'POST'
})
  .validator((input: RequestData) => input)

  .handler(async (ctx) => {
    // await sleep(1000)
    const { data } = ctx
    const { email, password } = data

    /* ======================
        Validation
  ====================== */

    if (
      !email ||
      typeof email !== 'string' ||
      !password ||
      typeof password !== 'string'
    ) {
      return {
        code: 'BAD_REQUEST',
        data: null,
        message: 'Email and/or password is missing. (Server)',
        success: false
      }
    }

    try {
      ///////////////////////////////////////////////////////////////////////////
      //
      //
      // The result will be an object that looks like this:
      //
      //   {
      //     redirect: false,
      //     token: '3OWZv...',
      //     user: {
      //       createdAt: 'Thu Dec 18 2025 16:31:53 GMT-0700 (Mountain Standard Time)',
      //       email: 'david@example.com',
      //       emailVerified: false,
      //       id: 'abc123',
      //       image: null,
      //       name: 'David Codina',
      //       updatedAt: 'Thu Dec 18 2025 16:31:53 GMT-0700 (Mountain Standard Time)'
      //     }
      //   }
      //
      ///////////////////////////////////////////////////////////////////////////

      const result = await auth.api.signInEmail({
        body: {
          email,
          password: password
          // callbackURL?: string | undefined;
          // rememberMe?: boolean | undefined;
        }
        // asResponse: true // Returns a response objecct instead of data (???).
      })

      return {
        code: 'OK',
        data: result, //! DC 2026 : This was null. I added it for now...
        message: 'Login success.',
        success: true
      }
    } catch (err) {
      // const errorResponse = {
      //   code: codes.INTERNAL_SERVER_ERROR,
      //   data: null,
      //   message: `failed`,
      //   success: false
      // }

      // return errorResponse

      if (err instanceof APIError) {
        // ...
      }

      return {
        // The code would likely only be present if the err was
        // generated by the custom UnverifiedEmailError().
        code: (err instanceof Error &&
        'code' in err &&
        typeof err.code === 'string'
          ? err.code
          : 'INTERNAL_SERVER_ERROR') as Code,
        data: null,
        message: "'Invalid email or password. (Server)",

        success: false
      }
    }
  })
