import { createFileRoute, notFound } from '@tanstack/react-router'
import { FlaskConical } from 'lucide-react'

import {
  ErrorComponent,
  NotFoundComponent,
  Page,
  PageContainer,
  Spinner
} from '@/components'
import { codes, randomTrue, sleep } from '@/utils'

const getData = async () => {
  await sleep(5000)

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

/* ======================

====================== */

export const Route = createFileRoute('/(demo)/ssr-false/')({
  component: PageComponent,

  loader: async (_ctx) => {
    const result = await getData()
    return result
  },

  onError: (_error) => {},

  errorComponent: (errorComponentProps) => {
    // const {error, info, reset } = errorComponentProps

    return (
      <ErrorComponent invalidateRoute title={`ERROR`} {...errorComponentProps}>
        {/* ... */}
      </ErrorComponent>
    )
  },

  pendingMs: 1000,
  pendingMinMs: 500,

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

  notFoundComponent: (notFoundRouteProps) => {
    return (
      <NotFoundComponent
        title={`NOT FOUND FROM '/(demo)/ssr-false/'`}
        {...notFoundRouteProps}
      >
        {/* */}
      </NotFoundComponent>
    )
  }
})

/* ========================================================================

======================================================================== */

function PageComponent() {
  const loaderData = Route.useLoaderData()

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
          <FlaskConical strokeWidth={1} className='mr-2 inline size-[1em]' />
          _SSR: FALSE
        </h1>

        <pre className='bg-card mx-auto mb-6 max-w-[500px] overflow-scroll rounded-lg border p-4 text-sm shadow'>
          {JSON.stringify(loaderData, null, 2)}
        </pre>
      </PageContainer>
    </Page>
  )
}
