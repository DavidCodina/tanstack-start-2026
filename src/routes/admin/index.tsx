import { createFileRoute /* , useRouter */ } from '@tanstack/react-router'
import { Page, PageContainer } from '@/components'

export const Route = createFileRoute('/admin/')({ component: PageAdmin })

/* ========================================================================

======================================================================== */

function PageAdmin() {
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
          _ADMIN
        </h1>
      </PageContainer>
    </Page>
  )
}
