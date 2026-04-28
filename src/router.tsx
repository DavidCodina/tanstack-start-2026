import { createRouter } from '@tanstack/react-router'

// ////////////////////////////////////////////////////////////////////////
//
// setupRouterSsrQueryIntegration is part of the overall TanStack Query implementation, but specifically
// serves as the SSR (Server-Side Rendering) integration layer between TanStack Router and TanStack Query.
// What it does:
//
//   1. SSR Query Synchronization: It ensures that TanStack Query's data fetching
//      and caching works properly during server-side rendering
//
//   2. QueryClient Integration: It connects the QueryClient instance (created in
//      TanstackQuery.getContext()) with the router's SSR capabilities
//
//   3. Context Provision: It enables routes to access the QueryClient through the router
//      context (as seen in __root.tsx where MyRouterContext requires a queryClient)
//
// Why it's needed:
//
//   The @tanstack/react-router-ssr-query package provides the glue between TanStack Router's SSR
//   capabilities and TanStack Query's data management. Without this integration, queries wouldn't
//   work properly in SSR environments - data wouldn't be pre-fetched on the server or properly
//   hydrated on the client.
//
//   This is why your current application (with TanStack Query) needs this integration, while your
//   simpler application (without TanStack Query) doesn't.
//
// ////////////////////////////////////////////////////////////////////////
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import { ErrorComponent, NotFoundComponent } from '@/components'

/* ========================================================================

======================================================================== */
// ////////////////////////////////////////////////////////////////////////
//
// When I went through the initial configuration process with npm create @tanstack/start@latest
// It didn't ask me if I wanted to use a File Router or Code Router. However, in older
// tutorials it shows the configuration process providing that option.
// This app is using the file-based routing approach. How do we know?
//
//   1. Router Configuration: Your src/router.tsx imports a routeTree from './routeTree.gen',
//   which is the auto-generated route tree file created by the file-based routing system.
//
//   2. Routes Directory Structure: Your src/routes/ directory contains route files that follow
//   the file-based routing convention:
//     - __root.tsx - the root layout
//     - index.tsx - the home route
//     - demo/ subdirectory with nested route files
//
//   3. Build Configuration: Your vite.config.ts uses the tanstackStart() plugin, and your package.json
//   includes @tanstack/router-plugin, which automatically generates the route tree from your file structure.
//
// In newer versions of Tanstack Start (like yours with v1.132.0), file-based routing has become the
// default and preferred approach. The setup process no longer prompts for routing type selection
// since file-based routing is now the standard. Older tutorials you might have seen were from
// when both options were equally available during initial setup.
//
// ////////////////////////////////////////////////////////////////////////

