import * as React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { toast } from 'sonner'

import { RegisterForm6 } from './-components/RegisterForm6'
import { Page, PageContainer } from '@/components'
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes'

const SearchParamsSchema = z.object({
  account_deleted: z.boolean().optional()
})

export const Route = createFileRoute('/(public)/(auth)/register/')({
  component: PageRegister,
  validateSearch: SearchParamsSchema,
  // Applied to '/login', '/register', '/forgot-password'
  beforeLoad: (param) => {
    const { context } = param
    const { session } = context
    const isLoggedIn = !!session

    if (isLoggedIn) {
      throw redirect({ to: DEFAULT_LOGIN_REDIRECT })
    }
  }
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

        <RegisterForm6 />
      </PageContainer>
    </Page>
  )
}
