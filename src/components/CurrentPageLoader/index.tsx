import * as React from 'react'
import { useRouterState } from '@tanstack/react-router'
import { Spinner } from '@/components'
import { cn } from '@/utils'

export type CurrentPageLoaderProps = React.ComponentProps<'div'> & {
  /** Pass an array of routes to opt-in to only specific routes. */
  routes?: string[]
}

const baseClasses = `
flex items-center justify-center
absolute inset-0 pointer-events-none
bg-black/10
z-51
`
/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/vercel/next.js/discussions/52568
// https://github.com/vercel/next.js/discussions/41934
//
// Usage from the Page component:
//
//   <Page
//     currentPageLoader
//     currentPageLoaderProps={{
//       className: 'border-3 border-dashed border-pink-500',
//       routes: ['/tanstack-query']
//     }}
//   >
//
///////////////////////////////////////////////////////////////////////////

export const CurrentPageLoader = ({
  className = '',
  routes,
  ...otherProps
}: CurrentPageLoaderProps) => {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  /* ======================
        useEffect()
  ====================== */

  // React.useEffect(() => {
  //   console.log('\n\nrouterState\n', routerState, '\n\n')
  // }, [routerState])

  /* ======================
          return
  ====================== */

  if (!routerState.isLoading) {
    return null
  }

  if (Array.isArray(routes) && !routes.includes(pathname)) {
    return null
  }

  return (
    <div
      aria-label='Loading'
      {...otherProps}
      // ⚠️ pointer-events-none allows the page to still be clickable.
      // However, certain things like alert() will block the transition.
      // Ultimately, we may choose to remove pointer-events-none.
      className={cn(baseClasses, className)}
      data-slot='current-page-loader'
    >
      <Spinner className='text-primary size-16' delay={500} />
    </div>
  )
}
