import { createFileRoute /* , useRouter */ } from '@tanstack/react-router'
import { Page, PageContainer } from '@/components'
import { InputPhoneDemo } from '@/components/InputPhone/demos'

export const Route = createFileRoute('/')({ component: PageHome })

/* ========================================================================

======================================================================== */
//# Update Tanstack Start specific dependencies.

//# Create ControlledInputDemo and UncontrolledInputDemo

//# Deep dive on latest recharts version.

function PageHome() {
  /* ======================
          return
  ====================== */

  return (
    <Page
    // currentPageLoader
    // currentPageLoaderProps={{
    //   className: 'border-3 border-dashed border-pink-500',
    //   routes: ['/tanstack-query']
    // }}
    >
      <PageContainer>
        <h1
          className='text-primary mb-12 text-center text-7xl'
          style={{
            fontFamily: 'Chakra Petch',
            fontWeight: 300,
            letterSpacing: '2vw'
          }}
        >
          _HOME
        </h1>

        <InputPhoneDemo />
      </PageContainer>
    </Page>
  )
}
