import { Link, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getPosts } from './-utils/getPosts'
import { Button, Page, PageContainer } from '@/components'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const SearchParamsSchema = z.object({
  page: z.number().default(DEFAULT_PAGE).catch(DEFAULT_PAGE),
  limit: z.number().default(DEFAULT_LIMIT).catch(DEFAULT_LIMIT)
})

/* ======================

====================== */

export const Route = createFileRoute('/(demo)/client-pagination/')({
  component: PageClientPagination,
  validateSearch: SearchParamsSchema,

  // If you have additional search params that actually do need to trigger a reload,
  // loaderDeps seems to still have precedence over shouldReload.
  // loaderDeps: (param) => {
  //   const { search } = param
  //   return { search: { page: ... }}
  // },

  shouldReload: (loaderFnContext) => {
    const { cause } = loaderFnContext
    return cause === 'enter'
  },
  loader: async (_ctx) => {
    const result = await getPosts()
    console.log('loader ran...')
    return result
  },

  // staleTime: Infinity causes cache to forever (until invalidated manually).
  // Some soret of staleTime > 0 is necessary to avoid a page reload when
  // updating search params. However, this now cuases a problem. We always
  // want the loader to run on initial navigation to the page. The cleanest
  // way to acheive this is with the above shouldReload function.
  staleTime: Infinity
})

/* ========================================================================

======================================================================== */

function PageClientPagination() {
  const searchParams = Route.useSearch()
  const { limit, page } = searchParams

  const loaderData = Route.useLoaderData()
  const { data, success } = loaderData

  /* ======================
      renderControls()
  ====================== */

  const renderControls = () => {
    const total = Array.isArray(data) ? data.length : 0
    const pages = Math.ceil(total / limit)

    if (success !== true || !data || typeof total !== 'number') {
      return null
    }

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
                  to='/client-pagination' // cause === 'stay'
                  search={{
                    page: page,
                    limit: limit
                  }}
                  preload={false}
                  replace
                >
                  Page {page}
                </Link>
              }
              ///////////////////////////////////////////////////////////////////////////
              //
              // ⚠️ Note: This kind of workaround will NOT avoid a page reload.
              // Why not? Because the router intercepts history writes. TanStack Router treats any URL change
              // as a navigation. The router uses a history implementation that patches pushState/replaceState
              // and listens for location changes, so calling window.history.replaceState is intercepted and will
              // update the router location. TanStack Router monkey-patches window.history.pushState and
              // window.history.replaceState via its @tanstack/history package, so it does intercept those calls
              // and triggers its own navigation logic — loader and all.
              //
              ///////////////////////////////////////////////////////////////////////////

              // onClick={() => {
              //   const params = new URLSearchParams(window.location.search)
              //   params.set('page', page.toString())
              //   params.set('limit', limit.toString())
              //   window.history.replaceState({}, '', `?${params.toString()}`)
              // }}
              size='sm'
              variant='secondary'
            />
          )
        })}
      </div>
    )
  }

  /* ======================
        renderPosts()
  ====================== */

  const renderPosts = () => {
    if (success !== true || !data || !Array.isArray(data)) {
      return null
    }

    const dataSubset = data
      .slice((page - 1) * limit, page * limit)
      .map((post) => {
        return {
          id: post.id
        }
      })

    return (
      <pre className='bg-card mx-auto mb-6 max-w-[1000px] overflow-scroll rounded-lg border p-4 text-sm shadow'>
        {JSON.stringify(dataSubset, null, 2)}
      </pre>
    )
  }

  /* ======================
          return
  ====================== */

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
          <svg
            className='mr-2 inline size-[1em]'
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path
              fillRule='evenodd'
              d='M16 8a8 8 0 0 1-7.022 7.94l1.902-7.098a3 3 0 0 0 .05-1.492A3 3 0 0 0 10.237 6h5.511A8 8 0 0 1 16 8M0 8a8 8 0 0 0 7.927 8l1.426-5.321a3 3 0 0 1-.723.255 3 3 0 0 1-1.743-.147 3 3 0 0 1-1.043-.7L.633 4.876A8 8 0 0 0 0 8m5.004-.167L1.108 3.936A8.003 8.003 0 0 1 15.418 5H8.066a3 3 0 0 0-1.252.243 2.99 2.99 0 0 0-1.81 2.59M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4'
            />
          </svg>
          _CLIENT PAGINATION
        </h1>

        {renderControls()}
        {renderPosts()}
      </PageContainer>
    </Page>
  )
}
