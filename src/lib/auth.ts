import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
// import { APIError, createAuthMiddleware } from 'better-auth/api'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { sendVerificationEmail } from './sendVerificationEmail'
import { sendResetPasswordEmail } from './sendResetPasswordEmail'
import { db } from '@/db'

import * as schema from '@/db/schema'
// type StatusCode = ConstructorParameters<typeof APIError>[0]

/* ========================================================================

======================================================================== */
// https://better-auth.com/docs/installation
// https://better-auth.com/docs/integrations/tanstack
// https://better-auth.com/docs/adapters/drizzle
// https://www.better-auth.com/docs/concepts/cli

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
      user: schema.UserTable,
      session: schema.SessionTable,
      account: schema.AccountTable,
      verification: schema.VerificationTable
    }
  }),

  plugins: [tanstackStartCookies()], // make sure this is the last plugin in the array

  // WDS touches on rate limiting at 35:20. This is disabled in development, and enabled in production.
  // However, Next.js is serverless and the rate limiting logic is normally stored in memory, so
  // it wouldn't work in serverless environments. The solution is to change the rateLimit.storage to
  // be "database". But that actual solution proposed by WDS is to use Arcjet.
  // rateLimit: {},

  // https://www.better-auth.com/docs/reference/options#user
  //# Configure for firstName, lastName
  user: {
    // https://better-auth.com/docs/concepts/users-accounts#delete-user
    deleteUser: {
      enabled: true
    },

    additionalFields: {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Note: BETTER-AUTH also provides plugins for more sophisticated access control.
      // See here for more info:
      //
      //   - better-auth.com/docs/plugins/admin
      //   - better-auth.com/docs/plugins/organization
      //
      ///////////////////////////////////////////////////////////////////////////
      role: {
        type: 'string',
        input: false // Prevents users from setting their own role.
      }
    }
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // https://www.better-auth.com/docs/concepts/session-management#session-caching
  // https://www.better-auth.com/docs/reference/options#session
  // WDS at 14:15 ( https://www.youtube.com/watch?v=WPiqNDapQrk ) demonstrates
  // how to cache a session. This is something worth exploring.
  // If a session is revoked or expires, the cookie will be invalidated
  //
  // See also Coding In Flow at 28:25: https://www.youtube.com/watch?v=w5Emwt3nuV0&t=15s
  // There he talks about how session expiration works.
  // https://better-auth.com/docs/concepts/session-management#session-expiration
  //
  ///////////////////////////////////////////////////////////////////////////
  session: {},

  // Note: account linking is enabled by default in Better Auth, and OAuth providers like Google and GitHub are trusted by default.
  // Thus, explicitly enabling it and setting trustedProviders: ['google', 'github'] isn't doing anything new.
  account: {
    accountLinking: {
      allowDifferentEmails: true
    }
  },

  // trustedOrigins: ... // ???

  // https://www.better-auth.com/docs/authentication/email-password
  // https://www.better-auth.com/docs/reference/options#emailandpassword
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    maxPasswordLength: 128,
    minPasswordLength: 5,

    //# Review Coding In Flow hooks section at 1:19:00 for custom password validation:
    //# https://www.youtube.com/watch?v=w5Emwt3nuV0

    // If you try to log in with an unverified email, you'll get an "Email not verified" error.
    // {message: 'Email not verified', code: 'EMAIL_NOT_VERIFIED', status: 403, statusText: 'FORBIDDEN'}
    requireEmailVerification: true,
    // https://better-auth.com/docs/authentication/email-password#request-password-reset
    sendResetPassword: async (parameter, _request) => {
      const { user, url /*, token */ } = parameter
      await sendResetPasswordEmail({
        email: user.email,
        name: user.name,
        url
      })
    }

    //# Consider doing something with this.
    //# onPasswordReset: async ({ user }, request) => {
    //#   console.log(`Password for user ${user.email} has been reset.`)
    //# }
  },

  emailVerification: {
    //  autoSignInAfterVerification: true,

    ///////////////////////////////////////////////////////////////////////////
    //
    // By default, this is undefined.
    //
    // ❌ sendOnSignUp: true,
    //
    // However, the feature seems to work fine without it.
    // The `requireEmailVerification: true` is already triggering it. According to AI (???),
    //
    //   sendOnSignUp targets OAuth provider signups, not credential signups. When a user registers
    //   via Google, GitHub, etc., Better Auth won't send a verification email by default — because
    //   the assumption is the OAuth provider already vouched for the email. Setting sendOnSignUp: true
    //   overrides this and fires your sendVerificationEmail handler for those OAuth users too.
    //
    // For now, I'm content with no email verification for OAuth signups.
    //
    ///////////////////////////////////////////////////////////////////////////
    // ❌ sendOnSignUp: true,

    sendVerificationEmail: async (parameter, _request) => {
      const { user, url, token: _token } = parameter

      // https://better-auth.com/docs/authentication/email-password#email-verification
      // ⚠️ Avoid awaiting the email sending to prevent timing attacks.
      // On serverless platforms, use waitUntil or similar to ensure the email is sent.
      sendVerificationEmail({
        email: user.email,
        name: user.name,
        url
      })
    }
  },

  // https://www.better-auth.com/docs/concepts/oauth

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    },

    // https://better-auth.com/docs/authentication/github
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
      // WDS at 1:53:30
      // mapProfileToUser: (_profile) => { return {} }
    },
    // https://better-auth.com/docs/authentication/linkedin
    // https://www.linkedin.com/developers/apps
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string
    }
  },

  advanced: {
    database: {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Note: If you use generateId: 'uuid', then you may need to update the id column
      // for all Better Auth tables as follows:
      //
      //  ❌ id: text('id').primaryKey()
      //  ✅ id: text('id').primaryKey().default(sql`gen_random_uuid()`),
      //
      // Or switch the column type entirely to uuid('id').primaryKey().defaultRandom().
      //
      ///////////////////////////////////////////////////////////////////////////
      generateId: 'uuid'
      // generateId: () => crypto.randomUUID()
    }
  }
})
