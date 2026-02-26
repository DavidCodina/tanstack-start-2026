import { useLayoutEffect, useRef, useState } from 'react'

const defaultWidth = 100

/* ========================================================================
    
======================================================================== */

export const ResizableInput = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const hiddenSpanRef = useRef<HTMLSpanElement | null>(null)

  const [value, setValue] = useState<string>('')
  const [width, setWidth] = useState<number>()

  /* ======================
      useLayoutEffect()
  ====================== */
  // Set width state after render, but before paint.

  useLayoutEffect(() => {
    if (!hiddenSpanRef.current) {
      return
    }

    // This assumes that the <span> has the same font-family,
    // font-size, letter-spacing, and padding as the input.
    setWidth(hiddenSpanRef.current.offsetWidth)
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
          <span // Don't use <div>. <span> allows the element to overflow its parent.
            className='border px-2 py-1 text-xs whitespace-pre' // Note the use of whitespace-pre
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
          className={`rounded border border-neutral-300 px-2 py-1 text-xs outline-none focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]`}
          style={{
            minWidth: '100px',
            width: typeof width === 'number' ? width : defaultWidth,
            // Constrain the width to that of the parent container.
            maxWidth: '100%'
          }}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          type='text'
          value={value}
        />
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return <div className='flex justify-center'>{renderInputGroup()}</div>
}
