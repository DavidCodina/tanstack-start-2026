import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import {
  APIError,
  createAuthMiddleware
  // isAPIError
} from 'better-auth/api'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { z } from 'zod'

import { sendVerificationEmail } from './sendVerificationEmail'
import { sendResetPasswordEmail } from './sendResetPasswordEmail'
import { sendDeleteAccountVerification } from './sendDeleteAccountVerification'
import { db } from '@/db'

import * as schema from '@/db/schema'

const PasswordSchema = z
  .string()
  .min(1, { error: 'Password is required' })
  .min(8, { error: 'Password must be at least 8 characters long' })
  // Matches "anything that isn't a letter or digit"
  .regex(/[a-zA-Z]/, {
    message: 'Password must contain at least one letter'
  })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  // Matches "anything that isn't a letter or digit"
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Password must contain at least one special character.'
  })

/* ========================================================================

======================================================================== */
// https://better-auth.com/docs/installation
// https://better-auth.com/docs/integrations/tanstack
// https://better-auth.com/docs/adapters/drizzle
// https://www.better-auth.com/docs/concepts/cli

//# Finish watching hooks tutorials...

// Todo: Update RegisterForm, UpdatePasswordForm, ResetPasswordForm,
//# and LoginForm to all use a password input.
//# Make sure they all reset touched as well.

