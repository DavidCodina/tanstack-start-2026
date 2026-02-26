// import { createMiddleware } from '@tanstack/react-start'
import {
  Link,
  createFileRoute
  // getRouteApi,
  // notFound
  // useSearch
} from '@tanstack/react-router'
import { FlaskConical } from 'lucide-react'
import { Button, Page, PageContainer } from '@/components'

/* ======================

====================== */

// https://tanstack.com/router/latest/docs/framework/react/api/router/createFileRouteFunction
export const Route = createFileRoute('/test/nested/')({
  component: PageNested
})

/* ========================================================================

======================================================================== */

function PageNested() {
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
          <FlaskConical strokeWidth={1} className='mr-2 inline size-[1em]' />
          _NESTED
        </h1>

        <Button
          className='mx-auto my-12 flex w-fit'
          render={<Link to='..'>Test Page</Link>}
          variant='secondary'
        />
      </PageContainer>
    </Page>
  )
}
