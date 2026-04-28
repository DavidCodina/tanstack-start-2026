import {
  createFileRoute
  // getRouteApi,
  // notFound
  // useSearch
} from '@tanstack/react-router'
import { FlaskConical } from 'lucide-react'
import { DataComponent } from './-components/Datacomponent'
import {
  Page,
  PageContainer
  // Spinner
} from '@/components'

import { codes, sleep } from '@/utils'

/* ======================

====================== */

const getData = async () => {
  await sleep(2500)

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

export const Route = createFileRoute('/(demo)/suspense/')({
  component: PageSuspense,
  // validateSearch: (search: Record<string, unknown>) => search,
  loader: async (_ctx) => {
    // In this case we're returning an unrespolved Promise.
    const dataPromise = getData()
    return { dataPromise }
  }
})

/* ========================================================================

======================================================================== */
// See Ankita Kulkarni at 2:19:45           : https://www.youtube.com/watch?v=G8D_n47rvoo
// Also demonstrated in Ali Alaa at 2:31:50 : https://www.youtube.com/watch?v=8_sGz4DHwIA&t=8721s
// Very importantly, Ali Alaa demos Tanstack Router's <Await> component.
function PageSuspense() {
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
          _SUSPENSE
        </h1>

        <DataComponent dataPromise={loaderData.dataPromise} />
      </PageContainer>
    </Page>
  )
}
