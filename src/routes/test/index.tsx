// import { createMiddleware } from '@tanstack/react-start'
import {
  // Await,
  // CatchBoundary,
  // Navigate,
  createFileRoute,
  // getRouteApi,
  notFound

  // useSearch
} from '@tanstack/react-router'
import { FlaskConical } from 'lucide-react'
import { z } from 'zod'

import {
  ErrorComponent,
  NotFoundComponent,
  Page,
  PageContainer,
  Spinner
} from '@/components'
import { codes, randomTrue, sleep } from '@/utils'

///////////////////////////////////////////////////////////////////////////
//
//   const SearchParamsSchema = z.object({
//     name: z.enum(['David Codina', 'Holly Grant'])
//   })
//
// If we now do this somewhere else in the app:
// <Link to='/test' search={{ name: 'Punkin Pie' }}>
// We'll get a red squiggly line under `name`.
// If you actually navigate to the URL, it'll blow up your page.
//
//   Something went wrong!
//
//   [
//     {
//       "code": "invalid_value",
//       "values": ["David Codina", "Holly Grant"],
//       "path": ["name"],
//       "message": "Invalid option: expected one of \"David Codina\"|\"Holly Grant\""
//     }
//   ]
//
// Similarly, if we did this:
//
//   const SearchParamsSchema = z.object({ name: z.string() })
//
// And then went to http://localhost:3000/test
//
//   Something went wrong!
//
//   [
//     {
//       "expected": "string",
//       "code": "invalid_type",
//       "path": ["name"],
//       "message": "Invalid input: expected string, received undefined"
//     }
//   ]
//
// So while validateSearch is very powerful, it's also very easy to get into a
// situation where you're throwing errors unintentionally. For that reason, it's best
// to do something like:
//
//    name: z.string().catch('')  // Still not great, but better.
//    name: z.string().optional() // Okay.
//
// Or better yet:
//
//   name: z.string().default('') // Best approach.
//
/////////////////////////
//
// Note in tutorials from Q3 of 2025, people were still using @tanstack/zod-adapter
// However, this is no longer needed in recent versions of TanStack Start/Router.
// The @tanstack/zod-adapter was needed in earlier versions of TanStack Router,
// but with the adoption of the Standard Schema specification (which Zod implements
// natively), the adapter became unnecessary.
//
///////////////////////////////////////////////////////////////////////////

const SearchParamsSchema = z.object({
  // Using .default('') will actually add the search param to the URL!
  name: z.string().default(''),
  // While appending .default('') is generally what you want to do, in
  // some cases it actually makes mores sense to use .catch() and/or optional.
  // In this case, we're saying isCool is optional, but if it is specified, it
  // it can only be 'yes' or 'no'. Thus, if isCool=true an error will be thrown,
  // and in that case we can catch it and turn it into 'yes' instead.
  isCool: z.enum(['yes', 'no']).optional().catch('yes')
})

const getData = async () => {
  await sleep(1000)

  if (randomTrue(0)) {
    throw notFound()
  }

  // No need to catch errors in loaders.
  if (randomTrue(0)) {
    throw new Error('Whoops! Something bad happened.')
  }

  return {
    code: codes.OK,
    data: {
      test: 'Testing 123...'
    },
    message: 'success',
    success: true
  }
}

// const loggingMiddleware = createMiddleware({ type: 'request' }).server(
//   async ({ next, context /* , request */ }) => {
//     console.log(
//       '\n\n-----------------------------\n\n',
//       context,
//       '\n\n-----------------------------\n\n'
//     )

//     return next()
//   }
// )

/* ======================

====================== */

