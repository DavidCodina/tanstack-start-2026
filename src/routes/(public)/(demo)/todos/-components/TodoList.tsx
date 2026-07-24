import { TodoItem } from './TodoItem'
import type { ResBody, Todo } from '@/types'
import { Alert, Button } from '@/components'

type TodoListProps = {
  handleGetTodos: () => void
  invalidating: boolean
  loaderData: ResBody<Array<Todo> | null>
}

/* ========================================================================

======================================================================== */

export const TodoList = ({
  handleGetTodos,
  invalidating,
  loaderData
}: TodoListProps) => {
  const { data: todos, success: todosSuccess } = loaderData

  /* ======================
        renderTodos()
  ====================== */

  const renderTodos = () => {
    if (todosSuccess !== true) {
      return (
        <Alert
          className='dark:bg-(--destructive-soft)/15'
          rightSection={
            <Button
              className='self-center'
              loading={invalidating}
              onClick={handleGetTodos}
              variant='destructive'
              size='sm'
            >
              {invalidating ? 'Loading...' : 'Retry'}
            </Button>
          }
          title='Error'
          variant='destructive'
        >
          <p>Unable to get todos.</p>
        </Alert>
      )
    }

    if (!Array.isArray(todos) || todos.length === 0) {
      return null
    }

    return (
      <ul className='space-y-4'>
        {[...todos].reverse().map((item) => {
          return <TodoItem key={item.id} item={item} />
        })}
      </ul>
    )
  }

  /* ======================
          return
  ====================== */

  return renderTodos()
}
