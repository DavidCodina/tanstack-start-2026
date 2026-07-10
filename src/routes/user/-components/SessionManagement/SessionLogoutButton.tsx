import * as React from 'react'
import { useRouter } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components'
import { cn } from '@/utils'

type SessionLogoutButtonProps = React.ComponentProps<typeof Button> & {
  sessionToken: string
}

/* ========================================================================

======================================================================== */

export const SessionLogoutButton = ({
  className = '',
  sessionToken = '',
  ...otherProps
}: SessionLogoutButtonProps) => {
  const router = useRouter()
  const [pending, setPending] = React.useState(false)

  /* ======================

  ====================== */

  const handleRevokeSession = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    setPending(true)

    try {
      // https://better-auth.com/docs/concepts/session-management#revoke-session
      const { data, error } = await authClient.revokeSession({
        token: sessionToken
      })

      if (error) {
        toast.error(`Unable to revoke session: ${sessionToken}`)
        return
      }

      if (data) {
        toast.success(`Session revoked: ${sessionToken}`)
        // In this case the sessions were obtained through the server-side API in
        // the parent component by using getUserSessions() server function.
        // That data is now stale. In order to get fresh sessions data, refresh the page
        //# Test behavior with/without this.
        router.invalidate()
        return
      }
    } catch (_err) {
      toast.error(`Unable to revoke session: ${sessionToken}`)
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
      className={cn('absolute top-2 right-2', className)}
      isIcon
      loading={pending}
      onClick={handleRevokeSession}
      title='Log Out Of Session'
      variant='destructive'
    >
      <Trash2 className='size-4' />
    </Button>
  )
}
