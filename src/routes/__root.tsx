import * as React from 'react'
import {
  HeadContent,
  Scripts,
  // createRootRoute,
  createRootRouteWithContext,
  redirect
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url' // ???

import type { QueryClient } from '@tanstack/react-query'
import 'material-symbols'
import {
  BasicSidebar,
  ErrorComponent,
  NotFoundComponent,
  Toaster
} from '@/components'
import { Providers } from '@/contexts'

import { getSession } from '@/lib/auth.functions'

import {
  ADMIN_PREFIX,
  DEFAULT_LOGIN_REDIRECT,
  authRoutes,
  publicRoutes
} from '@/lib/routes'
// import { DrawerDemo1 } from '@/components/Drawer/demos'

// See Code Genix at 1:01:00 for more on Typed Router Context:
// https://www.youtube.com/watch?v=WyqxZniJk5w
// To consume use: Route.useRouteContext()
//
// Note: Even though we're typing the Router context here, it looks like
// the actual injection of the context occurs in router.tsx.
interface MyRouterContext {
  queryClient: QueryClient
  test: string
}

/* ========================================================================

======================================================================== */
// Prior to the introduction of Tanstack Query, we did this:
// export const Route = createRootRoute({ ... })

export const Route = createRootRouteWithContext<MyRouterContext>()({
  ///////////////////////////////////////////////////////////////////////////
  //
  // One performance note worth flagging now, since it's more pressing here than it was for the request middleware:
  // because this runs on the root route, it fires on every single client-side navigation in your app
  // — not just hard loads — and each one is now a real network round trip to your server (an RPC call),
  // not just an in-process function call. This is exactly the scenario Better Auth's cookieCache feature
  // exists for — enabling it (session: { cookieCache: { enabled: true, maxAge: 5 * 60 } } in your auth.ts)
  // means auth.api.getSession() can be served from a signed cookie most of the time instead of hitting your
  // database on every one of those calls, which matters a lot more now that "every navigation" includes
  // every in-app link click, not just page refreshes.
  //
  ///////////////////////////////////////////////////////////////////////////

  // https://tanstack.com/start/latest/docs/framework/react/guide/authentication
  beforeLoad: async (param) => {
    const { location } = param
    const { pathname, search } = location

    // '/login', '/register','/forgot-password', '/reset-password', etc.
    const isAuthRoute = authRoutes.includes(pathname)
    const isPublicRoute = publicRoutes.includes(pathname)
    ///////////////////////////////////////////////////////////////////////////
    //
    // beforeLoad is never triggered by server routes like /api/...
    //
    //   ❌ || pathname.startsWith('/api/auth')
    //   ❌ || pathname.startsWith('/api/public')
    //
    // Server routes (and server functions) protect themselves by calling the session check inside their own handler.
    //
    //   import { createServerFn } from "@tanstack/react-start";
    //   import { ensureSession } from "./auth.functions";
    //
    //   export const createPost = createServerFn({ method: "POST" })
    //     .inputValidator((data: { title: string }) => data)
    //     .handler(async ({ data }) => {
    //       const session = await ensureSession();
    //       const post = await db.posts.create({ title: data.title, authorId: session.user.id });
    //       return post;
    //     });
    //
    ///////////////////////////////////////////////////////////////////////////

    const isAdminRoute = pathname.startsWith(ADMIN_PREFIX)

    const session = await getSession()
    const isLoggedIn = !!session

    if (isAuthRoute) {
      if (isLoggedIn) {
        ///////////////////////////////////////////////////////////////////////////
        //
        // Note: When read linearly, it looks like we're throwing here without actually returning a session.
        // That would be inconsistent. However, throw redirect({ to: DEFAULT_LOGIN_REDIRECT })doesn't "continue"
        // to DEFAULT_LOGIN_REDIRECT using the current invocation of beforeLoad.  It aborts this navigation
        // attempt entirely and starts a brand new navigation to the target route.
        //
        // That new navigation re-runs the entire matched route chain from __root.tsx down — meaning beforeLoad on
        // the root route runs again, fresh, for the new pathname (DEFAULT_LOGIN_REDIRECT). It will call getSession()
        // again, compute isAuthRoute/isPublicRoute again for the new path, and return its own { session } context
        // for that new attempt.
        //
        ///////////////////////////////////////////////////////////////////////////
        throw redirect({ to: DEFAULT_LOGIN_REDIRECT })
      }
      ///////////////////////////////////////////////////////////////////////////
      //
      // Optional: return { session } instead of just return.
      // Since you're already computing session here, returning it from beforeLoad
      // lets child-route loaders read it from context instead of calling getSession() again
      // — saves a redundant session lookup per navigation if any child routes need the user.
      // Not required, just a common optimization once you have this working.
      //
      // Note: At this point, the user is not logged in, so session will ALWAYS be null.
      //
      ///////////////////////////////////////////////////////////////////////////
      return { session }
    }

    if (!isLoggedIn && !isPublicRoute) {
      throw redirect({
        to: '/login',
        // No need for manual encodeURIComponent. By default, TanStack Router
        // parses and serializes URL search params automatically using JSON.stringify
        // and JSON.parse, and this process involves escaping and unescaping the
        // search string as part of that serialization.
        search: { ...search, callbackUrl: pathname }
      })
    }

    /* ======================
          Admin Check
    ====================== */

    if (isLoggedIn && isAdminRoute) {
      const role =
        'role' in session.user && typeof session.user.role === 'string'
          ? session.user.role
          : ''
      if (role.toLowerCase() !== 'admin') {
        throw redirect({
          to: '/' //# Still need to make this page: '/forbidden'
        })
      }
    }

    return { session }
  },

  head: () => ({
    meta: [
      {
        charSet: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        title: 'TanStack Start Demo'
      }
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss
      }
    ],
    scripts: [
      // { children: `` }
    ]
  }),

  shellComponent: RootDocument,

  errorComponent: (errorComponentProps) => {
    return (
      <ErrorComponent
        // beforeReset={async () => {}}
        invalidateRoute
        title={`ERROR FROM __root'`}
        {...errorComponentProps}
      >
        {/* ... */}
      </ErrorComponent>
    )
  },

  notFoundComponent: (notFoundRouteProps) => {
    return (
      <NotFoundComponent
        title={`NOT FOUND FROM __root.tsx`}
        {...notFoundRouteProps}
      />
    )
  }
})

