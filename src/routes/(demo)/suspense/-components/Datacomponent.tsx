import { Suspense, use } from 'react'
import type { ResponsePromise } from '@/types'

type Data = { test: string }

type DataComponentProps = {
  dataPromise: ResponsePromise<Data>
}

/* ========================================================================

======================================================================== */
// See Ankita Kulkarni at 2:19:45 : https://www.youtube.com/watch?v=G8D_n47rvoo

const DataComponent = ({ dataPromise }: DataComponentProps) => {
  const loaderData = use(dataPromise)

  return (
    <pre className='bg-card mx-auto mb-6 max-w-[500px] overflow-scroll rounded-lg border p-4 text-sm shadow'>
      {JSON.stringify(loaderData, null, 2)}
    </pre>
  )
}

/* ======================

====================== */

const DataComponentWithSuspense = (props: DataComponentProps) => {
  return (
    <Suspense
      fallback={
        <div className='text-primary text-center text-4xl font-light'>
          LOADING...
        </div>
      }
    >
      <DataComponent {...props} />
    </Suspense>
  )
}

export { DataComponentWithSuspense as DataComponent }
