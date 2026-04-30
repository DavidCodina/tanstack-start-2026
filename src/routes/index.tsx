import { Link, createFileRoute /* , useRouter */ } from '@tanstack/react-router'
import { Page, PageContainer } from '@/components'

export const Route = createFileRoute('/')({ component: PageHome })

/* ========================================================================

======================================================================== */

//# Update Tanstack Start specific dependencies.
//# As part of this create a demo side-project with the CLI.
//# Note: newer builds may not even be using nitro() in vite.config.ts.
//# I didn't see it added in a more recent tutorial.
//# Note: .cta.json does this property: "chosenAddOns": ["eslint", "nitro", "start"]

//# Go bact to BasicSidebar.tsx and implement inactiveProps everywhere.

//# notFoundComponent in test/$id.tsx is not themed...
//# Check other similar notFoundComponent imlementations as well.

//# Review Tiptap demo, and possibly update DOMPurify logic to use a createClientOnlyFn().

//# Newer versions of Tanstack Start may also add THEME_INIT_SCRIPT to __root.tsx.

//# Review useSyncExternalStore()

//# Update TypeScript. Note "baseUrl" in tsconfig.json may now be deprecated.
//# Consult AI for new implementation syntax.

// Todo: Fix RTE / Lexical import issue (i.e., DomPurify/SSR friction)

//# Add Tanstack Table component.

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

        <Link to='/client-pagination' preload={false} replace>
          Client Pagination
        </Link>
      </PageContainer>
    </Page>
  )
}
