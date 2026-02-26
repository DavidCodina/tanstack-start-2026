import { createFileRoute /* , useRouter */ } from '@tanstack/react-router'
import { Page, PageContainer } from '@/components'

//# import { SwitchDemo1 } from '@/components/Switch/demos/SwitchDemo1'

export const Route = createFileRoute('/')({ component: PageHome })

/* ========================================================================

======================================================================== */

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

        {/* <SwitchDemo1 /> */}
      </PageContainer>
    </Page>
  )
}
