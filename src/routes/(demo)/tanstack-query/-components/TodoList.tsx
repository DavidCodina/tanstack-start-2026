import { useQuery } from '@tanstack/react-query'

import { getTodosQueryFn } from '../-utils'
import { TodoItem } from './TodoItem'
import { Alert, Button } from '@/components'

type TodoListProps = {}

/* ========================================================================

======================================================================== */

export const TodoList = (_props: TodoListProps) => {
  /* ======================
        useQuery()
  ====================== */
  // You could do this: useQuery<Array<Todo>>, but generally I avoid it.
  // Instead, just make sure the queryFn is well typed. Then useQuery() can
  // infer the data type.

  const { data, isError, error, isPending, isRefetching, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodosQueryFn,
    retry: false // Use this when testing random errors to prevent it from later succeeding.
    // https://tanstack.com/query/v5/docs/framework/react/guides/initial-query-data
    // ❌ initialData: undefined,
    // ...(initialData ? { initialData } : {})
    // staleTime: 0,        // Default
    // gcTime: 5 * 60 * 100 // Default (5 minutes)
  })

  /* ======================
        renderTodos()
  ====================== */

  const renderTodos = () => {
    // ////////////////////////////////////////////////////////////////////////
    //
    // Dominik is an advocate of the data-first/error-last approach.
    // In that case, if an error occurred on refetch(), you'd fall back to
    // the stale data, rather than showing the error when you still have stale data.
    // Both approaches have their merits, depending on what your goal is. Here, I've
    // opted for an error-first approach while testing the behavior.
    //
    // The real problem with the error-first approach is that a user can navigate to
    // a page with cached data, see it for a moment, then get error UI. That's super
    // confusing and bad UX.
    //
    // ////////////////////////////////////////////////////////////////////////

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

    // Even though we're prefetching in the loader, this UI
    // could still show when the browser is refreshed.
    if (isPending) {
      return (
        <div className='text-center text-2xl font-bold text-sky-500'>
          Loading...
        </div>
      )
    }

    if (data && Array.isArray(data) && data.length > 0) {
      return (
        <ul className='space-y-4'>
          {data.map((item) => (
            <TodoItem key={item.id} item={item} />
          ))}
        </ul>
      )
    }

    // if (isError) {
    //   return (
    //     <div className="flex items-center p-2 bg-rose-100/10 border border-rose-500 rounded-lg">
    //       <p className="text-rose-500 flex-1">{error.toString()}</p>
    //       <button
    //         disabled={isRefetching}
    //         className={cn(
    //           'bg-rose-500 text-white px-2 py-1 rounded font-semibold cursor-pointer',
    //           isRefetching && 'pointer-events-none',
    //         )}
    //         onClick={() => refetch()}
    //       >
    //         {isRefetching ? 'Loading...' : 'Retry'}
    //       </button>
    //     </div>
    //   )
    // }

    return null
  }

  /* ======================
          return
  ====================== */

  return renderTodos()
}
