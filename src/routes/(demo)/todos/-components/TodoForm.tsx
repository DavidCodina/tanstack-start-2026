import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Button } from '@/components'
import { addTodo } from '@/server-functions'
import { getSerializedZodErrors } from '@/utils'

type TodoFormProps = {
  handleGetTodos: () => void
  invalidating: boolean
}

/* ========================================================================

======================================================================== */

export const TodoForm = ({ handleGetTodos, invalidating }: TodoFormProps) => {
  const router = useRouter()
  const [todo, setTodo] = useState('')
  const [addingTodo, setAddingTodo] = useState(false)

  /* ======================
       handleAddTodo()
  ====================== */

  const handleAddTodo = async () => {
    setAddingTodo(true)

    try {
      ///////////////////////////////////////////////////////////////////////////
      //
      // ⚠️ addTodo() itself has an internal try/catch.
      // However, if you're using middleware, you can only throw or call next().
      // Any thrown error can't be caught internally by the server function,
      // which is why it's a best practice to also use try/catch when consuming,
      // even if you don't think it's necessary.
      //
      // That said, I also think it's a best practice to not throw in middleware.
      // Instead, prefer passing context to the server function, and handling it
      // internally there. This way you can avoid potential uncaught errors.
      //
      // However, if you throw from .inputValidator(), then you will also need
      // to catch it here when consuming.
      //
      // Note: you generally don't need to wrap addTodo in useServerFn(addTodo)
      // when consuming on the client. However, this may still be necessary when
      // - Your server function uses redirect()
      // - Your server function returns notFound() responses
      //
      ///////////////////////////////////////////////////////////////////////////
      const { /* code, data, */ errors, message, success } = await addTodo({
        data: {
          name: todo
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

      setTodo('')
      router.invalidate()
      // toast.success('Todo added successfully.')
    } catch (err) {
      ///////////////////////////////////////////////////////////////////////////
      //
      // ❌ if (err instanceof ZodError) { ... }
      // The issue is that when a ZodError is thrown from inputValidator on the server,
      // it gets serialized (JSON) when sent to the client. After deserialization,
      // it’s a plain object, not a ZodError instance, so instanceof ZodError returns false.
      // The error is serialized when sent from the server to the client, so it loses its
      // prototype chain.
      //
      // You might think to then check for Zod properties like if ('issues' in err){...}.
      // However, that won't work either. TanStack Start is serializing the ZodError's issues
      // array into the error message as JSON. The client receives a plain Error with the
      // issues as a JSON string in err.message.
      //
      ///////////////////////////////////////////////////////////////////////////

      const maybeSerializedZodErrors = getSerializedZodErrors(err)
      if (maybeSerializedZodErrors) {
        const nameError = maybeSerializedZodErrors.name
        if (nameError) {
          toast.error(nameError)
          return
        }
      }

      ///////////////////////////////////////////////////////////////////////////
      //
      // If you're passing your own serialized errors on the server,
      // throw new Error(JSON.stringify({ name: 'That name sucks!' }))
      // You can do something like this on the client:
      //
      //   if (err instanceof Error) {
      //     if (isJSON(err.message)) {
      //       const parsedValue = JSON.parse(err.message)
      //       console.log('Custom serialized errors:', parsedValue)
      //     }
      //   }
      //
      ///////////////////////////////////////////////////////////////////////////

      // ⚠️ Ultimately, I decided against using .inputValidator().
      // ⚠️ I don't like the flow of throwing and then catching here.
      // ⚠️ Instead, I think it's a better convention to simply validate
      // ⚠️ at the top of .handler().
      toast.error('Unable to add todo.')
    } finally {
      setAddingTodo(false)
    }
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
          className='bg-card flex-1 rounded-lg border px-2 py-1 focus:border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none'
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
          disabled={todo.trim().length === 0}
          loading={addingTodo}
          onClick={handleAddTodo}
          size='sm'
          type='button'
          variant='success'
        >
          {addingTodo ? 'Adding...' : 'Add Todo'}
        </Button>

        <Button
          className='min-w-[100px]'
          onClick={handleGetTodos}
          size='sm'
          type='button'
          variant='sky'
        >
          {invalidating ? 'Refreshing...' : 'Refresh'}
        </Button>
      </form>
    )
  }

  /* ======================
          return 
  ====================== */

  return renderForm()
}
