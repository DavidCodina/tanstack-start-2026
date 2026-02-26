import {
  createFileRoute
  // getRouteApi,
  // notFound
  // useSearch
} from '@tanstack/react-router'
import { Route as RouteSVG } from 'lucide-react'

import { Page, PageContainer } from '@/components'

/* ======================

====================== */

export const Route = createFileRoute('/(demo)/catch-all/$id/$')({
  component: PageSplat,
  validateSearch: (search: Record<string, unknown>) => search,
  loader: async (_ctx) => {
    return {}
  }
})

/* ========================================================================

======================================================================== */
// https://tanstack.com/router/v1/docs/framework/react/routing/routing-concepts#splat--catch-all-routes

function PageSplat() {
  const { id, _splat = '' } = Route.useParams()
  // For example, going to http://localhost:3000/catch-all/a/b/c/d
  // would result in ['a', 'b', 'c', 'd'] as the params.
  const params = _splat.split('/')

  const data = { _splat, params }

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
          <RouteSVG strokeWidth={1} className='mr-2 inline size-[1em]' />
          _CATCH ALL {id}
        </h1>

        <pre className='bg-card mx-auto mb-6 max-w-[500px] overflow-scroll rounded-lg border p-4 text-sm shadow'>
          {JSON.stringify(data, null, 2)}
        </pre>
      </PageContainer>
    </Page>
  )
}
