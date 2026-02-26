import { useEffect, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { CircleCheckBig } from 'lucide-react'

import { TodoForm } from './-components/TodoForm'
import { TodoList } from './-components/TodoList'
import { Page, PageContainer } from '@/components'
import { getTodos } from '@/server-functions'
import { codes } from '@/utils'

export const Route = createFileRoute('/(demo)/todos/')({
  component: PageTodos,
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
///////////////////////////////////////////////////////////////////////////
//
// This version of PageTodos relies on router.invalidate() within handleAddTodo,
// handleDeleteTodo, and handleGetTodos().  This approach could work in the
// current page because the loader only loads data from one server function.
//
// However, if loader loaded data from multiple server functions, then we
// might want a more fine-grained approach such that each data subset is
// stored in its own state, and server functions are called as needed.
// That's the idea behind todos2.tsx.
//
///////////////////////////////////////////////////////////////////////////

function PageTodos() {
  const router = useRouter()
  const loaderData = Route.useLoaderData()
  const [invalidating, setInvalidating] = useState(false)

  /* ======================
      handleGetTodos()
  ====================== */

  const handleGetTodos = () => {
    setInvalidating(true)

    ///////////////////////////////////////////////////////////////////////////
    //
    // Note: I believe you can also call router.invalidate() against other routes.
    //
    //   router.invalidate({
    //     filter: (match) => match.routeId === '/demo/todos2/'
    //   })
    //
    //   router.invalidate({
    //     filter: (match) => ['/demo/todos/', '/demo/todos2/'].includes(match.routeId)
    //   })
    //
    // However, the default setting in router.tsx (i.e., default by default) is:
    //
    //     defaultStaleTime: 0
    //
    // This means that every time you go to a new page, it may show you stale data
    // briefly, but it will always rerun the loader in the background and update dynamically.
    // In practice, this means you should never need to call router.invalidate against a
    // different page, UNLESS you change defaultStaleTime, which is a HORRIBLE idea!
    //
    ///////////////////////////////////////////////////////////////////////////
    router.invalidate()
  }

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    setInvalidating(false) // eslint-disable-line
  }, [loaderData])

  /* ======================
          return
  ====================== */

  return (
    <Page>
      <PageContainer>
        <h1
          className='text-primary mb-12 text-center text-7xl'
          style={{
            fontFamily: 'Chakra Petch',
            fontWeight: 300,
            letterSpacing: '2vw'
          }}
        >
          <CircleCheckBig strokeWidth={1} className='inline size-[1em]' /> TODOS
        </h1>

        <section className='bg-card mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-xl border p-4 shadow-xl'>
          <TodoForm
            handleGetTodos={handleGetTodos}
            invalidating={invalidating}
          />
          <TodoList
            handleGetTodos={handleGetTodos}
            invalidating={invalidating}
            loaderData={loaderData}
          />
        </section>
      </PageContainer>
    </Page>
  )
}
