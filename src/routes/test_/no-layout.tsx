import { createFileRoute } from '@tanstack/react-router'
import { FlaskConical } from 'lucide-react'

import { Page, PageContainer } from '@/components'

/* ======================

====================== */

export const Route = createFileRoute('/test_/no-layout')({
  component: PageTest
})

/* ========================================================================

======================================================================== */

function PageTest() {
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
          _NO LAYOUT
        </h1>

        <p className='mx-auto max-w-[600px]'>
          This page is simply intended to demonstrate that the{' '}
          <code className='text-pink-500'>test_</code> folder maintains the path
          structure, but allows us to get out of using the{' '}
          <code className='text-pink-500'>route.tsx</code> in the actual{' '}
          <code className='text-pink-500'>test/route.tsx</code> folder.
        </p>
      </PageContainer>
    </Page>
  )
}
