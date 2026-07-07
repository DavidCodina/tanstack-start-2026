import { useLoaderData } from '@tanstack/react-router'

/* ========================================================================

======================================================================== */

export const ServerSession = () => {
  // The useLoaderData hook returns the loader data from the closest
  // RouteMatch in the component tree. The loader in the '/user' page
  // returns { session }. The server session is intitially request and
  // returned from beforeLoad in the __root.tsx.
  const loaderData = useLoaderData({
    from: '/user/'
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
    <div className='mx-auto mb-6 max-w-[800px]'>
      <h2 className='text-primary mb-1 text-4xl font-black'>Server Session</h2>
      <pre className='bg-card overflow-scroll rounded-lg border p-4 text-sm shadow'>
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  )
}
