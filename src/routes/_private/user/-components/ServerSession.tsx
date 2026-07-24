import { useLoaderData } from '@tanstack/react-router'

/* ========================================================================

======================================================================== */

export const ServerSession = () => {
  const loaderData = useLoaderData({
    from: '/_private/user/'
    // strict: false
  })

  const { session } = loaderData

  if (!session) {
    return (
      <div className='text-primary my-12 text-center text-4xl font-black'>
        No Server Session
      </div>
    )
  }

  return (
    <>
      <h2 className='text-primary mb-1 text-4xl font-black'>Server Session</h2>
      <pre className='bg-card overflow-scroll rounded-lg border p-4 text-sm shadow'>
        {JSON.stringify(session, null, 2)}
      </pre>
    </>
  )
}
