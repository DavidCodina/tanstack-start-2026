export {}

// import * as React from 'react'

// import { createFileRoute, useRouter } from '@tanstack/react-router'
// import {
//   // AlertCircle,
//   FlaskConical
// } from 'lucide-react'
// import type { ResponsePromise } from '@/types'
// import {
//   // Alert,
//   // Button,
//   DataContainer,
//   Page,
//   PageContainer
// } from '@/components'
// import { codes, randomFail, sleep } from '@/utils'

// /* ======================

// ====================== */

// const getData = async () => {
//   await sleep(2500)

//   if (randomFail()) {
//     throw new Error('A random error occurred.')
//   }

//   return {
//     code: codes.OK,
//     data: {
//       test: 'Testing 123...'
//     },
//     message: 'success',
//     success: true
//   }
// }

// /* ======================

// ====================== */

// type Data = { test: string }

// type DataComponentProps = {
//   dataPromise: ResponsePromise<Data>
// }

// const DataComponent = ({ dataPromise }: DataComponentProps) => {
//   const loaderData = React.use(dataPromise)

//   return (
//     <pre className='bg-card mx-auto mb-6 max-w-[500px] overflow-scroll rounded-lg border p-4 text-sm shadow'>
//       {JSON.stringify(loaderData, null, 2)}
//     </pre>
//   )
// }

// /* ======================

// ====================== */

// export const Route = createFileRoute('/(demo)/suspense/')({
//   component: PageSuspense,
//   validateSearch: (search: Record<string, unknown>) => search,
//   loader: async (_ctx) => {
//     // In this case we're returning an unresolved Promise.
//     const dataPromise = getData()
//     return { dataPromise }
//   }
// })

// /* ========================================================================

// ======================================================================== */

// function PageSuspense() {
//   const loaderData = Route.useLoaderData()
//   const router = useRouter()

//   /* ======================
//           return
//   ====================== */

//   return (
//     <Page>
//       <PageContainer>
//         <h1 className='mb-6 rounded text-center text-6xl font-thin tracking-tight uppercase'>
//           <FlaskConical className='inline size-[1em]' /> Suspense Demo
//         </h1>

//         <DataContainer
//           // errorMessage='Unable to load the data.'
//           // fallback={
//           //   <div className='text-destructive text-center text-6xl font-bold'>
//           //     Something bad happened!
//           //   </div>
//           // }

//           ///////////////////////////////////////////////////////////////////////////
//           //
//           // Gotcha: When you click the Reset button, resetErrorBoundary() is called.
//           // At the same time, the ErrorBoundary onReset is triggered. However, in
//           // this case, we need router.invalidate() to happen BEFORE resetErrorBoundary().
//           // Otherwise, the ErrorBoundary resets and re-renders children with same dataPromise.
//           // Same promise throws again → ErrorBoundary shows fallback again.
//           //
//           // In practice, this means that we need to expose resetErrorBoundary and only
//           // call it after router.invalidate().
//           //
//           ///////////////////////////////////////////////////////////////////////////
//           handleResetErrorBoundary={async (resetErrorBoundary) => {
//             await router.invalidate()
//             resetErrorBoundary()
//           }}
//           ///////////////////////////////////////////////////////////////////////////
//           //
//           // resetErroBoundary can also be exposed through a full fallbackRender implementation:
//           //
//           // fallbackRender={(fallbackProps) => {
//           //   const { error, resetErrorBoundary } = fallbackProps
//           //   const originalError = error instanceof Error ? error.message : ''
//           //
//           //   return (
//           //     <Alert
//           //       className='mx-auto mb-6 max-w-[600px]'
//           //       leftSection={<AlertCircle className='size-6' />}
//           //       rightSection={
//           //         <Button
//           //           className='min-w-[100px] self-center'
//           //           onClick={async () => {
//           //             await router.invalidate()
//           //             resetErrorBoundary()
//           //           }}
//           //           size='sm'
//           //           variant='destructive'
//           //         >
//           //           Reset
//           //         </Button>
//           //       }
//           //       title='Error'
//           //       variant='destructive'
//           //     >
//           //       {originalError}
//           //     </Alert>
//           //   )
//           // }}
//           //
//           ///////////////////////////////////////////////////////////////////////////

//           // onError={(_error, _info) => {
//           //   console.log('\nAn error occurred! \n.')
//           // }}

//           // onReset={async (_details) => {
//           //   // const { reason } = _details
//           //   console.log('\nThe error boundary was reset! \n.')
//           // }}
//           showOriginalError
//           suspenseFallback={
//             <div className='text-center text-6xl font-bold'>Loading...</div>
//           }
//         >
//           <DataComponent dataPromise={loaderData.dataPromise} />
//         </DataContainer>
//       </PageContainer>
//     </Page>
//   )
// }