// Todo: Update UpdateEmailForm, UpdateUserForm, ForgotPasswordForm to all use
//# Form + Zod.

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
      enabled: true,

      // https://better-auth.com/docs/concepts/users-accounts#adding-verification-before-deletion
      // For added security, you’ll likely want to confirm the user’s intent before deleting their account.
      sendDeleteAccountVerification: async (parameter, _request) => {
        const {
          // token, // The verification token  (can be used to generate custom URL)
          user, // The user object
          url // The auto-generated URL for deletion
        } = parameter
        await sendDeleteAccountVerification({
          email: user.email,
          name: user.name,
          url
        })
      }
    },

    // https://better-auth.com/docs/concepts/users-accounts#change-email
    // WDS at 2:02:30
    // Coding In Flow at 1:49:30
    changeEmail: {
      enabled: true

      ///////////////////////////////////////////////////////////////////////////
      //
      // https://better-auth.com/docs/concepts/users-accounts#change-email
      // Coding in Flow at 1:47:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0
      // WDS at 2:02:45            : https://www.youtube.com/watch?v=WPiqNDapQrk
      //
      // By default, when a user requests to change their email, a verification email is sent to
      // the new email address.
      //
      //    const { data, error } = await authClient.changeEmail({ newEmail, callbackURL: '/' })
      //
      // The email is only updated after the user verifies the new email. This occurs through
      // the emailVerification implementation already set up in the registration flow.
      //
      /////////////////////////
      //
      // Confirming with Current Email:
      //
      // https://better-auth.com/docs/concepts/users-accounts#confirming-with-current-email
      // For added security, you can require users to confirm the change via their current
      // email before the verification email is sent to the new address.
      //
      // To do this, provide the sendChangeEmailConfirmation function. In Coding In Flow tutorial
      // at 1:50:20, he says he doesn't really know what the best approach is. Currently, I'm
      // using the less secure approach where the email verification goes to the NEW email. The
      // problem with the more secure approach of sending it to the old email
      // (i.e. sendChangeEmailConfirmation) is that in many cases, a user may be trying to change
      // their email on this app because they no longer have access to their old email account.
      //
      ///////////////////////////////////////////////////////////////////////////

      // sendChangeEmailConfirmation: async (parameter, _request) => {
      //   const { user, newEmail, url /* , token */ } = parameter
      //   // https://better-auth.com/docs/concepts/users-accounts#change-email
      //   // ⚠️ Avoid awaiting the email sending to prevent timing attacks.
      //   // On serverless platforms, use waitUntil or similar to ensure the email is sent.
      //
      //   // Send the email to the new email address...
      // }
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
        // Prevents users from setting their own role. Won't show up in
        //type hinting for methods like authClient.updateUser({ }), and
        // presumably won't even allow it if you tried.
        input: false
      },
      // This informs methods like authClient.updateUser({ }), etc.
      isCool: {
        type: 'boolean',
        // By default, each additional field is treated as required input unless you tell Better Auth otherwise.
        // Better Auth will not implicitly infer that it's optional from the schema. Thus set required:false.
        // Otherwise, auth.api.signUpEmail() will complain if you don't provide it.
        required: false
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
  //
  //
  ///////////////////////////////////////////////////////////////////////////
  session: {
    //# Test this to see what happens after 15s.
    // expiresIn: 7 * 24 * 60 * 60 // 7 days
    // cookieCache: {
    //   enabled: true,
    //   maxAge: 60 * 2 // e.g. 2 minutes
    // }
  },

  // Note: account linking is enabled by default in Better Auth, and OAuth providers like Google and GitHub are trusted by default.
  // Thus, explicitly enabling it and setting trustedProviders: ['google', 'github'] isn't doing anything new.

  account: {
    accountLinking: {
      // enabled: true, // Default is true

      ///////////////////////////////////////////////////////////////////////////
      //
      // If you want your users to be able to link a social account with a different email
      // address than the user, or if you want to use a provider that does not return email addresses,
      // you will need to enable this in the account linking settings.
      //
      // ⚠️ By default, Better Auth blocks linking when the OAuth provider's email doesn't match the account's existing email
      // - to prevent accidental cross-account linking or account takeover, Better Auth blocks the link when emails do not align.
      // That check is your safety net: it means an attacker can only auto-link a provider if they already control the exact
      // email on the account (which is a much smaller attack surface).
      //
      // allowDifferentEmails: true removes that net entirely — by default, an OAuth account can only be linked if the
      // OAuth provider's email matches the user's current email; setting allowDifferentEmails: true removes this
      // constraint, and this applies to both the automatic linking flow and the manual /link-social endpoint.
      //
      // And critically, linking is a session-authorized action, not a re-authenticated one — POST /link-social ...
      // verifies it, fetches user info, checks linking constraints, then calls internalAdapter.createAccount().
      // There's no password re-entry or fresh-login requirement baked in. So your attack chain is accurate:
      //
      //   1. Attacker gets a live session (XSS, stolen cookie, session fixation — doesn't matter how).
      //
      //   2. Attacker hits linkSocial with their own Google/GitHub account. Since allowDifferentEmails is on,
      //      the email mismatch check that would normally block this is disabled.
      //
      //   3. Attacker unlinks the victim's real providers/credentials.
      //
      //   4. Now the attacker's own OAuth identity is a permanent, legitimate credential on the victim's user.id.
      //   Even if the original hijacked session expires or the victim rotates their password, the attacker just
      //   signs in normally with their own Google account — full persistent takeover, no ongoing exploit needed.
      //
      // Allowing this significantly increases vulnerability to a "parasitic account linking" attack. You probably
      // do not want to do this in production apps.
      //
      // One nuance worth knowing: the user's email and emailVerified are never changed on a link, so linking a provider
      // can't rebind the account's identity — the profile's email field stays intact. But that's cold comfort,
      // because the attacker doesn't need to change the email; they just need a working sign-in method into that
      // account, and unlinking the others is enough to lock the real owner out.
      //
      // What I'd do about it
      //
      // - Don't use allowDifferentEmails: true unless you actually need it. If it's there just to support one provider that doesn't return verified emails, consider scoping the trust more narrowly rather than a blanket global flag.
      //
      // - Require step-up auth for link/unlink. Gate both actions behind a recent/fresh session check
      //   (e.g., re-enter password or re-verify OAuth within the last N minutes) rather than trusting
      //   any live session. You can enforce this with a before hook on the link-social and unlink-account routes.
      //
      // - Notify on every link/unlink. Email the account's verified address whenever a provider is added
      //   or removed, with a "wasn't you? secure your account" link that revokes all sessions. This is
      //   your real backstop against session hijacking, since the victim can react even if the attacker c
      //   ompletes step 3 above.
      //
      // - Block removing the last usable auth method unless a new one has been added and the notification/step-up
      //   window has passed — don't let link-then-immediately-unlink happen in one uninterrupted flow.
      //
      // - Revoke other sessions on link/unlink. Forces the legitimate user to re-authenticate, which both
      //   surfaces the change and limits blast radius.
      //
      // - Treat account-linking pages the way you'd treat a password-change page from a security posture
      //   - it's an identity-critical surface, so it deserves reauth, logging, and alerting even though it feels like "just settings."
      //
      ///////////////////////////////////////////////////////////////////////////
      allowDifferentEmails: true

      // If you want the newly linked accounts to update the user information,
      // you need to enable this in the account linking settings.
      // updateUserInfoOnLink: true

      ///////////////////////////////////////////////////////////////////////////
      //
      // According to AI: trustedProviders only applies in one direction: it allows trusted
      // OAuth providers (Google, GitHub) to automatically link to an existing credentials
      // account when the emails match. It does not handle the reverse — a credentials sign-up
      // linking to an existing OAuth-only account.
      //
      // The key insight is that trustedProviders is asymmetric by design — social providers are trusted
      // to claim an existing email, but a credentials sign-up is not trusted to claim an existing social
      // account, since it could be used to hijack an account by someone who merely knows the email address.
      //
      ///////////////////////////////////////////////////////////////////////////
      // trustedProviders: ['google', 'github']
    }
  },

  // trustedOrigins: ... // ???

  // https://www.better-auth.com/docs/authentication/email-password
  // https://www.better-auth.com/docs/reference/options#emailandpassword
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    maxPasswordLength: 128,
    // minPasswordLength: 5,

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

    // This is used by Better Auth when the user first registers.
    // However, it's also used if the app calls authClient.changeEmail({ ... })
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
      // See WDS at 1:53:45: https://www.youtube.com/watch?v=WPiqNDapQrk
      // mapProfileToUser: (_profile) => { return {} }
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

  /////////////////////////////////////////////////////////////////////////////
  //
  // https://better-auth.com/docs/concepts/hooks
  // The before hook can be used for blacklisting, server-side validation, etc.

  // ✅ Coding In Flow at 1:19:00 : https://www.youtube.com/watch?v=w5Emwt3nuV0
  //
  // ✅  WDS at 1:41:00           : https://www.youtube.com/watch?v=WPiqNDapQrk
  //     He uses `after` to send a welcom email after the user signs up.
  //
  // ✅ TomDoesTech at 8:15      : https://www.youtube.com/watch?v=RKqHrE0KyeE
  //    He also gives a welcome email example.
  //
  // ❎ GiraffeReactor at 1:58:00 : https://www.youtube.com/watch?v=N4meIif7Jtc
  //
  // ❎ Syntax at 11:40, 13:15 uses a hook for part of password reset.
  // ❎ Syntax at 15:40,
  //
  ///////////////////////////////////////////////////////////////////////////
  hooks: {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Path for email registration: '/sign-up/email',
    // Path for email login Path:   '/sign-in/email'
    // Path for sign out:           '/sign-out'
    // Path social sign in:         '/sign-in/social'
    // Check body.provider for 'google', 'github', etc.
    //
    ///////////////////////////////////////////////////////////////////////////
    before: createAuthMiddleware(
      // https://better-auth.com/docs/concepts/hooks#ctx
      async (ctx) => {
        // console.log({
        //   path: ctx.path,
        //   body: ctx.body,
        //   session: ctx.context.session,
        //   newSession: ctx.context.newSession
        //   // context: ctx.context
        // })

        ///////////////////////////////////////////////////////////////////////////
        //
        // Returning nothing (or just return) → the hook is observation-only, and the request continues as normal.
        // If you want to modify the return, then return { context: { ... } } as follows:
        //
        // if (ctx.path === '/sign-up/email') {
        //   return {
        //     context: {
        //       ...ctx,
        //       body: {
        //         ...ctx.body,
        //         name: 'John Doe'
        //       }
        //     }
        //   }
        // }
        //
        ///////////////////////////////////////////////////////////////////////////

        if (ctx.path === '/sign-up/email') {
          if (ctx.body.email === 'blacklisted@example.com') {
            ///////////////////////////////////////////////////////////////////////////
            //
            // https://better-auth.com/docs/concepts/hooks#json-responses
            // Using ctx.json() doesn't quite work how you may expect.
            //
            //   return ctx.json(
            //     { code: 'BLACKLISTED_EMAIL', data: null,  message: 'This email is blacklisted.', success: false }
            //   )
            //
            // If you use this on client:
            //
            //  const { data, error } = await authClient.signUp.email( ... )
            //
            // Then the return object will be a serialized string on the data property.
            // Conversely, when you use this on the server:
            //
            //    const result = await auth.api.signUpEmail( ... )
            //
            // The result will be the expected object - instead of { token, user }
            // While this approach works well enough for simple use cases, it still
            // doesn't allow you to send back more complex objects without things
            // getting a little hacky. Thus, it's not greate for itemized form errors, etc.
            // However, in most cases, we don't want that anyways.
            //
            /////////////////////////
            //
            // The following APIerror is checked within the catch block of register.ts as follows:
            //
            //   if (err instanceof APIError) {
            //     if (err.body?.code === 'EMAIL_BLACKLISTED') {
            //       return { code: err.body.code, data: null, message: 'The email is blacklisted.', success: false }
            //     }
            //   }
            //
            ///////////////////////////////////////////////////////////////////////////

            throw new APIError('BAD_REQUEST', {
              code: 'EMAIL_BLACKLISTED',
              message: 'This email is blacklisted.'
            })
          }
        }

        ///////////////////////////////////////////////////////////////////////////
        //
        // Suppose we wanted to enforce password validation rules when a user
        // submits a password. Currently, we're using a server function for when a
        // user registers, so we can handle the initial validation there.
        //
        // However, we also have an UpdatePasswordForm and ResetPasswordForm that allow
        // the user to modify their current password using the authClient. In those cases,
        //  we need some way to intercept and enforce password validation.
        //
        // Needless to say, there should be fidelity in Zod validation here and between
        // RegisterForm, UpdatePaswordForm, ResetPasswordForm, and the register server function.
        //
        /////////////////////////
        //
        // Is It Redundant?
        //
        // No. It's defense in depth. It's actually necessary as an added layer of validation to
        // prevent anyone who might try to circumvent the normal channels by calling the Better Auth API
        // endpoints directly. It's the only validation that's guaranteed to run no matter which door
        // someone comes through. The other two layers are:
        //
        //   1. Client-side form validation — pure UX, zero trust, trivially bypassed
        //   2. Server function validation (e.g., register.ts) — protects that specific call path,
        //      but only if the person goes through your app's server function instead of hitting
        //      Better Auth's endpoint directly..
        //
        // The hook is the one layer that sits at the actual trust boundary (inside the auth library itself),
        // so it's arguably the most important of the three, not the least.
        //
        ///////////////////////////////////////////////////////////////////////////
        if (
          ctx.path === '/sign-up/email' ||
          ctx.path === '/reset-password' ||
          ctx.path === '/change-password' // i.e., authClient.changePassword()
        ) {
          const password = ctx.body.password || ctx.body.newPassword

          const { /* data, */ error } = PasswordSchema.safeParse(password)

          if (error) {
            ///////////////////////////////////////////////////////////////////////////
            //
            // 'INVALID_PASSWORD' is already an official BetterAuthErrorCode.
            // For example, if you were to try to call authClient.changePassword()
            // with an invalid currentPassword, Better Auth would throw an error
            // internally, resulting in this result.error:
            //
            //   {
            //     code: 'INVALID_PASSWORD',
            //     message: "Invalid password",
            //     status: 400,
            //     statusText: 'BAD_REQUEST'
            //   }
            //
            // So here, we're essentially following a very similar pattern.
            // Obviously, 'INVALID_PASSWORD' is not very descriptive. This error
            // is intended to be a failsafe to prevent an invalid password, but
            // ultimately, the client-side code should be performing similar validation
            // preemptively, that actually provides valuable feedback to the user.
            //
            ///////////////////////////////////////////////////////////////////////////
            throw new APIError('BAD_REQUEST', {
              code: 'INVALID_PASSWORD',
              message: 'Invalid password'
            })
          }
        }
      }
    )
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
