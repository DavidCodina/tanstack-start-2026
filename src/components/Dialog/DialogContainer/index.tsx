'use client'

import * as React from 'react'
import { cn } from '@/utils'

export type DialogContainerProps = React.ComponentProps<'div'> & {
  centered?: boolean
  fullscreen?: boolean
  scrollable?: boolean
}

const FULLSCREEN_MIXIN = `
w-dvw max-w-none h-full m-0
[&_[data-slot='dialog-popup']]:h-full
[&_[data-slot='dialog-popup']]:border-none
[&_[data-slot='dialog-body']]:overflow-y-auto
[&_[data-slot='dialog-popup']]:rounded-none
[&_[data-slot='dialog-header']]:rounded-none
[&_[data-slot='dialog-body']]:rounded-none
[&_[data-slot='dialog-footer']]:rounded-none
`

const SCROLLABLE_MIXIN = `
h-[calc(100%-var(--dialog-container-spacing)*2)]
[&_[data-slot='dialog-popup']]:max-h-full
[&_[data-slot='dialog-popup']]:overflow-hidden
[&_[data-slot='dialog-body']]:overflow-y-auto
`

const CENTERED_MIXIN = `
flex items-center
min-h-[calc(100%-var(--dialog-container-spacing)*2)] 
`

const baseClasses = `
[--dialog-container-spacing:24px]
[--dialog-border-radius:var(--radius-lg)]
[--dialog-accent-color:var(--color-primary)]
group fixed inset-0 
overflow-x-hidden overflow-y-auto 
pointer-events-none
z-50
`

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// In Radix and Base UI, the convention is to name the entire component 'Dialog'. However, in Bootstrap
// the 'dialog' (i.e., <div className='modal-dialog'>) refers to the part of the modal that
// contains/wraps the <div className='modal-content'>. This extra wrapper is useful
// for features like centering and scrolling. This implementation names that wrapper DialogContainer.
//
// Because DialogContainer sets
//
//   max-w-[calc(100%-var(--dialog-container-spacing)*2)]
//
// We can actually set width when consuming and it will always defer to the max width:
//
//   dialogContainerProps={{
//     style: { width: 800 }
//  }}
//
// Also if you wanted to change the horizontal/vertical spacing, do this:
//
//   dialogContainerProps={{
//     className: 'w-[800px] [--dialog-container-spacing:50px]'
//  }}
//
///////////////////////////////////////////////////////////////////////////

export const DialogContainer = ({
  centered = false,
  className = '',
  fullscreen = false,
  // By default this should be false (?) so that <select>s will be able to overflow.
  scrollable = false,
  ...otherProps
}: DialogContainerProps) => {
  /* ======================
          return
  ====================== */

  return (
    <div
      {...otherProps}
      data-slot='dialog-container'
      // Conditionally add data-fullscreen when fullscreen is true.
      // Used by DialogPopup to opt out of animation.
      {...(fullscreen ? { 'data-fullscreen': '' } : {})}
      className={cn(
        baseClasses,
        !fullscreen &&
          'mx-auto my-(--dialog-container-spacing) max-w-[calc(100%-var(--dialog-container-spacing)*2)]',
        fullscreen && FULLSCREEN_MIXIN,
        // scrollable will interfere with fullscreen
        scrollable && !fullscreen && SCROLLABLE_MIXIN,
        // centered is unnecessary if fullscreen
        centered && !fullscreen && CENTERED_MIXIN,
        className
      )}
    />
  )
}
