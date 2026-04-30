import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { RotateCw, Rss } from 'lucide-react'
import { z } from 'zod'

import { getPaginatedPosts } from './-utils/getPaginatedPosts'
import { Button, Page, PageContainer } from '@/components'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const SearchParamsSchema = z.object({
  ///////////////////////////////////////////////////////////////////////////
  //
  // Appending .catch() is also a good practice to prevent your
  // page from blowing up if a developer passes a bad value. In theory TypeScript
  // should warn them. However, there's an issue where there's no type safety on
  // search prop when using "." instead of explicit '/server-pagination'
  //
  //   <Link
  //     to='.' // ⚠️ Whoops!
  //     search={{ page: page, limit: 'abc123' }} // ⚠️ Double whoops!
  //   >Page {page}</Link>
  //
  // Actually, this is expected behavior. When `to` is used alone without `from`,
  // search resolves to a union of all search params across all routes — so the
  // type is far too wide to catch a bad value.
  //
  ///////////////////////////////////////////////////////////////////////////
  page: z.number().default(DEFAULT_PAGE).catch(DEFAULT_PAGE),
  limit: z.number().default(DEFAULT_LIMIT).catch(DEFAULT_LIMIT),
  random: z.string().optional()
})

/* ======================

====================== */

export const Route = createFileRoute('/(demo)/server-pagination/')({
  component: PageServerPagination,

  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Gotcha: Order Matters.
  //
  //   1. validateSearch.
  //   2. loaderDeps.
  //   3. loader.
  //
  // Otherwise you may enounter Typescript errors.
  //
  // We could also just do it from scratch, but using Zod is a best practice.
  //
  // validateSearch: (
  //   search: Record<string, unknown>
  // ): {
  //   limit?: number
  //   page?: number
  //   random?: string
  // } => {
  //   return {
  //     limit: (search.limit as number) || DEFAULT_LIMIT,
  //     page: (search.page as number) || DEFAULT_PAGE,
  //     // random: (search.random as string) || ''
  //   }
  // },
  //
  // Side note: order also matters with createMiddleware().client().server()
  //
  ///////////////////////////////////////////////////////////////////////////
  validateSearch: SearchParamsSchema,

  loaderDeps: (param) => {
    const { search } = param

    ///////////////////////////////////////////////////////////////////////////
    //
    // Because we're returning the entirety of the search params, we are essentially
    // saying, "any time ANY search param changes, re-run the loader." However, we might
    // have many other search params, some of which don't necessitate re-running the loader.
    // For that reason, it's better to only return what you need as dependencies.
    //
    //   ❌ return { search }
    //
    // That said, loaderDeps alone doesn't prevent the loader from re-running. It only
    // defines the cache key — i.e., what uniquely identifies a cached loader result.
    // The other half of the equation is staleTime, which controls how long that cached
    // result is considered fresh before the loader runs again.
    //
    // With the default staleTime: 0, cached data is immediately stale, so every navigation triggers
    // a fresh loader call regardless of whether the deps changed. This gotcha is also mentioned by
    // Josef Bender here at 4:55: https://www.youtube.com/watch?v=3jJ2Xz-oWt8
    //
    // To actually see the effect of selectively returning deps, you need to set staleTime to something larger
    // than 0 (e.g., staleTime: Infinity).
    //
    // Also, this kind of workaround will NOT avoid a page reload:
    //
    //   const params = new URLSearchParams(window.location.search)
    //   params.set('random', 'abc123')
    //   window.history.replaceState({}, '', `?${params.toString()}`)
    //
    // Why not? Because the router intercepts history writes. TanStack Router treats any URL change
    // as a navigation. The router uses a history implementation that patches pushState/replaceState
    // and listens for location changes, so calling window.history.replaceState is intercepted and will
    // update the router location. TanStack Router monkey-patches window.history.pushState and
    // window.history.replaceState via its @tanstack/history package, so it does intercept those calls
    // and triggers its own navigation logic — loader and all.
    //
    // So... In practice, I would generally strongly discourage setting staleTime to anything other than 0.
    // Thus in practice, we could just return { search }.
    //
    ///////////////////////////////////////////////////////////////////////////
    return {
      search: {
        page: search.page,
        limit: search.limit
        // random: search.random
      }
    }
  },

  loader: async (ctx) => {
    const { deps } = ctx
    const searchParams = deps.search

    const { page, limit } = searchParams
    const result = await getPaginatedPosts({ page, limit })
    // console.log('loader ran with:', searchParams)
    return result
  }
  // staleTime: Infinity // 👈 Cache lives forever (until invalidated manually)
})

