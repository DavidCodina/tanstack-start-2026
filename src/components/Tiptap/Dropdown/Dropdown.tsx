import * as React from 'react'
import { ChevronDown } from 'lucide-react'

import { DropdownMenu } from './DropdownMenu'
import { cn } from '@/utils'

type triggerProps = React.ComponentProps<'button'>

type DropdownProps = {
  children: React.ReactNode
  disabled?: boolean
  stopCloseOnMenuClick?: boolean
  triggerAriaLabel?: string
  triggerClassName?: string
  triggerIcon?: React.ReactNode
  triggerText?: string
  triggerTitle?: string
  triggerProps?: triggerProps
}

const SOLID_BUTTON_BORDER_MIXIN = `border border-[rgba(0,0,0,0.3)] dark:border-[rgba(255,255,255,0.35)]`

const HOVER_MIXIN = `
hover:bg-blue-500
hover:text-white
hover:border-blue-700
dark:hover:border-blue-300
`

const FOCUS_MIXIN = `focus-visible:ring-[3px] focus-visible:ring-border/50`

const triggerClasses = `
flex items-center gap-1
px-1 py-1
bg-accent font-medium leading-none
rounded-lg outline-none cursor-pointer
shadow-xs
${SOLID_BUTTON_BORDER_MIXIN}
${HOVER_MIXIN}
${FOCUS_MIXIN}
`

const menuPadding = 8

/* ========================================================================

======================================================================== */

export const Dropdown = ({
  children,
  disabled = false,
  stopCloseOnMenuClick = false,
  triggerAriaLabel,
  triggerClassName,
  triggerIcon,
  triggerText,
  triggerTitle,
  triggerProps
}: DropdownProps) => {
  /* ======================
        state & refs
  ====================== */

  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [showDropDown, setShowDropDown] = React.useState(false)

  /* ======================
         useEffect()
  ====================== */
  // Position the menu when the trigger is clicked.

  React.useEffect(() => {
    const trigger = triggerRef.current
    const menu = menuRef.current

    if (showDropDown && trigger !== null && menu !== null) {
      const { top, left } = trigger.getBoundingClientRect()
      menu.style.top = `${top + trigger.offsetHeight + menuPadding}px`
      menu.style.left = `${Math.min(
        left,
        window.innerWidth - menu.offsetWidth - 20
      )}px`
    }
  }, [showDropDown])
  // ❌ No need to add refs: menuRef, triggerRef

  /* ======================
         useEffect()
  ====================== */
  // Create an 'on-click-outside' event listener.

  React.useEffect(() => {
    const trigger = triggerRef.current
    if (trigger === null || showDropDown !== true) return

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target

      if (stopCloseOnMenuClick && menuRef.current?.contains(target as Node)) {
        return
      }

      if (!trigger.contains(target as Node)) {
        setShowDropDown(false)
      }
    }

    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [showDropDown, stopCloseOnMenuClick])
  // ❌ No need to add refs: menuRef, triggerRef,

  /* ======================
         useEffect()
  ====================== */
  // Update the position of the menu when the viewport scroll changes.

  React.useEffect(() => {
    const handleButtonPositionUpdate = () => {
      if (showDropDown) {
        const trigger = triggerRef.current
        const menu = menuRef.current

        if (trigger !== null && menu !== null) {
          const { top } = trigger.getBoundingClientRect()
          const newPosition = top + trigger.offsetHeight + menuPadding
          if (newPosition !== menu.getBoundingClientRect().top) {
            menu.style.top = `${newPosition}px`
          }
        }
      }
    }

    document.addEventListener('scroll', handleButtonPositionUpdate)

    return () => {
      document.removeEventListener('scroll', handleButtonPositionUpdate)
    }
  }, [showDropDown])
  // ❌ No need to add refs: triggerRef, menuRef

  /* ======================
      renderTrigger()
  ====================== */

  const renderTrigger = () => {
    return (
      <button
        {...triggerProps}
        aria-label={triggerAriaLabel || triggerText}
        className={cn(triggerClasses, triggerClassName)}
        disabled={disabled}
        onClick={(e) => {
          triggerProps?.onClick?.(e)
          setShowDropDown((prev) => !prev)
        }}
        ref={triggerRef}
        title={triggerTitle}
        type='button'
      >
        {triggerIcon}
        <span>{triggerText}</span>
        <ChevronDown />
      </button>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {renderTrigger()}

      {showDropDown && (
        <DropdownMenu
          dropDownRef={menuRef}
          onClose={() => {
            setShowDropDown(false)
            if (triggerRef && triggerRef.current) {
              triggerRef.current.focus()
            }
          }}
        >
          {children}
        </DropdownMenu>
      )}
    </>
  )
}
