import { TodoItem } from './TodoItem'
import type { ResBody, Todo } from '@/types'
import { Alert, Button } from '@/components'

type TodoListProps = {
  handleGetTodos: () => void
  todosPending: boolean
  loaderData: ResBody<Array<Todo> | null>
}

/* ========================================================================

======================================================================== */

export const TodoList = ({
  handleGetTodos,
  loaderData,
  todosPending
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
              loading={todosPending}
              onClick={handleGetTodos}
              variant='destructive'
              size='sm'
            >
              {todosPending ? 'Loading...' : 'Retry'}
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
          return (
            <TodoItem
              key={item.id}
              handleGetTodos={handleGetTodos}
              item={item}
            />
          )
        })}
      </ul>
    )
  }

  /* ======================
          return
  ====================== */

  return renderTodos()
}
