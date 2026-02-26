import { Suspense } from 'react'
import { sleep } from '@/utils'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This is a Suspense demo based off of the OLD React docs. It shows how
// one can implement Suspense for data fetching. It's super verbose, which
// is probably why no one currently uses this approach. That said, a lot
// of this logic is abstracted away in Next.js SSR, and in that context
// Streaming/Suspense actually is quite common.
//
// Suspense for data fetching may also become more common in React 19 with the use() hook.
//
/////////////////////////
//
// Resources:
//
//   Brad Traversy Video: https://www.youtube.com/watch?v=NTDJ-NQ32_E
//   https://17.reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense
//   https://codesandbox.io/p/sandbox/frosty-hermann-bztrp?file=%2Fsrc%2FfakeApi.js
//
// See also:
//
//   Web Dev Cody:      https://www.youtube.com/watch?v=8YQXeqgSSeM&pp=ygUOcmVhY3Qgc3VzcGVuc2U%3D
//   Alessio Michelini: https://dev.to/darkmavis1980/a-practical-example-of-suspense-in-react-18-3lln
//
///////////////////////////////////////////////////////////////////////////

const wrapPromise = (promise: Promise<any>) => {
  let status: 'pending' | 'success' | 'error' = 'pending'
  let result: any

  const suspender = promise.then(
    (r: any) => {
      status = 'success'
      result = r
      return result
    },

    (err: any) => {
      status = 'error'
      result = err
      return err
    }
  )

  return {
    read() {
      if (status === 'pending') {
        throw suspender
      } else if (status === 'error') {
        throw result
      } else if (status === 'success') {
        return result
      }
    }
  }
}

const getPosts = async () => {
  await sleep(1000)
  return fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
    .then((res) => res.json())
    .catch((err) => err)
}

const getData = () => {
  const postsPromise = getPosts()

  return {
    posts: wrapPromise(postsPromise)
  }
}

const resource = getData()

/* ========================================================================

======================================================================== */

const PostsList = () => {
  const posts = resource.posts.read()

  // Remove ! to test it.
  if (!posts || !Array.isArray(posts)) {
    return (
      <div className='alert-red mx-auto mb-6 max-w-lg'>
        Whoops! There's no posts!
      </div>
    )
  }

  return (
    <ul className='mx-auto mb-6 w-11/12 max-w-2xl space-y-3 rounded-xl border border-black bg-white p-4 text-sm shadow'>
      {posts.map((post: any) => {
        return (
          <li key={post.id}>
            <span className='font-bold text-blue-500'>Title:</span> {post.title}
          </li>
        )
      })}
    </ul>
  )
}

/* ========================================================================

======================================================================== */

export const SuspenseDemo = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className='my-6 text-center text-3xl font-black text-blue-500'>
            Loading...
          </div>
        }
      >
        <PostsList />
      </Suspense>
    </>
  )
}
