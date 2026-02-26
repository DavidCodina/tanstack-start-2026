import * as React from 'react'
import { House, RotateCw, TriangleAlert } from 'lucide-react'
import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button, Page, PageContainer } from '@/components'
import { getTime } from '@/utils'

type Props = ErrorComponentProps & {
  beforeReset?: () => void
  children?: React.ReactNode
  invalidateRoute?: boolean
  title?: string
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   errorComponent: (errorComponentProps) => {
//     return (
//       <ErrorComponent
//         // beforeReset={async () => {}}
//         invalidateRoute
//         title={`ERROR FROM '/test/'`}
//         {...errorComponentProps}
//       >{/* ... */}</ErrorComponent>
//     )
//   }
//
/////////////////////////
//
// The component passed to the errorComponent property runs against errors that occur in
// beforeLoad and loader. If you omit the errorComponent from the current route component,
// it gets caught by the errorComponent in router.tsx. If you omit the errorComponent in
// router.tsx, it gets caught by the errorComponent in __root.tsx. Admittedly, the hierarchy
// of behavior is is a little unintuitive.
//
// errorComponent does not run for errors in the actual component logic. For that, use onCatch
//
///////////////////////////////////////////////////////////////////////////

export const ErrorComponent = ({
  beforeReset,
  children,
  invalidateRoute = false,
  title = 'Error',
  ...otherProps
}: Props) => {
  /* ======================
          state
  ====================== */

  const { error, info: _info, reset } = otherProps
  const mode = import.meta.env.MODE
  const isDevelopment = mode === 'development'

  const router = useRouter()
  const routerState = useRouterState()

  const [initialTime, setInitialTime] = React.useState(getTime())
  const [initialPathname] = React.useState(() => {
    return routerState.location.pathname
  })

  const isResetting =
    routerState.isLoading && routerState.location.pathname === initialPathname

  /* ======================
        handleReset()
  ====================== */

  const handleReset = async () => {
    setInitialTime('...')
    if (typeof beforeReset === 'function') {
      await beforeReset()
    }

    if (invalidateRoute === true) {
      await router.invalidate({
        filter: (match) => match.pathname === initialPathname
      })
    }

    // Always call reset() - even if you've already invalidated the route!
    reset()
  }

  /* ======================
      renderDevInfo()
  ====================== */

  const renderDevInfo = () => {
    if (!isDevelopment) {
      return null
    }

    const devInfo = {
      isDevelopment,
      time: initialTime,
      pathname: routerState.location.pathname,
      errorMessage: error.message,
      isLoading: routerState.isLoading
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

          <Button
            className='min-w-[120px]'
            leftSection={<RotateCw />}
            loading={isResetting}
            onClick={handleReset}
            size='sm'
            variant='destructive'
          >
            {isResetting ? 'Resetting...' : 'RESET'}
          </Button>
        </div>

        {renderDevInfo()}
        {children}
      </PageContainer>
    </Page>
  )
}
