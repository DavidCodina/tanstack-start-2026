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
  limit: z.number().default(DEFAULT_LIMIT).catch(DEFAULT_LIMIT)
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
  // validateSearch: (search: Record<string, unknown>) => {
  //   return {
  //     limit: (search.limit as number) || DEFAULT_LIMIT,
  //     page: (search.page as number) || DEFAULT_PAGE
  //   }
  // },
  //
  ///////////////////////////////////////////////////////////////////////////
  validateSearch: SearchParamsSchema,

  loaderDeps: (param) => {
    const { search } = param
    return { search }
  },

  loader: async (ctx) => {
    const { deps } = ctx
    const searchParams = deps.search

    const { page, limit } = searchParams
    const result = await getPaginatedPosts({ page, limit })

    return result
  }
})

/* ========================================================================

======================================================================== */

function PageServerPagination() {
  const router = useRouter()

  // For this demo, isFetching is used by the refresh button.
  const { isFetching } = Route.useMatch()

  const loaderData = Route.useLoaderData()
  const { data, success } = loaderData

  const searchParams = Route.useSearch()
  const { limit } = searchParams

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
      <div className='outlin-2 mb-6 flex flex-wrap justify-center gap-2'>
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
            await router.invalidate()
          }}
          size='sm'
          title='refresh'
          variant='secondary'
        >
          <RotateCw />
        </Button>
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
