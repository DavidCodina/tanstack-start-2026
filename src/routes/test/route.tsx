import { Outlet, createFileRoute } from '@tanstack/react-router'
import { TriangleAlert } from 'lucide-react'
import { Page, PageContainer } from '@/components'

/* ========================================================================

======================================================================== */
// https://tanstack.com/router/v1/docs/framework/react/routing/routing-concepts#layout-routes
// https://www.youtube.com/watch?v=2TAOEK9IgTg (Pathless Layout discussed at 3:25)

// I believe route components can also be created by having a test.tsx file as a sibling to the
// test/ folder. However, because we also have a route.tsx here, it's unclear what would happen.

// See also Pathless Layout Routes:
// https://tanstack.com/router/v1/docs/framework/react/routing/routing-concepts#pathless-layout-routes
// https://github.com/TanStack/router/blob/main/examples/react/start-basic/src/routes/_pathlessLayout.tsx

export const Route = createFileRoute('/test')({
  component: LayoutComponent,

  notFoundComponent: (_ctx) => {
    return (
      <Page>
        <PageContainer>
          <h1 className='mb-6 rounded text-center text-6xl font-thin tracking-tight uppercase'>
            <TriangleAlert className='mr-2 inline size-[1em] text-yellow-500' />
            Resource Not Found (route.tsx)
          </h1>
        </PageContainer>
      </Page>
    )
  }
})

function LayoutComponent() {
  // Implement routerState.location.pathname from
  // useRouterState() to selectively show/hide layout UI.
  return (
    <div
      className={`relative mx-auto flex min-h-dvh w-full flex-1 flex-wrap overflow-hidden`}
      // style={{ outline: '4px dashed deeppink', outlineOffset: '-4px' }}
    >
      <Outlet />
    </div>
  )
}
