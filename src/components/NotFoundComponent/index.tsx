import { /* CircleArrowLeft, */ House, TriangleAlert } from 'lucide-react'
import { Link, useRouter /*, useRouterState */ } from '@tanstack/react-router'
import type {
  NotFoundRouteProps /*, useCanGoBack */
} from '@tanstack/react-router'
import { BackButton, Button, Page, PageContainer } from '@/components'

type Props = NotFoundRouteProps & {
  children?: React.ReactNode
  title?: string
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   notFoundComponent: (notFoundRouteProps) => {
//     return (
//       <NotFoundComponent
//         title={`NOT FOUND FROM '/test/'`}
//         {...notFoundRouteProps}
//       >{/* ... */}</NotFoundComponent>
//     )
//   }
//
///////////////////////////////////////////////////////////////////////////

export const NotFoundComponent = ({
  children,
  title = 'Not Found',
  ...otherProps
}: Props) => {
  const { data, isNotFound, routeId } = otherProps
  const mode = import.meta.env.MODE
  const isDevelopment = mode === 'development'
  const router = useRouter()
  const canGoBack = router.history.canGoBack()

  /* ======================
      renderDevInfo()
  ====================== */

  const renderDevInfo = () => {
    if (!isDevelopment) {
      return null
    }

    const devInfo = {
      isDevelopment,
      data,
      isNotFound,
      routeId,
      canGoBack
    }

    return (
      <pre className='bg-card relative mx-auto mb-8 max-w-[500px] overflow-scroll rounded-lg border border-dashed border-rose-500 p-4 text-sm text-rose-500 shadow'>
        <div className='absolute top-2 right-2 font-mono text-xs text-[10px] uppercase'>
          (Dev Only)
        </div>
        {JSON.stringify(devInfo, null, 2)}
      </pre>
    )
  }

  /* ======================
          return 
  ====================== */

  return (
    <Page>
      <PageContainer>
        <h1 className='mb-6 rounded text-center text-5xl font-thin tracking-tight text-rose-500'>
          <TriangleAlert className='mr-2 inline size-[1em] text-rose-500' />
          {title}
        </h1>

        <div className='mb-6 flex items-center justify-center gap-4'>
          <Button
            className='min-w-[120px]'
            leftSection={<House />}
            // You could do it like this, but children would be omitted.
            // render={<Link to='/' replace={true}>Go Home</Link>}
            render={<Link to='/' replace={true} />}
            size='sm'
            variant='destructive'
          >
            HOME
          </Button>

          {/* {canGoBack && (
            <Button
              className='min-w-[120px]'
              leftSection={<CircleArrowLeft />}
              onClick={() => { router.history.back()}}
              size='sm'
              variant='destructive'
            >Go Back</Button>
          )} */}

          <BackButton
            className='min-w-[120px]'
            nullNoBack
            // defaultBack='/'
            size='sm'
            variant='destructive'
          >
            Go Back
          </BackButton>
        </div>

        {renderDevInfo()}
        {children}
      </PageContainer>
    </Page>
  )
}
