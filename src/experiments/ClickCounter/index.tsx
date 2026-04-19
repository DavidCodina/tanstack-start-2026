import { useEffect, useRef, useState } from 'react'

type Props = {
  onChange?: (newVlue: number) => void
  value?: number
} & Omit<React.ComponentProps<'button'>, 'onChange' | 'value'>

/* ========================================================================
      
======================================================================== */

export const ClickCounter = ({
  children,
  className = '',
  onChange,
  value,
  ...otherProps
}: Props) => {
  /* ======================
         state & refs
  ====================== */

  const firstRenderRef = useRef(true)

  const [internalValue, setInternalValue] = useState(() => {
    if (typeof value === 'number') {
      return value
    }
    return 0
  })

  /* ======================
        useEffect()
  ====================== */
  // Set internalValue whenever value changes.

  useEffect(() => {
    if (
      firstRenderRef.current === true ||
      typeof value !== 'number' || // i.e., undefined
      value === internalValue
    ) {
      return
    }
    setInternalValue(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  /* ======================
        useEffect()
  ====================== */
  // Call onChange whenver internalValue changes.
  // i.e., if there is onChange then call it.
  // If there is a value then the parent will update
  // value through the onChange callback.

  useEffect(() => {
    if (firstRenderRef.current === true || internalValue === value) {
      return
    }
    onChange?.(internalValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalValue])

  /* ======================
        useEffect()
  ====================== */
  // Update firstRenderRef on mount.

  useEffect(() => {
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
      return
    }
  }, [])

  /* ======================
          return
  ====================== */

  return (
    <button
      {...otherProps}
      className={`mx-auto mb-6 block min-w-[100px] rounded-lg border border-blue-700 bg-blue-500 px-2 py-1 text-sm font-bold text-white ${className ? ` ${className}` : ''}`}
      onClick={() => {
        setInternalValue((v) => v + 1)
      }}
      type='button'
    >
      {children} {internalValue}
    </button>
  )
}
