import { useEffect, useRef, useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Loader2, Pencil, PencilOff, Trash2 } from 'lucide-react'

import type { SafeUser } from '@/types'
import { deleteUser, updateUser } from '@/server-functions'
import { cn } from '@/utils'

type UserItemProps = {
  item: SafeUser
}

const foscusVisibleMixin = `
outline-none 
focus-visible:border-sky-500
focus-visible:ring-[3px] focus-visible:ring-sky-500/50
`

/* ========================================================================

======================================================================== */

export const UserItem = ({ item }: UserItemProps) => {
  const router = useRouter()

  const [value, setValue] = useState(item.username)
  const [isEditable, setIsEditable] = useState(false)
  const [deletePending, setDeletePending] = useState(false)
  const [updatePending, setUpdatePending] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  /* ======================
      handleUpdateUser()
  ====================== */

  const handleUpdateUser = async (userId: string) => {
    setUpdatePending(true)
    try {
      const { errors, message, success } = await updateUser({
        data: {
          id: userId,
          username: value
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

      toast.success('User updated.')
      setIsEditable(false)
      router.invalidate()
    } catch {
    } finally {
      setUpdatePending(false)
    }
  }

  /* ======================
      handleDeleteUser()
  ====================== */

  const handleDeleteUser = async (userId: string) => {
    setDeletePending(true)
    try {
      const result = await deleteUser({ data: { id: userId } })

      const { success } = result
      if (success !== true) {
        toast.error('Unable to delete user.')
        return
      }

      toast.success('User deleted.')
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
          return 
  ====================== */

  return (
    <li className='= bg-card flex gap-2 rounded-lg border pr-2 pl-0'>
      {isEditable ? (
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
              handleUpdateUser(item.id)
            }
          }}
          ref={inputRef}
          value={value}
        />
      ) : (
        <Link
          className='flex-1 py-1 pl-2 text-lg'
          to={`/users/$id`}
          params={{ id: item.id }}
        >
          {item.username}
        </Link>
      )}

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
          handleDeleteUser(item.id)
        }}
        title='Delete Item'
      >
        {deletePending ? (
          <Loader2 className='animate-spin' />
        ) : (
          <Trash2 className='hover:text-rose-500' />
        )}
      </button>
    </li>
  )
}