// Create a new router instance
export const getRouter = () => {
  // ////////////////////////////////////////////////////////////////////////
  //
  // The current setup:
  //
  //   - Creates a QueryClient via TanstackQuery.getContext()
  //   - Passes it to router context so routes can access it
  //   - Integrates with SSR via setupRouterSsrQueryIntegration
  //   - Enables server-side query preloading and hydration
  //
  // ////////////////////////////////////////////////////////////////////////
  const rqContext = TanstackQuery.getContext()
  // https://tanstack.com/router/latest/docs/framework/react/api/router/RouterOptionsType
  const router = createRouter({
    routeTree,
    context: {
      ...rqContext,

      ///////////////////////////////////////////////////////////////////////////
      //

      //
      // Even though I'm passing 'Global Test' here, in routes/test/index.tsx,
      // I intercept and overwrite it.
      //
      // beforeLoad: async (contextOptions) => {
      //   const {
      //     context: _context,
      //     matches: _matches,
      //     params: _params,
      //     search: _search
      //   } = contextOptions
      //
      //   console.log(_context)
      //
      //   // Whatever you return from here becomes page-specific context.
      //   // Thus in loader we can do this: console.log(ctx.context.test)
      //   return {
      //     test: 'Testing page-specific context.'
      //   }
      // }
      //
      // Context is available in beforeLoad, loader and in the component body
      // with: Route.useRouteContext().test
      //
      ///////////////////////////////////////////////////////////////////////////
      test: 'Global Test'
    },

    // Or use pendinMs ins a specific route.
    defaultPendingMs: 1000, // Default is 1000
    defaultPendingMinMs: 500, // Default is 500

    scrollRestoration: true,
    defaultStaleTime: 0, // Built-in default - ⚠️ Never, ever change this!

    ///////////////////////////////////////////////////////////////////////////
    //
    // With defaultPreloadStaleTime: 0 and defaultPreload: 'intent', the loader
    // runs on every hover and again on navigation, which is inefficient.
    // By default, defaultPreloadStaleTime is 30_000 ms (30 seconds) out of the box.
    //
    // My concern here was that we'd need to call router.invalidate to cache bust
    // within the 30s window. However, that's not the case at all. If you're navigating
    // to a different page and as long as defaultStaleTime: 0, then the router may show
    // you stale data, but it reruns the loader and updates the page dynamically!
    // This is massively different than the Next.js router cache that does NOT
    // update dynamically and has historically resulted in massive confusion and frustration.
    //
    ///////////////////////////////////////////////////////////////////////////
    defaultPreloadStaleTime: 30 * 1000, // Built-in default

    // This is TanStack Router's recommended preload strategy:
    // Routes preload when user shows "intent" (hovering links, focusing inputs, etc.)
    defaultPreload: 'intent',

    defaultErrorComponent: (errorComponentProps) => {
      return (
        <ErrorComponent
          // beforeReset={async () => {}}
          invalidateRoute
          title={`ERROR FROM router.tsx`}
          {...errorComponentProps}
        >
          {/* ... */}
        </ErrorComponent>
      )
    },

    notFoundMode: 'fuzzy',
    defaultNotFoundComponent: (notFoundRouteProps) => {
      return (
        <NotFoundComponent
          title={`NOT FOUND FROM router.tsx`}
          {...notFoundRouteProps}
        />
      )
    }

    // ❌ defaultPendingComponent: () => undefined
  })

  // ////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Note: The TanstackQuery.Provider is NOT being used anywhere.
  // There's no QueryClientProvider wrapping the app in the root component, etc.
  // If you're coming from typical React/Vite apps! The traditional pattern would be:
  //
  //   <QueryClientProvider client={queryClient}>
  //     <RouterProvider router={router} />
  //   </QueryClientProvider>
  //
  // In fact, just a few months ago, the official createRouter options also included
  // (See PedroTech at 1:01:58: https://www.youtube.com/watch?v=s4I4JtOZNgg)
  //
  //   Wrap: (props: { children: React.ReactNode }) => {
  //     return (
  //       <TanstackQuery.Provider {...rqContext}>
  //         {props.children}
  //       </TanstackQuery.Provider>
  //     )
  //   },
  //
  // 💎 Wrap was removed because the router’s SSR/query integration now injects and manages
  // the QueryClient/provider for you, and the router API was simplified (and fixed) to
  // avoid the previous Wrap/InnerWrap pitfalls.
  //
  // But TanStack Start abstracts this away through its SSR integration layer. The TanstackQuery.Provider
  // in root-provider.tsx appears to be leftover code from a traditional setup that wasn't needed once
  // the SSR integration was implemented.
  //
  // So how are the queries working? This is where TanStack Start's architecture
  // differs significantly from typical Vite apps. The setupRouterSsrQueryIntegration
  // function in router.tsx appears to handle the QueryClient provider setup
  // automatically behind the scenes.
  //
  // This function from @tanstack/react-router-ssr-query likely:
  //   1. Automatically provides the QueryClient context to all routes
  //   2. Handles SSR hydration of query data
  //   3. Manages the provider lifecycle internally
  //
  // ////////////////////////////////////////////////////////////////////////

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  return router
}
