import { betterAuth } from 'better-auth'
// import { APIError, createAuthMiddleware } from 'better-auth/api'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { db } from '@/db'

// type StatusCode = ConstructorParameters<typeof APIError>[0]

/* ========================================================================

======================================================================== */
// https://better-auth.com/docs/integrations/tanstack
// https://better-auth.com/docs/adapters/drizzle
// https://www.better-auth.com/docs/concepts/cli

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg'
  }),

  // WDS touches on rate limiting at 35:20. This is disabled in development, and enabled in production.
  // However, Next.js is serverless and the rate limiting logic is normally stored in memory, so
  // it woulnd't work in serverless environments. The solution is to change the rateLimit.storage to
  // be "database". But that actual solution proposed by WDS is to use Arcjet.
  // rateLimit: {},

  // https://www.better-auth.com/docs/reference/options#user
  //# Configure for firstName, lastName
  user: {
    // https://better-auth.com/docs/concepts/users-accounts#delete-user
    deleteUser: {
      enabled: true
    }

    // additionalFields: {
    //   ///////////////////////////////////////////////////////////////////////////
    //   //
    //   // Note: BETTER-AUTH also provides plugins for more sophisticated access control.
    //   // See here for more info:
    //   //
    //   //   - better-auth.com/docs/plugins/admin
    //   //   - better-auth.com/docs/plugins/organization
    //   //
    //   ///////////////////////////////////////////////////////////////////////////
    //   role: {
    //     type: 'string',
    //     input: false
    //   }
    // }
  },

  // https://www.better-auth.com/docs/concepts/session-management#session-caching
  // https://www.better-auth.com/docs/reference/options#session
  // WDS at 14:15 ( https://www.youtube.com/watch?v=WPiqNDapQrk ) demonstrates
  // how to cache a session. This is something worth exploring.
  // If a session is revoked or expires, the cookie will be invalidated

  session: {},

  // Note: account linking is enabled by default in Better Auth, and OAuth providers like Google and GitHub are trusted by default.
  // Thus, explicitly enabling it and setting trustedProviders: ['google', 'github'] isn't doing anything new.
  account: {
    accountLinking: {
      allowDifferentEmails: true
    }
  },

  // trustedOrigins: ...

  // https://www.better-auth.com/docs/authentication/email-password
  // https://www.better-auth.com/docs/reference/options#emailandpassword
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    maxPasswordLength: 128,
    minPasswordLength: 5
  }

  // https://www.better-auth.com/docs/concepts/oauth

  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
  //   },

  //   // https://better-auth.com/docs/authentication/github
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string
  //     // WDS at 1:53:30
  //     // mapProfileToUser: (_profile) => { return {} }
  //   },
  //   // https://better-auth.com/docs/authentication/linkedin
  //   // https://www.linkedin.com/developers/apps
  //   linkedin: {
  //     clientId: process.env.LINKEDIN_CLIENT_ID as string,
  //     clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string
  //   }

  // plugins: [],
})
