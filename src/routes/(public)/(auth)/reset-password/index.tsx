import { createFileRoute /* , useRouter */ } from '@tanstack/react-router'
import { ResetPasswordForm } from './-components/ResetPasswordForm'
import { Page, PageContainer } from '@/components'

export const Route = createFileRoute('/(public)/(auth)/reset-password/')({
  component: PageResetPassword
})

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// In the coding in flow tutorial, it can detect if there's no token in the URL.
// https://github.com/codinginflow/better-auth-tutorial/blob/final-project/src/app/(auth)/reset-password/page.tsx
// He implements an alert in this page if there's no token search parameter in the URL.
// However, if you're using the new Next.js cacheComponents:true feature, then you'll instead
// want to pass searchParams diretly into the ResetPasswordForm component.
// Alternatively, you can implement useSearchParams() internally.
//
// The '/reset-password' route must be treated as a public route, so that
// a OAuth user can go through the create password flow initiated by the
// <CreatePasswordButton />.
//
///////////////////////////////////////////////////////////////////////////

function PageResetPassword() {
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
          _RESET PASSWORD
        </h1>

        <ResetPasswordForm />
      </PageContainer>
    </Page>
  )
}
