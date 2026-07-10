import * as React from 'react'
//! import dynamic from 'next/dynamic'

import { UpdateUserForm } from './UpdateUserForm'
import { UpdateEmailForm } from './UpdateEmailForm'
import { UpdatePasswordForm } from './UpdatePasswordForm'

import { getUserAccounts } from './getUserAccounts'
import { CreatePasswordButton } from './CreatePasswordButton'
import type { GetUserAccountsResponseBody } from './getUserAccounts'

import { authClient } from '@/lib/auth-client'

type UserAccountsState = GetUserAccountsResponseBody['data']

//# To what extent does Better Auth support cross-tab synchronization?
//# Test it out in two separate tabs.

/* ========================================================================

======================================================================== */
// Coding in Flow at 1:42:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0

export const Profile = () => {
  const [userAccounts, setUserAccounts] =
    React.useState<UserAccountsState>(null)

  const [userAccountsLoading, setUserAccountsLoading] = React.useState(true)

  const hasCredentialsAccount =
    Array.isArray(userAccounts) &&
    userAccounts.some((a) => a?.providerId === 'credential')

  const value = authClient.useSession()

  const { data, error, isPending /* refetch, isRefetching */ } = value
  const currentName = data?.user?.name || ''
  const currentEmail = data?.user?.email || ''
  const email = data?.user?.email || ''

  /* ======================
         useEffect()
  ====================== */

  React.useEffect(() => {
    setUserAccountsLoading(true) // eslint-disable-line
    getUserAccounts()
      .then((result) => {
        const { data } = result
        if (Array.isArray(data)) {
          setUserAccounts(data)
        }
        return result
      })
      .catch((err) => err)
      .finally(() => {
        setUserAccountsLoading(false)
      })
  }, [])

  /* ======================
      renderPasswordUI()
  ====================== */
  // If a user has no 'credential' account, attempting to update the password from
  // within <UpdatePasswordForm /> will result in an error. Rather than rendering
  // <UpdatePasswordForm />, use hasCredentialsAccount to conditionally render
  // a <CreatePasswordButton />. WDS does something similar at 2:07:55
  // https://www.youtube.com/watch?v=WPiqNDapQrk
  //# But what does adding a password actually do?

  const renderPasswordUI = () => {
    if (userAccountsLoading) return null

    if (hasCredentialsAccount) {
      return <UpdatePasswordForm />
    }

    return <CreatePasswordButton email={email} />
  }

  /* ======================
      renderContent()
  ====================== */

  const renderContent = () => {
    if (error) {
      return (
        <div className='my-12 text-center text-4xl font-black text-red-500'>
          An error occurred.
        </div>
      )
    }

    if (isPending || userAccountsLoading) {
      // Todo: Add loading UI.
      return (
        <div className='text-primary my-12 text-center text-4xl font-black'>
          Loading...
        </div>
      )
    }

    if (!data) {
      return (
        <div className='my-12 text-center text-4xl font-black text-red-500'>
          No Client Session.
        </div>
      )
    }

    return (
      <>
        <UpdateUserForm currentName={currentName} />
        <UpdateEmailForm currentEmail={currentEmail} />

        {renderPasswordUI()}
      </>
    )
  }

  /* ======================
          return
  ====================== */

  return renderContent()
}
