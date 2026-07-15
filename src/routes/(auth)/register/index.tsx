import * as React from 'react'
import { createFileRoute /* , useRouter */ } from '@tanstack/react-router'
import { z } from 'zod'
import { toast } from 'sonner'

// import { RegisterForm } from './-components/RegisterForm'
import { RegisterForm2 } from './-components/RegisterForm2'
import { Page, PageContainer } from '@/components'

const SearchParamsSchema = z.object({
  account_deleted: z.boolean().optional()
})

export const Route = createFileRoute('/(auth)/register/')({
  component: PageRegister,
  validateSearch: SearchParamsSchema
})

/* ========================================================================

======================================================================== */

function PageRegister() {
  const searchParams = Route.useSearch()
  const { account_deleted } = searchParams

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    if (account_deleted === true) {
      toast.success(
        'Your account has been deleted. Please ensure all other tabs/windows are closed for this application.',
        {
          duration: Infinity
        }
      )
    }
  }, [account_deleted])

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

        <RegisterForm2 />
      </PageContainer>
    </Page>
  )
}
