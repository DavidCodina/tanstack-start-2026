import { useEffect, useState } from 'react'

export const sleep = (delay = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

const getUser = async (id: number) => {
  await sleep(1500)
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    const json = await res.json()
    return {
      data: json,
      message: 'Success.',
      success: true
    }
  } catch (_err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}

// Tyler McGinnis
// https://www.youtube.com/watch?v=OrliU0e09io&t=14s
// "What we want to do is tell React to ignore anyresponses that come from requests
// that were made in effects that are no longer relevant. In order to do that, we need a way
// to know if an effect is the latest one. If not, then we should ignore the response... To
// do that we can leverage closures along with useEffect's cleanup function. Whenever the effect
// runs let's make a variable called ignore and set it to false. Then whenever the effect's cleanup
// function runs, which will only happen when another request has been made, we'll set ignore to true...
// Now all we have to do... is check if ignore is true. If it is we'll just do nothing. Now, regardless of how
// many times id changes, we'll ignore every response that isn't in the most recent effect."

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This example is based off of
// React docs:  https://react.dev/reference/react/useEffect#fetching-data-with-effects
// uidotdev:    https://www.youtube.com/watch?v=OrliU0e09io
// Theo Browne at: https://www.youtube.com/watch?v=xIflplz925Y
//
// It's also discussed in a Theo video around 12:45:
// https://www.youtube.com/watch?v=xIflplz925Y
// However, the point of that video is that doing this kind of thing,
// even when done correctly, is way too verbose, and using Tanstack
// Query is a much better approach. The other implication is that
// Tanstack Query also solves for the race condition problem.
//
// I actually don't often use this pattern because I don't normally have
// dependencies like this that change so quickly. That said, it's a good
// idea to do it like this.
//
///////////////////////////////////////////////////////////////////////////

export const GoodUseEffectDemo = () => {
  const [id, setId] = useState<number>(1)
  const [data, setData] = useState<any>(null)
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('pending')

  /* ======================
         useEffect
  ====================== */

  useEffect(() => {
    let ignore = false
    setData(null) // eslint-disable-line
    setStatus('pending')

    getUser(id)
      .then((result) => {
        if (!ignore) {
          if (result.success === true) {
            setData(result.data)
            setStatus('success')
          }
        } else {
          console.log(`ignore was true for user id: ${id}`)
        }

        return result
      })
      .catch((_err) => {
        setStatus('error')
      })

    ///////////////////////////////////////////////////////////////////////////
    //
    // Suppose an async call to get user 1 is made.
    // Each useEffect execution has its own ignore variable set to false initially.
    // Then we click the button below to get user 2.
    // This will trigger the cleanup function to run, which sets ignore to true.
    //
    // The important thing to note is that the ignore value is being set to true
    // specifically for the PREVIOUS execution. In other words, we're saying,
    // "Set ignore to true for the execution that was getting user 1."
    // This works because we're utilizing closures.
    //
    // Thus even if the result for user 1 comes in after the result for user 2,
    // we've already told the useEffect to ignore that result, (i.e., don't set it in state).
    //
    // By using the ignore variable and the cleanup function, the component ensures that only
    // the user data corresponding to the most recent userId state is rendered,
    // avoiding race conditions where outdated data might be displayed.
    //
    ///////////////////////////////////////////////////////////////////////////

    return () => {
      console.log('Cleanup function called.')
      ignore = true
    }
  }, [id])

  /* ======================
        renderData()
  ====================== */

  const renderData = () => {
    if (status === 'error') {
      return (
        <div className='mx-auto my-6 text-center text-3xl font-black text-red-500'>
          Error: Unable to get data.
        </div>
      )
    }

    if (status === 'pending') {
      return (
        <div className='mx-auto my-6 text-center text-3xl font-black text-blue-500'>
          Loading...
        </div>
      )
    }

    if (status === 'success' && typeof data === 'object') {
      return (
        <pre className='mx-auto mb-6 max-w-4xl overflow-x-scroll rounded-xl bg-gray-800 p-2 text-xs text-green-500'>
          {JSON.stringify(data, undefined, 2)}
        </pre>
      )
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <button
        className='btn-sm mx-auto mb-6 flex rounded-lg border border-blue-700 bg-blue-500 px-2 py-1 font-bold text-white'
        onClick={() => setId((v) => v + 1)}
      >
        User ID: {id}
      </button>

      {renderData()}
    </>
  )
}
