import * as React from 'react'
import {
  HeadContent,
  Scripts,
  // createRootRoute,
  createRootRouteWithContext
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import 'material-symbols'
import {
  BasicSidebar,
  ErrorComponent,
  NotFoundComponent,
  Toaster
} from '@/components'
import { Providers } from '@/contexts'

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
// export const Route = createRootRoute({

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
