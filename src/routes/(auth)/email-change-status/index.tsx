import { Link, createFileRoute, useSearch } from '@tanstack/react-router'
import { Page, PageContainer } from '@/components'

export const Route = createFileRoute('/(auth)/email-change-status/')({
  component: EmailChangeStatusPage,

  loader: async (param) => {
    const { context } = param
    const { session } = context
    return { session }
  }
})

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// src/routes/user/-components/Profiel/UpdateEmailForm.tsx redirects to here
// with:
//
//   const { data, error } = await authClient.changeEmail({
//     newEmail: zodData.newEmail,
//     callbackURL: '/email-change-status?new_email=' + zodData.newEmail
//   })
//
// This happens as part of the two-step process when the user initiates the
// change email flow. Because we're currently using sendChangeEmailConfirmation
// in auth.ts, the user is first asked to verify their current email. Once they
// do that, they are redirected here. At this point, Better Auth has already sent
// the actual verification to the NEW email address. Once they verify that, they
// are ALSO redirected here.
//
// Make sure this is a publically accessible route!
//
///////////////////////////////////////////////////////////////////////////

function EmailChangeStatusPage() {
  const { session } = Route.useLoaderData()
  const sessionEmail = session?.user.email
  const searchParams = useSearch({ strict: false })

  const { new_email: newEmail } = searchParams as {
    new_email?: string
  }

  /* ======================
      renderContent()
  ====================== */
  // Arguably, this

  const renderContent = () => {
    // Arguably, using createFileRoute's onCatch might be
    // more idiomatic. However, this gets the job done.

    if (!session) {
      return (
        <>
          <h1
            className='text-primary mb-12 text-center text-6xl'
            style={{
              fontFamily: 'Chakra Petch',
              fontWeight: 300,
              letterSpacing: '2vw'
            }}
          >
            _Email Status <br /> Unknown
          </h1>

          <div className='mx-auto max-w-140 text-center'>
            {/* <p>In order to conirm email status, you must be logged in.</p> */}

            <p className='text-balance'>
              If you recently verified an email change, it may have already gone
              through. Please{' '}
              <Link
                className='text-primary font-medium underline'
                to='/login'
                // target='_self'
              >
                Sign In
              </Link>{' '}
              to confirm.
            </p>
          </div>
        </>
      )
    }

    //# This MIGHT be an onCatch use case...
    if (!newEmail || typeof newEmail !== 'string') {
      return (
        <>
          <h1
            className='text-destructive mb-12 text-center text-6xl'
            style={{
              fontFamily: 'Chakra Petch',
              fontWeight: 300,
              letterSpacing: '2vw'
            }}
          >
            _Error
          </h1>

          <div className='mx-auto max-w-140 text-center'>
            <p className='text-destructive text-balance'>
              Unable to determine the status of the email change. The{' '}
              <span className='font-mono'>new_email</span> search parameter is
              missing from the URL.
            </p>
          </div>
        </>
      )
    }

    if (sessionEmail?.toLowerCase() === newEmail.toLowerCase()) {
      return (
        <>
          <h1
            className='text-primary mb-12 text-center text-6xl'
            style={{
              fontFamily: 'Chakra Petch',
              fontWeight: 300,
              letterSpacing: '2vw'
            }}
          >
            _New Email <br /> Verified
          </h1>

          <div className='mx-auto max-w-140 text-center'>
            <p className='text-balance'>
              The new email of <span className='text-pink-500'>{newEmail}</span>{' '}
              has been verified and your account has been updated.
            </p>
          </div>
        </>
      )
    }

    return (
      <>
        <h1
          className='text-primary mb-12 text-center text-6xl'
          style={{
            fontFamily: 'Chakra Petch',
            fontWeight: 300,
            letterSpacing: '2vw'
          }}
        >
          _Email Change <br /> Confirmed
        </h1>

        <div className='mx-auto max-w-140 text-center'>
          <p className='text-balance'>
            A verification link has been sent to your{' '}
            <span className='font-medium italic'>new</span> email at{' '}
            <span className='text-pink-500'>{newEmail}</span>
          </p>
        </div>
      </>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <Page>
      <PageContainer>{renderContent()}</PageContainer>
    </Page>
  )
}
