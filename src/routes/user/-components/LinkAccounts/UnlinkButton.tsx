import * as React from 'react'
import { toast } from 'sonner'
import { iconDictionary } from './iconDictionary'

import type { SupportedOAuthProvider } from '@/types'

import { authClient } from '@/lib/auth-client'
import { cn } from '@/utils'

type UnlinkButtonProps = React.ComponentProps<'button'> & {
  providerIdString: SupportedOAuthProvider | 'credential'
  accountIdString: string
  onSuccess: () => void
}

/* ========================================================================

======================================================================== */

export const UnlinkButton = ({
  className = '',
  onSuccess,
  providerIdString,
  accountIdString,
  ...otherProps
}: UnlinkButtonProps) => {
  const [loading, setLoading] = React.useState(false)

  /* ======================
        handleUnlink()
  ====================== */

  const handleUnlink = async (
    provider: SupportedOAuthProvider | 'credential'
  ) => {
    setLoading(true)

    try {
      ///////////////////////////////////////////////////////////////////////////
      //
      // https://better-auth.com/docs/concepts/users-accounts#account-unlinking
      // If the account doesn't exist, it will throw an error. Additionally, if the
      // user only has one account, unlinking will be prevented to stop account lockout
      // (unless allowUnlinkingAll is set to true).
      //
      // ⚠️ Strangely, unlike authClient.linkSocial() which provides a callbackURL option to
      // remount the target page, authClient.unlinkAccount() does NOT provide a callbackURL.
      // Why? linkSocial needs callbackURL because it leaves the page. This will not be noticeable
      // to the end user if they're ALREADY logged into the OAuth provider (e.g., my browser is
      // already logged into GitHUb, Google, and LinkedIn).
      //
      // authClient.linkSocial() triggers a full browser redirect to the OAuth provider,
      // and there's no way for that provider to invoke a JS callback in your app when it's done.
      //
      // Conversely, authClient.unlinkAccount() never leaves the page.
      //
      ///////////////////////////////////////////////////////////////////////////
      const { data, error } = await authClient.unlinkAccount({
        providerId: providerIdString,

        ///////////////////////////////////////////////////////////////////////////
        //
        // The accountId is optional to authClient.unlinkAccount(). It's a disambiguator, not a required field.
        // This would be important in cases where a single user had two different Google accounts.
        // However, the way the UI is currently set up, we're only showing the LinkSocialButton for
        // a given social provider if they don't ALREADY have a linked account for that social provider.
        // Consequently, the user can't actually add more than one acccunt for a given social proiver.
        //
        // Nonetheless, accountId is included here for completeness.
        //
        ///////////////////////////////////////////////////////////////////////////
        accountId: accountIdString
      })

      if (error) {
        if (error.code === 'FAILED_TO_UNLINK_LAST_ACCOUNT') {
          toast.error(
            `Error: The ${provider} account is the only account left. Unlinking is prohibited to prevent account lockout.`
          )
        } else {
          toast.error(`Error: Unable to unlink ${provider} account`)
        }

        return
      }

      if (data) {
        onSuccess?.()
        toast.success(`Successfully unlinked the ${provider} account`)
        return
      }
    } catch (_err) {
      toast.error(`Error: Unable to unlink ${provider} account`)
    } finally {
      setLoading(false)
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <button
      {...otherProps}
      children={
        <>
          {iconDictionary[providerIdString as keyof typeof iconDictionary] ||
            iconDictionary.default}
          {loading ? 'Unlinking...' : providerIdString}
        </>
      }
      className={cn(
        'bg-card flex cursor-pointer items-center gap-2 rounded border px-2 py-1 text-sm select-none',
        className,
        loading && 'pointer-events-none'
      )}
      onClick={() => {
        if (loading) {
          return
        }
        handleUnlink(providerIdString)
      }}
      title={`Unlink from ${providerIdString}`}
      type='button'
    />
  )
}
