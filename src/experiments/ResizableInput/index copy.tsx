import { useLayoutEffect, useRef, useState } from 'react'

/* ========================================================================
    
======================================================================== */

export const ResizableInput = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState<string>('')

  const hiddenSpanRef = useRef<HTMLSpanElement | null>(null)
  const [width, setWidth] = useState<number>()

  /* ======================
      useLayoutEffect()
  ====================== */
  // This effect sets spanWidth after render, but before paint.

  useLayoutEffect(() => {
    if (!hiddenSpanRef.current || !inputRef.current) {
      return
    }

    const hiddenSpanWidth = hiddenSpanRef.current.offsetWidth

    setWidth(hiddenSpanWidth)
  }, [value])

  /* ======================
      renderInputGroups()
  ====================== */

  const renderInputGroup = () => {
    return (
      <div
        aria-label='Input group'
        // max-w-full constrains input group div, even if it's parent has flex.
        className='max-w-full'
      >
        <div aria-hidden='true' className='sr-only'>
          {/* Don't use a <div>. <span> allows the element to overflow its parent. */}
          <span
            className='rounded border border-neutral-400 px-2 py-1 text-xs outline-none'
            ref={hiddenSpanRef}
          >
            {value}
          </span>
        </div>

        <input
          ref={inputRef}
          autoCapitalize='none'
          autoComplete='off'
          autoCorrect='off'
          spellCheck={false}
          className='rounded border border-neutral-400 px-2 py-1 text-xs outline-none'
          style={{
            minWidth: '100px',
            // This assumes that the <span> has the same font-family,font-size, letter-spacing, and padding.
            width: typeof width === 'number' ? `${width}px` : 80,
            // This will constrain the width to the parent container.
            maxWidth: '100%'
          }}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          tabIndex={-1}
          type='text'
          value={value}
        />
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return <div className='flex'>{renderInputGroup()}</div>
}
