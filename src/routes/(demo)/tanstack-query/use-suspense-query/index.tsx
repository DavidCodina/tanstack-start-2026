import { Suspense, useState } from 'react'
import { CatchBoundary, createFileRoute } from '@tanstack/react-router'
import { CircleCheckBig } from 'lucide-react'
// import { getTodosQueryFn } from '../-utils'
import { TodoForm } from './-components/TodoForm'
import { TodoList } from './-components/TodoList'

// import type { Todo } from '@/types'
import { Alert, Button, Page, PageContainer, Spinner } from '@/components'

export const Route = createFileRoute(
  '/(demo)/tanstack-query/use-suspense-query/'
)({
  component: PageUseSuspenseQuery
  // ⚠️ If you're not awaiting prefetched data (i.e., not blockign the initial render),
  // then there's really no reason to use the loader here.

  // loader: async (ctx) => {
  //   ctx.context.queryClient.ensureQueryData({
  //     queryKey: ['todos'],
  //     queryFn: getTodosQueryFn
  //     // retry: false
  //   })
  // }
})

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// One thing I learned from this demo is that there's actually no reason to
// ever implement useSuspenseQuery() + Suspsense. That fact is that if we simply
// use a normal useQuery, then everything will work much the same way, such that
// the initial render won't be blocked and pending UI will be shown.
//
// The boilerplate needed for a streaming implementation is much more verbose,
// disconnected and tedious to maintain. TL;DR: there's almost no reason to ever
// use any kind of Suspense/Await implementation. It's bad DX. The only exception
// to this is if you're streaming in from an RSC (like in Next.js).
//
// Often, you'll see tutorials hyping Suspense like it's the future of React and
// the solution to all your useEffect() problems. In practice, it's much more
// painful to use. So... here's the demo, but DON'T DO THIS!
//
///////////////////////////////////////////////////////////////////////////

function PageUseSuspenseQuery() {
  const [resetKey, setResetKey] = useState(0)
  const { queryClient } = Route.useRouteContext()

  /* ======================
          return 
  ====================== */

  return (
    <Page>
      <PageContainer>
        <h1 className='mb-6 rounded text-center text-6xl font-thin tracking-tight uppercase'>
          <CircleCheckBig className='inline size-[1em]' /> useSuspenseQuery()
          Todos
        </h1>

        <section className='bg-card mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-xl border p-4 shadow-xl'>
          <TodoForm />

          <CatchBoundary
            errorComponent={(errorComponentProps) => {
              const { error } = errorComponentProps

              const isFetching = queryClient.isFetching({
                queryKey: ['todos']
              })

              const isRefetching = isFetching > 0

              let code = ''
              if ('code' in error && typeof error.code === 'string') {
                code = error.code
              }
              return (
                <Alert
                  className='dark:bg-(--destructive-soft)/15'
                  rightSection={
                    <Button
                      className='self-center'
                      loading={isRefetching}
                      onClick={() => {
                        setResetKey((v) => v + 1)
                        queryClient.refetchQueries({ queryKey: ['todos'] })
                      }}
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
                    {error.message} {code ? `- ${code}` : ''}
                  </p>
                </Alert>
              )
            }}
            getResetKey={() => {
              return resetKey
            }}
          >
            <Suspense
              fallback={
                <div
                  className='flex min-h-[100px] items-center justify-center p-4'
                  style={{ outline: '0.5px dashed var(--color-blue-500)' }}
                >
                  <Spinner
                    className='size-12 text-blue-500'
                    initialShowSpinner={true}
                  />
                </div>
              }
            >
              <TodoList />
            </Suspense>
          </CatchBoundary>
        </section>
      </PageContainer>
    </Page>
  )
}
