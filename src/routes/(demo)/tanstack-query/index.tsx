import { createFileRoute } from '@tanstack/react-router'
import { Database } from 'lucide-react'

import { TodoForm } from './-components/TodoForm'
import { TodoList } from './-components/TodoList'
import { getTodosQueryFn } from './-utils'
// import type { Todo } from '@/types'
import { Page, PageContainer } from '@/components'

export const Route = createFileRoute('/(demo)/tanstack-query/')({
  component: TanStackQueryDemo,
  loader: async (ctx) => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // See Youssef Benlemlih :  https://www.youtube.com/watch?v=QoFQXlYr3X0
    // The ensureQueryData method is a convenience function that combines cache checking and fetching into a single operation.
    // Unlike prefetchQuery (which just caches data in the background), ensureQueryData returns a Promise that resolves with
    // the data, making it perfect for loaders where you need to ensure data is available before the route renders.
    //
    // Does it eliminate the need for if (!cachedData) checks?
    // Yes, completely! The ensureQueryData method handles this logic internally:
    //
    //   1. If data is cached and fresh: It returns the cached data immediately
    //   2. If data is cached but stale: It returns the cached data and triggers a background refetch
    //   3. If no data is cached: It fetches the data and caches it
    //
    ///////////////////////////////////////////////////////////////////////////
    // const queryClient = ctx.context.queryClient
    await ctx.context.queryClient.ensureQueryData({
      queryKey: ['todos'],
      queryFn: getTodosQueryFn
    })
  }

  ///////////////////////////////////////////////////////////////////////////
  //
  // Initially, I had a loader that looked like this:
  //
  //   loader: async (_ctx): ResponsePromise<Array<Todo> | null> => {
  //     const time = getTime()
  //     console.log(`loader running at: ${time}`)
  //     try {
  //       const res = await fetch('/api/tq-todos')
  //       const json = await res.json()
  //       return json as ResBody<Array<Todo>>
  //     } catch (_err) {
  //       return {
  //         code: codes.INTERNAL_SERVER_ERROR,
  //         data: null,
  //         message: 'fail',
  //         success: false
  //       }
  //     }
  //   },
  //
  //   Gotcha: With the current setup, the loader will run every time you navigate
  //   to the page after the stale time has elapsed. This means you will end up
  //   page blocking even when you have cached data. Solution: run the loader only
  //   once for the very first time the page loads.
  //   staleTime: Infinity // Loader runs only once.
  //
  // Then in the component, I did this:
  //
  //   const loaderData = Route.useLoaderData()
  //   const { data: initialData } = loaderData
  //
  // Then I passed initialData into the TodoList component and did this:
  //
  //   const { data, isError, error, isPending, isRefetching, refetch } = useQuery({
  //     queryKey: ['todos'],
  //     queryFn: getTodosQueryFn,
  //     ...(initialData ? { initialData } : {})
  //   })
  //
  // While this solution works, it's not ideal. The current approach is much
  // more idiomatic, and avoids having to pass initialData as a prop.
  //
  //   loader: async (ctx) => {
  //     const queryClient = ctx.context.queryClient
  //     const cachedData = queryClient.getQueryData<Array<Todo>>(['todos'])
  //
  //     if (!cachedData) {
  //       console.log('\nPrefetching todos...')
  //       // https://tanstack.com/query/latest/docs/framework/react/guides/prefetching
  //       // prefetchQuery returns Promise<void>
  //       await queryClient.prefetchQuery({
  //         queryKey: ['todos'],
  //         queryFn: getTodosQueryFn,
  //         retry: 3 // Explicitly enable retries
  //       })
  //     } else {
  //       console.log('\nThe todos are already cached.')
  //     }
  //   }
  //
  ///////////////////////////////////////////////////////////////////////////
})

/* ========================================================================

======================================================================== */

function TanStackQueryDemo() {
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
          <Database strokeWidth={1} className='mr-2 inline size-[1em]' />
          _TS QUERY
        </h1>

        <section className='bg-card mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-xl border p-4 shadow-xl'>
          <TodoForm />
          <TodoList />
        </section>
      </PageContainer>
    </Page>
  )
}
