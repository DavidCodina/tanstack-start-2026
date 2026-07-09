import { createFileRoute /* , useRouter */ } from '@tanstack/react-router'

import { ForgotPasswordForm } from './-components/ForgotPasswordForm'
import { Page, PageContainer } from '@/components'

export const Route = createFileRoute('/(auth)/forgot-password/')({
  component: PageForgotPassword
})

/* ========================================================================

======================================================================== */

function PageForgotPassword() {
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
          _FORGOT PASSWORD
        </h1>

        <ForgotPasswordForm />
      </PageContainer>
    </Page>
  )
}
