import { createFileRoute /* , useRouter */ } from '@tanstack/react-router'
import { Page, PageContainer } from '@/components'

//# import { SwitchDemo1 } from '@/components/Switch/demos/SwitchDemo1'

export const Route = createFileRoute('/')({ component: PageHome })

/* ========================================================================

======================================================================== */

//# Fix vite.config.ts so tests work correctly again.
//# This entails creating two separate projects for testing
//# See older Vite projects.
//# Also see backup Tanstack Start for pre-storybook __vite.config.ts

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

        {/* <SwitchDemo1 /> */}
      </PageContainer>
    </Page>
  )
}
