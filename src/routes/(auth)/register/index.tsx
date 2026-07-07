import { createFileRoute /* , useRouter */ } from '@tanstack/react-router'
import { RegisterForm } from './-components/RegisterForm'
import { Page, PageContainer } from '@/components'

export const Route = createFileRoute('/(auth)/register/')({
  component: PageRegister
})

/* ========================================================================

======================================================================== */

function PageRegister() {
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
          _REGISTER
        </h1>

        <RegisterForm />
      </PageContainer>
    </Page>
  )
}
