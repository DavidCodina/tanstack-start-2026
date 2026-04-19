import { useEffect, useRef, useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Loader2, Pencil, PencilOff, Trash2 } from 'lucide-react'

import type { Todo } from '@/types'
import { deleteTodo, updateTodo } from '@/server-functions'
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
  const router = useRouter()

  const [value, setValue] = useState(item.name)
  const [isEditable, setIsEditable] = useState(false)
  const [deletePending, setDeletePending] = useState(false)
  const [updatePending, setUpdatePending] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  /* ======================
      handleUpdateTodo()
  ====================== */

  const handleUpdateTodo = async (todoId: string) => {
    setUpdatePending(true)

    try {
      const { errors, message, success } = await updateTodo({
        data: {
          id: todoId,
          name: value
        }
      })

      if (success !== true) {
        if (errors?.name) {
          toast.error(errors.name)
        } else {
          toast.error(message)
        }
        return
      }

      setIsEditable(false)
      router.invalidate()
    } catch {
    } finally {
      setUpdatePending(false)
    }
  }

  /* ======================
      handleDeleteTodo()
  ====================== */

  const handleDeleteTodo = async (todoId: string) => {
    setDeletePending(true)

    try {
      const { success } = await deleteTodo({ data: { id: todoId } })

      if (success !== true) {
        toast.error('Unable to delete todo.')
        return
      }
      router.invalidate()
    } catch {
    } finally {
      setDeletePending(false)
    }
  }

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
          type='button'
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
            handleDeleteTodo(item.id)
          }}
          title='Delete Item'
          type='button'
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
        <li className='bg-card flex gap-2 rounded-lg border pr-2 pl-0 shadow-md'>
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
                handleUpdateTodo(item.id)
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
        <Link className='flex gap-2' to={`/todos/$id`} params={{ id: item.id }}>
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
