import { useContext, useEffect, useRef } from 'react'
import { DropdownContext } from './DropdownContext'
import { cn } from '@/utils'

type DropdownItemProps = React.ComponentProps<'button'>

const HOVER_MIXIN = `
hover:bg-accent
hover:border-[rgba(0,0,0,0.3)]
dark:hover:border-[rgba(255,255,255,0.35)]
`

const FOCUS_MIXIN = `
focus-visible:bg-accent
focus-visible:border-[rgba(0,0,0,0.3)]
dark:focus-visible:border-[rgba(255,255,255,0.35)]
focus-visible:ring-[3px]
focus-visible:ring-black/10
dark:focus-visible:ring-white/20
`

const baseClasses = `
flex items-center gap-2
px-1 py-1
bg-transparent font-medium leading-none
border border-transparent rounded-lg
outline-none cursor-pointer
${HOVER_MIXIN}
${FOCUS_MIXIN}
`

/* ========================================================================
                 
======================================================================== */

export const DropdownItem = ({
  children,
  className = '',
  disabled,
  onClick,
  title,
  ...otherProps
}: DropdownItemProps) => {
  const ref = useRef<HTMLButtonElement>(null)

  const dropDownContext = useContext(DropdownContext)
  if (dropDownContext === null) {
    throw new Error('DropdownItem must be used within a Dropdown (for context)')
  }
  const { registerItem } = dropDownContext

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (ref && ref.current) {
      registerItem(ref as any)
    }
  }, [ref, registerItem])

  /* ======================
          return
  ====================== */

  return (
    <button
      {...otherProps}
      className={cn(baseClasses, className)}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      title={title}
      type='button'
    >
      {children}
    </button>
  )
}
