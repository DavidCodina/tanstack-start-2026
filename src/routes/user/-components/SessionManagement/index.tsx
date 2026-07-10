import * as React from 'react'
import { SessionLogoutButton } from './SessionLogoutButton'
import { LogoutEverywhereButton } from './LogoutEverywhereButton'
import { getUserSessions } from './getUserSessions'

import type { GetUserSessionsResponseBody } from './getUserSessions'
import { authClient } from '@/lib/auth-client'

type UserSessionsState = GetUserSessionsResponseBody['data']

/* ========================================================================

======================================================================== */
// WDS at 2:16:15 : https://www.youtube.com/watch?v=WPiqNDapQrk
// He uses ua-parser-js to get the user agent info.
// I did not do all that for this project, but if you want to show a more
// production-grade UI for some other project, then revisit that tutorial.

///////////////////////////////////////////////////////////////////////////
//
// One could also do this:
//
//   React.useEffect(() => {
//     authClient.listSessions().then((result) => {
//       // Save to state...
//       return result
//     })
//     .catch((err) => err)
//   }, [])
//
///////////////////////////////////////////////////////////////////////////

export const SessionManagement = () => {
  const value = authClient.useSession()
  const { data, isPending /* error, isRefetching, refetch */ } = value
  const session = data?.session
  const currentSessionToken = session?.token

  const [sessions, setSessions] = React.useState<UserSessionsState>(null)
  const [sessionsLoading, setSessionsLoading] = React.useState(true)

  /* ======================
        useEffect()
  ====================== */
  //# If you do it like this, then you need some way to refresh it later...

  React.useEffect(() => {
    setSessionsLoading(true) // eslint-disable-line
    getUserSessions()
      .then((result) => {
        const { data } = result
        if (Array.isArray(data)) {
          setSessions(data)
        }
        return result
      })
      .catch((err) => err)
      .finally(() => {
        setSessionsLoading(false)
      })
  }, [])

  /* ======================
          return
  ====================== */

  if (isPending || sessionsLoading) {
    // Todo: Add loading UI.
    return (
      <div className='text-primary my-12 text-center text-4xl font-black'>
        Loading...
      </div>
    )
  }

  if (!Array.isArray(sessions) || sessions.length === 0) {
    return (
      <div className='text-primary my-12 text-center text-4xl font-black'>
        No Server Sessions
      </div>
    )
  }

  return (
    <>
      <div className='bg-card rounded-lg border shadow'>
        <h3 className='mx-4 mt-4 text-lg font-medium'>Sessions:</h3>
        {sessions.map((item) => {
          const isCurrentSession = item.token === currentSessionToken

          return (
            <div key={item.token} className='relative'>
              {!isCurrentSession && (
                <SessionLogoutButton sessionToken={item.token} />
              )}

              <pre className='overflow-scroll p-4'>
                {isCurrentSession ? (
                  <span className='font-bold text-green-500'>
                    Current Session:
                  </span>
                ) : (
                  <span className='font-bold'>Other Session:</span>
                )}
                {JSON.stringify(item, null, 2)}
              </pre>
            </div>
          )
        })}
      </div>

      <LogoutEverywhereButton />
    </>
  )
}
