import * as React from 'react'
import { Autocomplete } from '@base-ui/react/autocomplete'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useMergedRef } from '@/hooks'
import { cn } from '@/utils'

export type AutocompleteListProps = Autocomplete.List.Props

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
// the Autocomplete.List <div>, the associated buttons don't overlap the
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

export const AutocompleteList = ({
  className = '',
  ref,
  ...otherProps
}: AutocompleteListProps) => {
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
    const autocompleteList = internalRef.current
    if (!autocompleteList) {
      return
    }
    const { scrollTop, scrollHeight, clientHeight } = autocompleteList

    let topOffset = 0
    let bottomOffset = 0
    // We actually want the last [data-slot="autocomplete-item"] and NOT
    // the last child. Why? Because in many cases, the last child will
    // actually be the scroll down button itself. Obviously, this depends
    // on AutocompleteItem having the data-slot="autocomplete-item" attribute.
    const autocompleteItems = autocompleteList.querySelectorAll(
      '[data-slot="autocomplete-item"]'
    )
    if (autocompleteItems.length > 0) {
      const firstAutocompleteItem = autocompleteItems[0] as HTMLElement

      const lastAutocompleteItem = autocompleteItems[
        autocompleteItems.length - 1
      ] as HTMLElement

      topOffset = firstAutocompleteItem.offsetHeight
      bottomOffset = lastAutocompleteItem.offsetHeight
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
    const autocompleteList = internalRef.current
    if (!autocompleteList) {
      return
    }

    checkScroll() // Check on mount

    // Listen for scroll events
    autocompleteList.addEventListener('scroll', checkScroll)

    // Watch for content/size changes
    const resizeObserver = new ResizeObserver(checkScroll)
    resizeObserver.observe(autocompleteList)

    return () => {
      autocompleteList.removeEventListener('scroll', checkScroll)
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
    <Autocomplete.List
      {...otherProps}
      data-slot='autocomplete-list'
      className={(autocompleteListState) => {
        if (typeof className === 'function') {
          className = className(autocompleteListState) || ''
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
