import { createFileRoute /* , useRouter */ } from '@tanstack/react-router'
import { Page, PageContainer } from '@/components'

export const Route = createFileRoute('/user/')({ component: PageUser })

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
      </PageContainer>
    </Page>
  )
}
