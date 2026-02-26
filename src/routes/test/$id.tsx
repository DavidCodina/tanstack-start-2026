import { createFileRoute, notFound } from '@tanstack/react-router'
import { FlaskConical, TriangleAlert } from 'lucide-react'
import { Page, PageContainer } from '@/components'

export const Route = createFileRoute('/test/$id')({
  component: PageTestDynamic,

  beforeLoad: (_ctx) => {
    // This is a good place to do auth checks.
  },
  loader: (ctx) => {
    const { params } = ctx
    const { id } = params
    const maybeNumber = Number(id)
    const isNotFound = isNaN(maybeNumber) || maybeNumber > 10
    if (isNotFound) {
      throw notFound()
    }
  },

  notFoundComponent: () => {
    return (
      <div className='min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 p-6'>
        <h1 className='mx-auto mb-6 w-fit rounded px-4 py-2 font-mono text-6xl font-thin tracking-tight text-white uppercase outline outline-white/50 outline-dashed'>
          <TriangleAlert className='inline size-[1em]' /> Test Page Not Found!
        </h1>
      </div>
    )
  }
})

/* ========================================================================

======================================================================== */

function PageTestDynamic() {
  const { id } = Route.useParams()

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
          _TEST {id}
        </h1>
      </PageContainer>
    </Page>
  )
}