/* ========================================================================

======================================================================== */

function PageServerPagination() {
  const router = useRouter()

  // For this demo, isFetching is used by the refresh button.
  // See Frontend Masters: Tanstack Start Fundamentals, section 2 at 23:00.
  const { isFetching } = Route.useMatch()

  const loaderData = Route.useLoaderData()
  const { data, success } = loaderData

  const searchParams = Route.useSearch()
  const { limit = DEFAULT_LIMIT } = searchParams

  /* ======================
      renderControls()
  ====================== */

  const renderControls = () => {
    if (success !== true || !data || typeof data.total !== 'number') {
      return null
    }

    const total = data.total
    const pages = Math.ceil(total / limit)

    return (
      <div className='mb-6 flex flex-wrap justify-center gap-2'>
        {Array.from({ length: pages }, (_, index) => {
          const page = index + 1
          return (
            <Button
              key={page}
              className=''
              render={
                <Link
                  // ⚠️ Gotcha: Using to="." works, but there's no type safety
                  // when passing search params. like limit: 'abc123'.
                  to='/server-pagination'
                  search={{
                    page: page,
                    limit: limit
                  }}
                  // Prevent prefetching on hover.
                  preload={false}
                  replace
                >
                  Page {page}
                </Link>
              }
              size='sm'
              variant='secondary'
            />
          )
        })}

        <Button
          isIcon
          loading={!!isFetching}
          onClick={async () => {
            ///////////////////////////////////////////////////////////////////////////
            //
            // router.invalidate() with no arguments will invalidate  all cached loader
            // data across every route  in your router, not just the current page.
            //
            //   ❌ router.invalidate() // 💥 Shotgun Blast!
            //   Todo: Create an ESLint rule warning against callign router.invalidate() without filter.
            //
            // That's bad. Fortunately, router.invalidate() can be more fine-grained.
            // See Frontend Masters: Tanstack Start Fundamentals, section 2 at 27:45.
            //
            // router.invalidate()  operates at the route match level, so the finest
            // granularity it offers is a single route, which is what the following
            // filter achieves.
            //
            // To get sub-route granularity (invalidating specific pieces of data within
            // a page), the recommended approach is to integrate TanStack Query
            //
            ///////////////////////////////////////////////////////////////////////////

            router.invalidate({
              filter: (route) => route.routeId === '/(demo)/server-pagination/'
            })

            // Side note: Let's say we were clearing the cache for some other page, and we
            // wanted to make extra sure we didn't show stale data while the background refresh
            // was happening. Then do this:
            // router.clearCache({ filter: (route) => route.routeId === '/(demo)/server-pagination/' })
          }}
          size='sm'
          title='refresh'
          variant='secondary'
        >
          <RotateCw />
        </Button>

        {/* <Button
          className=''
          render={
            <Link
              to='/server-pagination'
              search={(prev) => {
                return {
                  ...prev,
                  random: 'abc123'
                }
              }}
              replace
            >
              Set Random Search Param
            </Link>
          }
          size='sm'
          variant='secondary'
        /> */}
      </div>
    )
  }

  /* ======================
        renderPosts()
  ====================== */

  const renderPosts = () => {
    if (success !== true || !data || !Array.isArray(data.posts)) {
      return null
    }

    const slimPosts = data.posts.map((post) => {
      return {
        id: post.id
      }
    })

    return (
      <pre className='bg-card mx-auto mb-6 max-w-[1000px] overflow-scroll rounded-lg border p-4 text-sm shadow'>
        {JSON.stringify(slimPosts, null, 2)}
      </pre>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <Page
      currentPageLoader
      currentPageLoaderProps={{
        spinnerProps: {
          className: 'text-pink-500'
        }
      }}
    >
      <PageContainer>
        <h1
          className='text-primary mb-12 text-center text-7xl'
          style={{
            fontFamily: 'Chakra Petch',
            fontWeight: 300,
            letterSpacing: '2vw'
          }}
        >
          <Rss strokeWidth={1} className='mr-2 inline size-[1em]' />
          _SERVER PAGINATION
        </h1>

        {renderControls()}
        {renderPosts()}
      </PageContainer>
    </Page>
  )
}
