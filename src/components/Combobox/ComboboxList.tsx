import * as React from 'react'
import { Combobox } from '@base-ui/react/combobox'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useMergedRef } from '@/hooks'
import { cn } from '@/utils'

export type ComboboxListProps = Combobox.List.Props

///////////////////////////////////////////////////////////////////////////
//
// Here, we're arbitrarily constraining the max-height to 23rem or available height.
// This isn't necessary, but it can make large lists more readable.
// That said, there's no native ScrollUpArrow or ScrollDownArrow like there
// is in the Base UI Select, so user's may not be aware that there's even
// scrollable content.
//
// Solution: Implement custom scroll down/up arrows.
// Note: because we are creating the down/up arrows directly within
// the Combobox.List <div>, the associated buttons don't overlap the
// associated browser scrollbar. However, it's worth noting that the
// actual Base UI Select hides the scrollbar. This might be because the
// Select.ScrollUpArrow and Select.ScrollDownArrow are possibly sitting
// at a different level than the Select.List. What I do know is that
// it was actually quite tricky to figure out how to get the buttons
// to sit below the browser scrollbar, but above the rendered list items.
//
///////////////////////////////////////////////////////////////////////////

const baseClasses = `
relative bg-inherit
py-2
data-[empty]:p-0
outline-0
max-h-[min(23rem,var(--available-height))]
overflow-y-auto overscroll-none
`

/* ========================================================================

======================================================================== */
//# Make it so hovering on bars auto-scrolls the list up/down.

export const ComboboxList = ({
  className,
  ref,
  ...otherProps
}: ComboboxListProps) => {
  /* ======================
        refs & state
  ====================== */

  const internalRef = React.useRef<HTMLDivElement>(null)
  const mergedRef = useMergedRef(internalRef, ref)
  const [showUpArrow, setShowUpArrow] = React.useState(false)
  const [showDownArrow, setShowDownArrow] = React.useState(false)

  // const scrollAmount = 100

  /* ======================
        checkScroll()
  ====================== */

  const checkScroll = () => {
    const comboboxList = internalRef.current
    if (!comboboxList) {
      return
    }
    const { scrollTop, scrollHeight, clientHeight } = comboboxList

    let topOffset = 0
    let bottomOffset = 0
    // We actually want the last [data-slot="combobox-item"] and NOT
    // the last child. Why? Because in many cases, the last child will
    // actually be the scroll down button itself. Obviously, this depends
    // on ComboboxItem having the data-slot="combobox-item" attribute.
    const comboboxItems = comboboxList.querySelectorAll(
      '[data-slot="combobox-item"]'
    )
    if (comboboxItems.length > 0) {
      const firstComboboxItem = comboboxItems[0] as HTMLElement

      const lastComboboxItem = comboboxItems[
        comboboxItems.length - 1
      ] as HTMLElement

      topOffset = firstComboboxItem.offsetHeight
      bottomOffset = lastComboboxItem.offsetHeight
    }

    setShowUpArrow(scrollTop > topOffset)
    // That -1 at the end accounts for sub-pixel rounding, preventing the down
    // arrow from flickering when you're at the very bottom.
    setShowDownArrow(scrollTop < scrollHeight - clientHeight - bottomOffset - 1)
  }

  /* ======================
  scrollUp() + scrollDown()
  ====================== */

  // const scrollUp = () => {
  //   internalRef.current?.scrollBy({ top: -scrollAmount, behavior: 'smooth' })
  // }

  // const scrollDown = () => {
  //   internalRef.current?.scrollBy({ top: scrollAmount, behavior: 'smooth' })
  // }

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    const comboboxList = internalRef.current
    if (!comboboxList) {
      return
    }

    checkScroll() // Check on mount

    // Listen for scroll events
    comboboxList.addEventListener('scroll', checkScroll)

    // Watch for content/size changes
    const resizeObserver = new ResizeObserver(checkScroll)
    resizeObserver.observe(comboboxList)

    return () => {
      comboboxList.removeEventListener('scroll', checkScroll)
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
        className='sticky -top-2 z-1 flex w-full cursor-pointer justify-center bg-inherit py-1'
        // onClick={scrollUp}
        type='button'
      >
        <ChevronUp strokeWidth={2} className='size-4' />
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
        className='sticky -bottom-2 z-1 flex w-full cursor-pointer justify-center bg-inherit py-1'
        // onClick={scrollDown}
        type='button'
      >
        <ChevronDown strokeWidth={2} className='size-4' />
      </button>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <Combobox.List
      {...otherProps}
      data-slot='combobox-list'
      className={(comboboxListState) => {
        if (typeof className === 'function') {
          className = className(comboboxListState) || ''
        }
        return cn(baseClasses, className)
      }}
      render={(props, _state) => {
        const { children, ...otherProps } = props
        return (
          <div {...otherProps} ref={mergedRef}>
            {renderScrollUpArrow()}
            {children}
            {renderScrollDownArrow()}
          </div>
        )
      }}
    />
  )
}
