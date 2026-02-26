import { createFileRoute /* , notFound */ } from '@tanstack/react-router'
import { FlaskConical /* , TriangleAlert */ } from 'lucide-react'
import { Page, PageContainer } from '@/components'
import { getTodo } from '@/server-functions'
import { codes } from '@/utils'

export const Route = createFileRoute('/(demo)/todos2/$id')({
  component: PageTodo,
  loader: async (ctx) => {
    const { params } = ctx

    try {
      const getTodoResponse = await getTodo({
        data: { id: params.id }
      })

      return getTodoResponse
    } catch (_err) {
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: 'Internal Server Error',
        success: false
      }
    }
  }

  // head: async (_ctx) => {
  //   return {}
  // }
})

/* ========================================================================

======================================================================== */

function PageTodo() {
  const { id } = Route.useParams()
  const loaderData = Route.useLoaderData()

  /* ======================
          return
  ====================== */
  return (
    <Page>
      <PageContainer>
        <h1
          className='text-primary text-center text-7xl'
          style={{
            fontFamily: 'Chakra Petch',
            fontWeight: 300,
            letterSpacing: '2vw'
          }}
        >
          <FlaskConical strokeWidth={1} className='mr-2 inline size-[1em]' />
          _TODO
        </h1>

        <h5
          className='mb-6 text-center text-lg uppercase'
          style={{
            fontFamily: 'Chakra Petch',
            fontWeight: 300
          }}
        >
          {id}
        </h5>

        <pre className='bg-card mx-auto mb-6 max-w-[500px] overflow-scroll rounded-lg border p-4 text-sm shadow'>
          {JSON.stringify(loaderData, null, 2)}
        </pre>
      </PageContainer>
    </Page>
  )
}
