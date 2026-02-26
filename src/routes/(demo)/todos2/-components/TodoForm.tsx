import { useState } from 'react'

import { Button } from '@/components'
import { addTodo } from '@/server-functions'

type TodoFormProps = {
  handleGetTodos: () => Promise<void>
  todosPending: boolean
}

/* ========================================================================

======================================================================== */

export const TodoForm = ({ handleGetTodos, todosPending }: TodoFormProps) => {
  const [todo, setTodo] = useState('')
  const [addingTodo, setAddingTodo] = useState(false)

  /* ======================
       handleAddTodo()
  ====================== */

  const handleAddTodo = async () => {
    setAddingTodo(true)

    try {
      // ////////////////////////////////////////////////////////////////////////
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
      // ////////////////////////////////////////////////////////////////////////
      const { message, success } = await addTodo({ data: { name: todo } })

      if (success !== true) {
        // # toast.error('Unable to add todo.')
        alert(message)
        return
      }

      setTodo('')
      handleGetTodos()
      // ⚠️ This will actually refresh _loaderData, but it won't reinitialize the state.
      // For that you would need a useEffect in the parent component.
      // useEffect(() => { setLoaderData(_loaderData)  }, [_loaderData])
      // router.invalidate()
    } catch (_err) {
      // # toast.error('Unable to add todo.')
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
          {todosPending ? 'Refreshing...' : 'Refresh'}
        </Button>
      </form>
    )
  }

  /* ======================
          return
  ====================== */

  return renderForm()
}