// https://tanstack.com/router/latest/docs/framework/react/api/router/createFileRouteFunction
export const Route = createFileRoute('/test/')({
  component: PageTest,

  ///////////////////////////////////////////////////////////////////////////
  //
  // For route-level middleware that runs on both client and server,
  // use beforeLoad instead of server .middleware.
  //
  // https://tanstack.com/router/v1/docs/framework/react/guide/authenticated-routes#the-routebeforeload-option
  //
  ///////////////////////////////////////////////////////////////////////////
  beforeLoad: async (contextOptions) => {
    const {
      context: _context,
      matches: _matches,
      params: _params,
      search: _search
    } = contextOptions
    // This runs on both client and server
    // console.log(
    //   '\n\n-----------------------------\n\n',
    //   context,
    //   '\n\n-----------------------------\n\n'
    // )

    // Whatever you return from here becomes page-specific context.
    // Thus in loader we can do this: console.log(ctx.context.test)
    return {
      test: 'Testing page-specific context.'
    }
  },

  server: {
    // https://tanstack.com/start/latest/docs/framework/react/guide/middleware
    middleware: [],
    handlers: {}
  },

  //# Learn more about this.
  //# staticData: {},

  // Recommended: Use Zod to validate the search params.
  validateSearch: SearchParamsSchema,
  // Not recommended: Use a maximally wide implementation like this.
  // validateSearch: (search: Record<string, unknown>) => search,

  // Why loaderDeps? It has to do with caching.
  // See Code Genix at 50:50: https://www.youtube.com/watch?v=WyqxZniJk5w
  // Also Ali Alaa at 2:17:30 : https://www.youtube.com/watch?v=8_sGz4DHwIA&t=1s
  loaderDeps: ({ search }) => ({ search }),

  // The loader function exists on both the client and the server.
  // You can't make database calls in the loader function.
  // For that you'd need a server function, which ONLY runs on the server.
  loader: async (_ctx) => {
    // console.log(ctx.context.test)
    // const { deps } = ctx
    // const searchParams = deps.search

    const result = await getData()
    return result
  },

  // shouldReload: () => {},

  ///////////////////////////////////////////////////////////////////////////
  //
  // The component passed to the errorComponent property runs against errors that occur in
  // beforeLoad and loader. If you omit the errorComponent from the current route component,
  // it gets caught by the errorComponent in router.tsx. If you omit the errorComponent in
  // router.tsx, it gets caught by the errorComponent in __root.tsx. Admittedly, the hierarchy
  // of behavior is is a little unintuitive.
  //
  // errorComponent does not run for errors in the actual component logic. For that, use onCatch
  //
  ///////////////////////////////////////////////////////////////////////////

  errorComponent: (errorComponentProps) => {
    return (
      <ErrorComponent
        // beforeReset={async () => {}}
        invalidateRoute
        title={`ERROR FROM '/test/'`}
        {...errorComponentProps}
      >
        {/* ... */}
      </ErrorComponent>
    )
  },

  //# Review Ali Alaa at 2:40:25 : https://www.youtube.com/watch?v=8_sGz4DHwIA&t=8721s
  // onCatch: (ctx) => {
  //   const message = ctx.message

  //   return (
  //     <Page>
  //       <PageContainer>
  //         <h1 className='mb-6 rounded text-center text-6xl font-thin tracking-tight uppercase'>
  //           <TriangleAlert className='mr-2 inline size-[1em] text-red-500' />
  //           Caught: {message}
  //         </h1>
  //       </PageContainer>
  //     </Page>
  //   )
  // },

  pendingMs: 1000, // Defaults to 1000
  pendingMinMs: 500, // Defaults to 500
  // This is bad UX - just like loading.tsx in Next.js
  pendingComponent: (_ctx) => {
    return (
      <Page>
        <PageContainer>
          <h1 className='mb-6 rounded text-center text-6xl font-thin tracking-tight uppercase'>
            <Spinner className='mr-2 inline size-[1em] text-blue-500' />{' '}
            Loading...
          </h1>
        </PageContainer>
      </Page>
    )
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // https://tanstack.com/router/latest/docs/framework/react/guide/not-found-errors
  //
  // If you throw notFound() from within loader or beforeLoad, it will first try to trigger this notFoundComponent.
  // If there is no notFoundComponent here, it will NOT buble up to the ./route.tsx, or the __root.tsx.
  // Instead, it will attempt to render the defaultNotFoundComponent defined in router.tsx.
  //
  // If you throw notFound() directly in the component, it will trigger the notFoundComponent in __root.tsx.
  // It will not trigger the notFoundComponent here.
  // Nor will it trigger a notFoundComponent in the local route.tsx.
  // However, if you want it to trigger some other notFoundComponent, you can do this:
  //
  //     throw notFound({ routeId: '/test/' })
  //
  // Now whenever you throw from within the component body, it WILL trigger the
  // current notFoundComponent.Similarly, if you had a route.tsx with its own notFoundComponent,
  // then you can use that across various routes:
  //
  //   throw notFound({ routeId: '/test' })
  //
  ///////////////////////////////////////////////////////////////////////////

  notFoundComponent: (notFoundRouteProps) => {
    return (
      <NotFoundComponent
        title={`NOT FOUND FROM '/test/'`}
        {...notFoundRouteProps}
      >
        {/* */}
      </NotFoundComponent>
    )
  }
})

/* ========================================================================

======================================================================== */

function PageTest() {
  // Will block page load until this is ready.
  // No need to await this.
  const result = Route.useLoaderData()

  // const searchParams = Route.useSearch()
  // console.log('\n\nsearchParams', searchParams)
  // const { name } = searchParams
  // console.log('name', name)

  /* ======================
          return 
  ====================== */

  if (randomTrue(0)) {
    // throw new Error('A random error occurred in the component.')
    // throw notFound({ routeId: '/test/' })
  }

  return (
    <Page>
      <PageContainer>
        <h1
          className='text-primary mb-12 text-center text-7xl'
          style={{
            fontFamily: 'Chakra Petch',
            fontWeight: 300,
            letterSpacing: '2vw'
          }}
        >
          <FlaskConical strokeWidth={1} className='mr-2 inline size-[1em]' />
          _TEST
        </h1>

        <pre className='bg-card mx-auto mb-6 max-w-[500px] overflow-scroll rounded-lg border p-4 text-sm shadow'>
          {JSON.stringify(result, null, 2)}
        </pre>
      </PageContainer>
    </Page>
  )
}
