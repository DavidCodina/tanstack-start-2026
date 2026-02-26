import { createFileRoute /* , notFound */ } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { FlaskConical /* , TriangleAlert */ } from 'lucide-react'
import { getTodoQueryFn } from './-utils'
import { Alert, Button, Page, PageContainer } from '@/components'

export const Route = createFileRoute('/(demo)/tanstack-query/$id')({
  component: PageTodo,
  loader: async (ctx) => {
    const { params } = ctx
    await ctx.context.queryClient.ensureQueryData({
      queryKey: ['todo', params.id],
      queryFn: ({ queryKey }) => getTodoQueryFn({ todoId: queryKey[1] })
    })
  }

  // head: async (_ctx) => { return {} }
})

/* ========================================================================

======================================================================== */

function PageTodo() {
  const { id } = Route.useParams()

  const { data, isError, error, isPending, isRefetching, refetch } = useQuery({
    queryKey: ['todo', id],
    queryFn: ({ queryKey }) => getTodoQueryFn({ todoId: queryKey[1] })
    // retry: false // Use this when testing random errors to prevent it from later succeeding.
  })

  /* ======================
        renderTodo()
  ====================== */

  const renderTodo = () => {
    // Even though we're prefetching in the loader, this UI
    // could still show when the browser is refreshed.
    if (isPending) {
      return (
        <div className='text-center text-2xl font-bold text-sky-500'>
          Loading...
        </div>
      )
    }

    if (data && typeof data === 'object') {
      return (
        <pre className='bg-card mx-auto mb-6 max-w-[500px] overflow-scroll rounded-lg border p-4 text-sm shadow'>
          {JSON.stringify(data, null, 2)}
        </pre>
      )
    }

    if (isError) {
      return (
        <Alert
          className='dark:bg-(--destructive-soft)/15'
          rightSection={
            <Button
              className='self-center'
              loading={isRefetching}
              onClick={() => refetch()}
              variant='destructive'
              size='sm'
            >
              {isRefetching ? 'Loading...' : 'Retry'}
            </Button>
          }
          title='Error'
          variant='destructive'
        >
          <p>
            {error.message} - {error.code}
          </p>
        </Alert>
      )
    }

    return null
  }

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

        {renderTodo()}
      </PageContainer>
    </Page>
  )
}
