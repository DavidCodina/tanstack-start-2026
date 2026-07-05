import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'
// import { stripeClient } from '@better-auth/stripe/client'

import type { auth } from './auth'
/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://better-auth.com/docs/concepts/client
//
// Once you have created the client, you can use it to sign up, sign in, and
// perform other actions. Some of the actions are reactive. The client uses
// nano-store to store the state and re-render the components when the state
// changes.
//
// The client also uses better-fetch to make the requests. You can pass the fetch
// configuration to the client.
//
///////////////////////////////////////////////////////////////////////////

export const authClient = createAuthClient({
  // baseURL: process.env.VITE_BASE_URL ?? "http://localhost:3000",
  plugins: [
    // stripeClient({ ... }),

    ///////////////////////////////////////////////////////////////////////////
    //
    // Coding In Flow does this at 40:30.
    // This does not affect the default types exported from 'better-auth'
    // import { Session, User } from 'better-auth'
    // Rather, what it does is inform the authClient.useSession() hook.
    //
    //   const value = authClient.useSession()
    //   const { data  } = value
    //   if (!data) { return null  }
    //   const { session, user } = data
    //
    // Now user.role will be recognized, assuming we've correctly implemented
    // user.additionalFields.role in @/lib/auth.ts
    //
    ///////////////////////////////////////////////////////////////////////////

    inferAdditionalFields<typeof auth>()
  ],

  // https://better-auth.com/docs/concepts/client#fetch-options
  fetchOptions: {},

  // https://better-auth.com/docs/concepts/client#session-options
  sessionOptions: {}
})
