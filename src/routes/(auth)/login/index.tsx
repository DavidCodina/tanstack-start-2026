import { createFileRoute /* , useRouter */ } from '@tanstack/react-router'
import { LoginForm } from './-components/LoginForm'
import { Page, PageContainer } from '@/components'

export const Route = createFileRoute('/(auth)/login/')({ component: PageLogin })

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