/* ========================================================================

======================================================================== */

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='en'
      // Neded for the ThemeProvider implementation to prevent error:
      //   ❌ A tree hydrated but some attributes of the server rendered
      //   HTML didn't match the client properties. This won't be patched up.
      // See here: https://github.com/Balastrong/start-theme-demo/blob/main/src/routes/__root.tsx
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>

      <body
        className='flex w-full flex-1 flex-col antialiased'
        style={{
          // ❌ 100vh does not work well on mobile/tablet.
          minHeight: '100dvh',
          width: '100%'
        }}
      >
        {/* DC: This was not part of the default setup. I added this.
        Remove it if it becomes problematic. */}
        <React.StrictMode>
          {/* 
        Prevent FOUC. See here at 3:45
        https://www.youtube.com/watch?v=NoxvbjkyLAg
        Run theme script as early as possible to prevent FOUC.
        This must run before React renders so Tailwind variants can match.
        */}
          {/* <ScriptOnce children={themeScript} /> */}

          {/* 
        src/router.tsx implements createRouter(), which has Wrap and InnerWrap options.
        However, there have been some issues with those approaches lately. For now, I'm 
        going to consume providers here. 
        
        Balastrong also implements providers here:
        https://github.com/Balastrong/start-theme-demo/blob/main/src/routes/__root.tsx
        */}
          <Providers>
            {/* <DrawerDemo1 /> */}
            <BasicSidebar />
            {/* ⚠️ Make sure <Toaster /> is placed here to avoid potential race conditions when a page mounts.
            Also, make sure <Toaster /> is inside of <Providers>, so it has access to the theme. */}
            <Toaster />
            {children}
            <TanStackDevtools
              config={{
                position: 'bottom-right'
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />
                },
                TanStackQueryDevtools,
                formDevtoolsPlugin()
              ]}
            />
          </Providers>
        </React.StrictMode>

        {/* Scripts outside is the recommended approach. */}
        <Scripts />
      </body>
    </html>
  )
}
