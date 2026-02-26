'use client'

import { use, useEffect, useState } from 'react'
import type { JokeProps } from './types'

/* ========================================================================

======================================================================== */

export const Joke = ({ jokePromise }: JokeProps) => {
  const res = use(jokePromise)
  const [mounted, setMounted] = useState(false)

  /* ======================
          useEffect()
  ====================== */
  // Don't render the joke until the component is mounted.
  // This prevents a Next.js hydration mismatch error whereby
  // the joke on the server executed version differs from the
  // joke on the client rendered version.

  useEffect(() => {
    setMounted(true) // eslint-disable-line
  }, [])

  /* ======================
          return
  ====================== */

  if (!jokePromise || !mounted) {
    return null
  }

  return (
    <div className='border-dark mx-auto mb-6 max-w-[800px] rounded-lg border bg-white p-4 text-sm shadow-md'>
      {res.data.value}
    </div>
  )
}
