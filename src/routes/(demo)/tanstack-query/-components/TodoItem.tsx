import { useEffect, useRef, useState } from 'react'

import { Link } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2, Pencil, PencilOff, Trash2 } from 'lucide-react'

import { deleteTodoMutationFn, updateTodoMutationFn } from '../-utils'
import type { Todo } from '@/types'
import { cn } from '@/utils'

type TodoItemProps = {
  item: Todo
}

const foscusVisibleMixin = `
outline-none 
focus-visible:border-sky-500
focus-visible:ring-[3px] focus-visible:ring-sky-500/50
`

/* ========================================================================

======================================================================== */

export const TodoItem = ({ item }: TodoItemProps) => {
  const queryClient = useQueryClient()
  const [value, setValue] = useState(item.name)
  const [isEditable, setIsEditable] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const refetchTodos = () => {
    return queryClient.refetchQueries({ queryKey: ['todos'] })
  }

  /* ======================
    PATCH : useMutation()
  ====================== */

  const { mutate: updateTodo, isPending: updatePending } = useMutation({
    mutationFn: updateTodoMutationFn,

    onSuccess: () => {
      setIsEditable(false)
      refetchTodos()
    },
    onError: () => {
      toast.error('Unable to update todo.')
    }
  })

  /* ======================
    DELETE : useMutation()
  ====================== */

  const { mutate: deleteTodo, isPending: deletePending } = useMutation({
    mutationFn: deleteTodoMutationFn,

    onSuccess: () => {
      refetchTodos()
    },
    onError: () => {
      toast.error('Unable to delete todo.')
    }
  })

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (isEditable) {
      inputRef.current?.focus()
    }
  }, [isEditable])

  /* ======================
      renderListItem ()
  ====================== */

  const renderListItem = () => {
    const buttons = (
      <>
        <button
          className='cursor-pointer'
          onClick={(e) => {
            e.preventDefault()
            setIsEditable((v) => !v)
          }}
          title='Edit Item'
        >
          {updatePending ? (
            <Loader2 className='animate-spin' />
          ) : isEditable ? (
            <PencilOff className='hover:text-sky-500' />
          ) : (
            <Pencil className='hover:text-sky-500' />
          )}
        </button>

        <button
          className='cursor-pointer'
          onClick={(e) => {
            e.preventDefault()
            deleteTodo(item.id)
          }}
          title='Delete Item'
        >
          {deletePending ? (
            <Loader2 className='animate-spin' />
          ) : (
            <Trash2 className='hover:text-rose-500' />
          )}
        </button>
      </>
    )

    if (isEditable) {
      return (
        <li
          key={item.id}
          className='bg-card flex gap-2 rounded-lg border pr-2 pl-0 shadow-md'
        >
          <input
            className={cn(
              `-m-px flex-1 rounded-lg border border-transparent py-1 pl-2 text-lg`,

              foscusVisibleMixin
            )}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            onKeyDown={(e) => {
              if (updatePending) {
                return
              }
              if (e.key === 'Enter') {
                updateTodo({ todoId: item.id, name: value })
              }
            }}
            ref={inputRef}
            value={value}
          />

          {buttons}
        </li>
      )
    }

    return (
      <li className='bg-card rounded-lg border pr-2 pl-0 shadow-md'>
        <Link
          className='flex gap-2'
          to={`/tanstack-query/$id`}
          params={{ id: item.id }}
        >
          <div className='flex-1 py-1 pl-2 text-lg'>{item.name}</div>
          {buttons}
        </Link>
      </li>
    )
  }

  /* ======================
          return
  ====================== */

  return renderListItem()
}
