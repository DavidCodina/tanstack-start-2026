import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CircleCheckBig } from 'lucide-react'

import { TodoForm } from './-components/TodoForm'
import { TodoList } from './-components/TodoList'
import { Page, PageContainer } from '@/components'
import { getTodos } from '@/server-functions'
import { codes } from '@/utils'

export const Route = createFileRoute('/(demo)/todos2/')({
  component: PageTodos2,
  loader: async (_ctx) => {
    try {
      // ⚠️ getTodos() itself has an internal try/catch.
      // However, if you're using middleware, you can only throw or call next().
      // Consequently, always wrap server functions in try/catch when consuming.
      const getTodosResponse = await getTodos()
      return getTodosResponse
    } catch (_err) {
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: 'Internal Server Error',
        success: false
      }
    }
  }
})

/* ========================================================================

======================================================================== */
// In this version, we call handleGetTodos() instead of router.invalidate().
// This approach is more fine-grained, and would make sense if we had multiple
// server functions being called in the loader, and didn't want to reboot
// EVERYTHING.

function PageTodos2() {
  // const router = useRouter()
  const _loaderData = Route.useLoaderData()
  const [loaderData, setLoaderData] = useState(_loaderData)
  const [todosPending, setTodosPending] = useState(false)

  /* ======================
      handleGetTodos()
  ====================== */

  const handleGetTodos = async () => {
    setTodosPending(true)

    try {
      const res = await getTodos()
      setLoaderData(res)
      // Catches internally
    } finally {
      setTodosPending(false)
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <Page>
      <PageContainer>
        {/* <h1 className='mb-6 rounded text-center text-6xl font-thin tracking-tight uppercase'>
          <CircleCheckBig className='inline size-[1em]' /> Todos 2
        </h1> */}

        <h1
          className='text-primary mb-12 text-center text-7xl'
          style={{
            fontFamily: 'Chakra Petch',
            fontWeight: 300,
            letterSpacing: '2vw'
          }}
        >
          <CircleCheckBig strokeWidth={1} className='inline size-[1em]' /> TODOS
          2
        </h1>

        <section className='bg-card mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-xl border p-4 shadow-xl'>
          <TodoForm
            todosPending={todosPending}
            handleGetTodos={handleGetTodos}
          />
          <TodoList
            handleGetTodos={handleGetTodos}
            loaderData={loaderData}
            todosPending={todosPending}
          />
        </section>
      </PageContainer>
    </Page>
  )
}
