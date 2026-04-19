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

/* ========================================================================
                              BadUseEffectDemo
======================================================================== */
// In this example, we have a useEffect that runs on mount and every time
// the id state changes. id changes whenever the button is clicked.
// So what's the problem here? The problem is that if we click the button
// all the way up to id 5, the UI will cycle through each data set briefly
// before finally arriving at user 5. That's not what we want. What we want
// is to merely show user 5.

export const BadUseEffectDemo = () => {
  const [id, setId] = useState<number>(1)
  const [data, setData] = useState<any>(null)
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('pending')

  /* ======================
         useEffect
  ====================== */

  useEffect(() => {
    setData(null) // eslint-disable-line
    setStatus('pending')

    getUser(id)
      .then((result) => {
        if (result.success === true) {
          setData(result.data)
          setStatus('success')
        }

        return result
      })
      .catch((_err) => {
        setStatus('error')
      })
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
        type='button'
      >
        User ID: {id}
      </button>

      {renderData()}
    </>
  )
}
