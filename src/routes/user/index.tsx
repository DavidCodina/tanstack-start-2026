import { createFileRoute /* , useRouter */ } from '@tanstack/react-router'
import { ServerSession } from './-components/ServerSession'
import { ClientSession } from './-components/ClientSession'

import { LinkAccounts } from './-components/LinkAccounts'
import { Profile } from './-components/Profile'
import { SessionManagement } from './-components/SessionManagement'
import { DeleteUserButton } from './-components/DeleteUserButton'
import { Page, PageContainer } from '@/components'

export const Route = createFileRoute('/user/')({
  component: PageUser,

  loader: async (param) => {
    const { context } = param
    const { session } = context
    // Access within page component with:   const loaderData = Route.useLoaderData()
    // Access within nested component with: const loaderData = useLoaderData({ from: '/user/' })
    return { session }
  }
})

/* ========================================================================

======================================================================== */

function PageUser() {
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
          _USER
        </h1>

        <LinkAccounts />

        <div className='mx-auto mb-6 max-w-[800px] space-y-6'>
          <Profile />
          <SessionManagement />
          <DeleteUserButton />
        </div>

        <ServerSession />
        <ClientSession />
      </PageContainer>
    </Page>
  )
}
