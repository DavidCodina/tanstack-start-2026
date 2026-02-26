import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { addTodoMutationFn } from '../-utils'
import { Button } from '@/components'

const foscusVisibleMixin = `
outline-none
focus-visible:border-sky-500
focus-visible:ring-[3px]
focus-visible:ring-sky-500/50
`

/* ========================================================================

======================================================================== */

export const TodoForm = () => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // Rather than passing the refetch around from the original useQuery that got
  // the todos, we can recreate the query here. This is fine because useQuery
  // deduplicates fetches.
  //
  //   const { refetch } = useQuery<Array<Todo>>({ queryKey: ['todos'], queryFn: getTodosQueryFn })
  //
  // However, a cleaner approach is to implement the useQueryClient() hook. This is
  // more idiomatic and doesn't require TodoForm to know about the query at all.
  //
  ///////////////////////////////////////////////////////////////////////////

  const queryClient = useQueryClient()

  const refetchTodos = () => {
    return queryClient.refetchQueries({ queryKey: ['todos'] })
  }

  /* ======================
    POST : useMutation()
  ====================== */
  // Gotcha: if you want to type useMutation<Todo>(), you actually need to pass
  // all three generics: useMutation<TData, TError, TVariables>()
  // For example, useMutation<Todo, CustomError, string>()
  // That would be a huge pain to do everywhere. Fortunately, if you type
  // your actual mutationFn well, then useMutation() can infer the type.

  const { mutate: addTodo, isPending } = useMutation({
    mutationFn: addTodoMutationFn,

    onSuccess: () => {
      refetchTodos()
      setTodo('')
    },
    onError: () => {
      // # toast.error('Unable to add todo.')
    }
  })

  const [todo, setTodo] = useState('')
  const [isManualRefetching, setIsManualRefetching] = useState(false)

  /* ======================
       handleAddTodo()
  ====================== */

  const handleAddTodo = () => {
    addTodo(todo)
  }

  /* ======================
        renderForm()
  ====================== */

  const renderForm = () => {
    return (
      <form
        className='flex gap-4'
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <input
          className={`bg-card flex-1 rounded-lg border px-2 py-1 ${foscusVisibleMixin}`}
          onChange={(e) => setTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTodo()
            }
          }}
          placeholder='Enter a new todo...'
          type='text'
          value={todo}
        />
        <Button
          className='min-w-[100px]'
          disabled={todo.trim().length === 0 || isPending}
          loading={isPending}
          onClick={handleAddTodo}
          size='sm'
          type='button'
          variant='success'
        >
          {isPending ? 'Adding...' : 'Add Todo'}
        </Button>

        <Button
          className='min-w-[100px]'
          onClick={() => {
            setIsManualRefetching(true)
            refetchTodos()
              .catch((err) => err)
              .finally(() => {
                setIsManualRefetching(false)
              })
          }}
          size='sm'
          type='button'
          variant='sky'
        >
          {isManualRefetching ? 'Refreshing...' : 'Refresh'}
        </Button>
      </form>
    )
  }

  /* ======================
          return 
  ====================== */

  return renderForm()
}
