import * as React from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import type { CreateUserData } from '@/types'
import { Button } from '@/components'
import { createUser } from '@/server-functions'

const inputClasses = `block w-full bg-card px-2 py-1 rounded border`

/* ========================================================================

======================================================================== */

export const CreateUserForm = () => {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  /* ======================
       handleSubmit()
  ====================== */

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()

    // Todo: validate data with Zod

    setIsSubmitting(true)
    const requestData: CreateUserData = {
      email,
      username,
      password
    }

    try {
      const { /* code,  message, */ data, success } = await createUser({
        data: requestData
      })

      if (success === true) {
        console.log('User data: ', data)
        toast.success('User created!')
        router.invalidate()
        return
      }
      toast.error('Unable to create user!')
    } catch (_err) {
      toast.error('Unable to create user!')
    } finally {
      setIsSubmitting(false)
      setEmail('')
      setUsername('')
      setPassword('')
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className='bg-card space-y-6 rounded-lg border p-6 shadow'
      >
        <input
          autoCapitalize='none'
          autoComplete='off'
          autoCorrect='off'
          className={inputClasses}
          name='email'
          placeholder='Email...'
          spellCheck={false}
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          autoCapitalize='none'
          autoComplete='off'
          autoCorrect='off'
          className={inputClasses}
          name='username'
          placeholder='Username...'
          spellCheck={false}
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          autoCapitalize='none'
          autoComplete='off'
          autoCorrect='off'
          className={inputClasses}
          name='password'
          placeholder='Password...'
          spellCheck={false}
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className='flex w-full'
          loading={isSubmitting}
          onClick={handleSubmit}
          size='sm'
          type='button'
          variant='success'
        >
          {isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </form>
    </>
  )
}
