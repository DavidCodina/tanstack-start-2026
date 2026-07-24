import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from './-components/LoginForm'
import { Page, PageContainer } from '@/components'

import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes'

export const Route = createFileRoute('/(public)/(auth)/login/')({
  component: PageLogin,

  // Applied to '/login', '/register', '/forgot-password'
  beforeLoad: (param) => {
    const { context } = param
    const { session } = context
    const isLoggedIn = !!session

    if (isLoggedIn) {
      throw redirect({ to: DEFAULT_LOGIN_REDIRECT })
    }
  }
})

/* ========================================================================

======================================================================== */

function PageLogin() {
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
          _LOGIN
        </h1>

        <LoginForm />
      </PageContainer>
    </Page>
  )
}
