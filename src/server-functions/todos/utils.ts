import fs from 'node:fs'
import type { Todo } from '@/types'

// Initially todos.json does not exist.
// But this line in addTodo() creates or replaces it:
// await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2))
export const TODOS_FILE = 'todos.json'

/* ========================================================================
                              readTodos()
======================================================================== */
// readTodos() is a utility function used within the getTodos() server function.

export async function readTodos() {
  const todos = JSON.parse(
    await fs.promises.readFile(TODOS_FILE, 'utf-8').catch(() =>
      JSON.stringify(
        [
          // { id: 1, name: 'Get groceries' },
          // { id: 2, name: 'Buy a new phone' },
        ],
        null,
        2
      )
    )
  ) as Array<Todo>
  return todos
}
