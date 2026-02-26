import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/utils'

type ScrollContainerProps = React.ComponentProps<'div'> & {
  scrollAmount?: number
}

/* ========================================================================

======================================================================== */
// Usage:
//
// <ScrollContainer className='bg-card border-primary mx-auto flex max-h-[200px] max-w-[800px] flex-col gap-4 rounded-lg border p-4 shadow-lg'>
//   {Array.from({ length: 15 }, (_, i) => (
//     <div key={i} className='bg-muted border-primary rounded border p-2'>
//       Item {i + 1}
//     </div>
//   ))}
// </ScrollContainer>

export function ScrollContainer({
  children,
  className = '',
  scrollAmount = 100,
  ...otherProps
}: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showUpArrow, setShowUpArrow] = useState(false)
  const [showDownArrow, setShowDownArrow] = useState(false)

  /* ======================
        checkScroll ()
  ====================== */

  const checkScroll = () => {
    const element = containerRef.current
    if (!element) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = element
    setShowUpArrow(scrollTop > 0)
    setShowDownArrow(scrollTop < scrollHeight - clientHeight - 1)
  }

  /* ======================

  ====================== */

  const scrollUp = () => {
    containerRef.current?.scrollBy({ top: -scrollAmount, behavior: 'smooth' })
  }

  const scrollDown = () => {
    containerRef.current?.scrollBy({ top: scrollAmount, behavior: 'smooth' })
  }

  /* ======================
         useEffect()
  ====================== */

  useEffect(() => {
    const element = containerRef.current
    if (!element) {
      return
    }

    // Check on mount
    checkScroll()

    // Listen for scroll events
    element.addEventListener('scroll', checkScroll)

    // Watch for content/size changes
    const resizeObserver = new ResizeObserver(checkScroll)
    resizeObserver.observe(element)

    return () => {
      element.removeEventListener('scroll', checkScroll)
      resizeObserver.disconnect()
    }
  }, [])

  /* ======================
    renderScrollUpArrow()  
  ====================== */

  const renderScrollUpArrow = () => {
    if (!showUpArrow) {
      return null
    }

    return (
      <button
        aria-label='Scroll up'
        className='absolute -top-1 left-1/2 z-10 -translate-x-1/2'
        onClick={scrollUp}
        type='button'
      >
        <ChevronUp strokeWidth={2.5} className='size-6' />
      </button>
    )
  }

  /* ======================
    renderScrollDownArrow()
  ====================== */

  const renderScrollDownArrow = () => {
    if (!showDownArrow) {
      return null
    }

    return (
      <button
        aria-label='Scroll down'
        className='absolute -bottom-1 left-1/2 z-10 -translate-x-1/2'
        onClick={scrollDown}
        type='button'
      >
        <ChevronDown strokeWidth={2.5} className='size-6' />
      </button>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <div {...otherProps} className={cn('relative')}>
      {renderScrollUpArrow()}

      <div ref={containerRef} className={`overflow-y-auto ${className}`}>
        {children}
      </div>

      {renderScrollDownArrow()}
    </div>
  )
}
