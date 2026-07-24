import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components'
import { cn } from '@/utils'

type LogoutEverywhereButton = React.ComponentProps<typeof Button>

/* ========================================================================

======================================================================== */
// https://github.com/codinginflow/better-auth-tutorial/blob/final-project/src/app/(main)/profile/logout-everywhere-button.tsx
// This will log the user out on all devices. It destroys all the sessions, and is
// an important security feature.
// To test this, open an icognito browser tab and log in with the same user/account.

export const LogoutEverywhereButton = ({
  className = '',
  ...otherProps
}: LogoutEverywhereButton) => {
  const navigate = useNavigate()
  const [pending, setPending] = React.useState(false)

  /* ======================

  ====================== */

  const handleLogoutEverywhere = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    setPending(true)

    try {
      ///////////////////////////////////////////////////////////////////////////
      //
      // https://better-auth.com/docs/concepts/session-management#revoke-all-sessions
      //
      // Note: if you're caching sessions, then revoking a session may not take effect
      // until the cached time expires.
      //
      ///////////////////////////////////////////////////////////////////////////
      const { data, error } = await authClient.revokeSessions()

      if (error) {
        toast.error('Unable to log out everywhere.')
        return
      }

      if (data) {
        toast.success('Logged out from all devices')

        // Seems like we can also navigate by using router...
        // const router = useRouter()
        // router.navigate({ to: '/login' })
        navigate({
          to: '/login'
        })
        return
      }
    } catch (_err) {
      toast.error('Unable to log out everywhere.')
    } finally {
      setPending(false)
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <Button
      {...otherProps}
      className={cn('flex w-full', className)}
      loading={pending}
      onClick={handleLogoutEverywhere}
      size='sm'
      variant='warning'
    >
      {pending ? 'Logging Out...' : 'Log Out Everywhere'}
    </Button>
  )
}
