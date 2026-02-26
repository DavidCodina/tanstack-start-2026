import * as React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Users } from 'lucide-react'

import { CreateUserForm } from './-components/CreateUserForm'
import { UserList } from './-components/UserList'
import { Page, PageContainer } from '@/components'
import { getUsers } from '@/server-functions'
import { codes } from '@/utils'

export const Route = createFileRoute('/(demo)/users/')({
  component: PageUsers,
  loader: async (_ctx) => {
    try {
      const getUsersResponse = await getUsers()
      return getUsersResponse
    } catch (_err) {
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: 'fail',
        success: false
      }
    }
  }
})

/* ========================================================================

======================================================================== */

function PageUsers() {
  const router = useRouter()
  const loaderData = Route.useLoaderData()
  const [invalidating, setInvalidating] = React.useState(false)

  /* ======================
      handleGetUsers()
  ====================== */

  const handleGetUsers = () => {
    setInvalidating(true)
    router.invalidate()
  }

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    setInvalidating(false)
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
          <Users strokeWidth={1} className='mr-2 inline size-[1em]' />
          _USERS
        </h1>

        <section className='mx-auto max-w-[600px] space-y-6'>
          <CreateUserForm />

          <UserList
            handleGetUsers={handleGetUsers}
            invalidating={invalidating}
            loaderData={loaderData}
          />
        </section>
      </PageContainer>
    </Page>
  )
}
