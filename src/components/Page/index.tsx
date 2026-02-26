'use client'

import { PageContainer } from './PageContainer'
import type { ComponentProps } from 'react'
import type { CurrentPageLoaderProps } from '@/components'
import { CurrentPageLoader } from '@/components'
import { cn } from '@/utils'

type PageProps = ComponentProps<'main'> & {
  currentPageLoader?: boolean
  currentPageLoaderProps?: CurrentPageLoaderProps
}

/* ========================================================================
                                  Page
======================================================================== */

const Page = ({
  children,
  className = '',
  currentPageLoader = false,
  currentPageLoaderProps = {},
  style = {},
  ...otherProps
}: PageProps) => {
  /* ======================
          return
  ====================== */

  return (
    <>
      <main
        data-slot='page'
        ///////////////////////////////////////////////////////////////////////////
        //
        // ⚠️ New: Changed `overflow-x-auto` here to `overflow-hidden` and put `overflow-x-auto`
        // on Pagecontainer. Note: Some kind of overlflow strategy is necessary in order to
        // prevent a right-aligned, defaultCollapsible='none' Sidebar from getting pushed off
        // the right side of the viewport when content gets scrunched.
        //
        // ⚠️ Normally, this would also be added: min-h-dvh. However, using just flex-1 here
        // works because both SidebarProvider (flex min-h-svh) and SidebarInset (flex flex-1)
        // manage to set the height to at least 100% of the viewport height. In fact, if we
        // were to set min-h-dvh here, it would be too much height for the Sidebar component's
        // inset variant.
        //
        ///////////////////////////////////////////////////////////////////////////

        // ❌ min-h-dvh
        className={cn(
          `relative mx-auto flex min-h-dvh w-full flex-1 flex-wrap overflow-hidden`,
          className
        )}
        style={style}
        {...otherProps}
      >
        {currentPageLoader && <CurrentPageLoader {...currentPageLoaderProps} />}

        {children}
      </main>
    </>
  )
}

export { Page, PageContainer }
