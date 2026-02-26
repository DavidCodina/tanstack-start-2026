import { useSuspenseQuery } from '@tanstack/react-query'

import { getTodosQueryFn } from '../../-utils'
import { TodoItem } from './TodoItem'
// import { Alert, Button } from '@/components'

type TodoListProps = {}

/* ========================================================================

======================================================================== */

export const TodoList = (_props: TodoListProps) => {
  /* ======================
      useSuspenseQuery()
  ====================== */
  // ⚠️ Gotcha: even though you can destructure, isError, error, isPending, etc.
  // This is all essentially useless. In practice, errors bubble up and should
  // be handled by an error boundary, and pending state is handled by the Suspense
  // fallback.

  const {
    data
    // isError, error, isPending, isRefetching, refetch
  } = useSuspenseQuery({
    queryKey: ['todos'],
    queryFn: getTodosQueryFn,
    retry: false // Use this when testing random errors to prevent it from later succeeding.
  })

  /* ======================
        renderTodos()
  ====================== */

  const renderTodos = () => {
    // if (isError) {
    //   return (
    //     <Alert
    //       className='dark:bg-(--destructive-soft)/15'
    //       rightSection={
    //         <Button
    //           className='self-center'
    //           loading={isRefetching}
    //           onClick={() => refetch()}
    //           variant='destructive'
    //           size='sm'
    //         >
    //           {isRefetching ? 'Loading...' : 'Retry'}
    //         </Button>
    //       }
    //       title='Error'
    //       variant='destructive'
    //     >
    //       <p>
    //         {error.message} - {error.code}
    //       </p>
    //     </Alert>
    //   )
    // }

    // if (isPending) {
    //   return (
    //     <div className='text-center text-2xl font-bold text-sky-500'>
    //       Loading...
    //     </div>
    //   )
    // }

    if (data && Array.isArray(data) && data.length > 0) {
      return (
        <ul className='space-y-4'>
          {data.map((item) => (
            <TodoItem key={item.id} item={item} />
          ))}
        </ul>
      )
    }

    return null
  }

  /* ======================
          return 
  ====================== */

  return renderTodos()
}
