import * as React from 'react'

import {
  // ClientOnly,
  createFileRoute
  // useRouter
} from '@tanstack/react-router'

import {
  AwaitWithCatch,
  Button,
  Page,
  PageContainer,
  Spinner
} from '@/components'
import { codes, randomTrue, sleep } from '@/utils'

/* ======================

====================== */

const getData = async () => {
  await sleep(1500)

  if (randomTrue()) {
    // throw new Error('Loader-level error!')
    return {
      code: codes.INTERNAL_SERVER_ERROR,
      data: null,
      message: 'fail',
      success: false
    }
  }

  return {
    code: codes.OK,
    data: {
      test: 'Testing ABC123...'
    },
    message: 'success',
    success: true
  }
}

/* ======================

====================== */

export const Route = createFileRoute('/(demo)/await-with-catch/')({
  component: PageTest
  // loader: async (_ctx) => {
  //   const getDataPromise = getData()
  //   return { getDataPromise }
  // }
})

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This example entirely avoids using the loader. Instead, it memoizes the Promise
// directly in the component body, and uses suspenseKey to both regenerate the Promise
// and retrigger the Suspense boundary. Additionally, mounted state is used to mitigate
// potential hydration mismatches.
//
// This is an interesting pattern to know, but in practice it's still way easier to use the loader,
// but with the help of Tanstack Query. Instead, simply call queryClient.ensureQueryData() in the
// loader without awaiting it. Then just run useSuspenseQuery() in nested components where needed.
//
///////////////////////////////////////////////////////////////////////////

function PageTest() {
  //^ const router = useRouter()
  //^ const loaderData = Route.useLoaderData()
  const [suspenseKey, setSuspenseKey] = React.useState(0)
  const getDataPromise = React.useMemo(() => getData(), [suspenseKey]) // eslint-disable-line
  const [mounted, setMounted] = React.useState(false)

  /* ======================
        useEffect()
  ====================== */
  // getDataPromise will run initially on the server. Because it implements randomTrue(), this
  // means that it can lead to a hydration mismatch. Here we implement setMounted(true) to
  // mitigate this issue. Another alternative is to use ClientOnly.

  React.useEffect(() => {
    setMounted(true)
  }, [])

  /* ======================
          return
  ====================== */

  if (!mounted) {
    return null
  }

  return (
    <Page>
      <PageContainer>
        <h1
          className='text-primary mb-12 text-center text-4xl'
          style={{
            fontFamily: 'Chakra Petch',
            fontWeight: 300,
            letterSpacing: '2vw'
          }}
        >
          _AWAIT_WITH_CATCH
        </h1>

        <AwaitWithCatch
          noCatchBoundary={true}
          //^ alertProps={{
          //^   className: 'max-w-[400px]'
          //^ }}
          fallback={
            <div className='bg-card mx-auto mb-6 flex h-[194px] max-w-[500px] items-center justify-center overflow-scroll rounded-lg border p-4 text-sm shadow'>
              <Spinner
                className='size-12 text-blue-500'
                initialShowSpinner={true}
              />
            </div>
          }
          //^ onCatch={(err) => {
          //^   console.log(
          //^     '\n\nHey dummy! An error occurred!',
          //^     err.message,
          //^     '\n\n'
          //^   )
          //^ }}

          //^ onReset={(_errorComponentProps) => {
          //^   // const { error, info, reset } = errorComponentProps
          //^   router.invalidate()
          //^ }}
          //^ promise={loaderData.getDataPromise}
          promise={getDataPromise}
          suspenseKey={suspenseKey}
        >
          {(result) => {
            // if (randomTrue()) { throw new Error('Component-level error!') }

            ///////////////////////////////////////////////////////////////////////////
            //
            // For this specific example, I've set noCatchBoundary={true}. Why?
            // Because the getData() function always catches errors gracefully.
            // However, we still need a way to reset the internal <Await /> component.
            // We could simply use router.invalidate() but maybe we don't want to wipe
            // the entire page. Consequently, I've memoized getDataPromise in the component,
            // rather than passing it through the loader.
            // Now, we can update the suspenseKey, which also acts as a dep to the memoization.
            //
            ///////////////////////////////////////////////////////////////////////////
            return (
              <div className='mx-auto max-w-[500px] space-y-6'>
                <pre className='bg-card overflow-scroll rounded-lg border p-4 text-sm shadow'>
                  {JSON.stringify(result, null, 2)}
                </pre>

                {result.success === false && (
                  <Button
                    className='flex w-full'
                    onClick={async () => {
                      setSuspenseKey((key) => key + 1)
                    }}
                    size='sm'
                    variant='destructive'
                  >
                    Retry
                  </Button>
                )}
              </div>
            )
          }}
        </AwaitWithCatch>
      </PageContainer>
    </Page>
  )
}
