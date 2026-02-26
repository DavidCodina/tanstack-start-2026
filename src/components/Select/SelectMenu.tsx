import { Select } from '@base-ui/react/select'
import { SelectPortal } from './SelectPortal'
import { SelectPositioner } from './SelectPositioner'
import { SelectPopup } from './SelectPopup'
import { SelectList } from './SelectList'

import type { SelectPortalProps } from './SelectPortal'
import type { SelectPositionerProps } from './SelectPositioner'
import type { SelectPopupProps } from './SelectPopup'
import type { SelectListProps } from './SelectList'

export type SelectMenuProps = {
  selectPortalProps?: SelectPortalProps
  selectPositionerProps?: SelectPositionerProps
  selectPopupProps?: SelectPopupProps
  selectListProps?: SelectListProps
}

/* ========================================================================

======================================================================== */

export const SelectMenu = ({
  selectPortalProps = {},
  selectPositionerProps = {},
  selectPopupProps = {},
  selectListProps = {}
}: SelectMenuProps) => {
  /* ======================
    renderScrollUpArrow()
  ====================== */

  const renderScrollUpArrow = () => {
    const scrollUpArrowClassName = `
    bg-card
    flex items-center justify-center
    top-0 h-6 w-full cursor-default
    rounded-md  text-center text-xs
    before:absolute
    before:content-[''] 
    before:left-0
    before:h-full
    before:w-full
    data-[side=none]:before:top-[-100%]
    z-1
    `
    return (
      <Select.ScrollUpArrow className={scrollUpArrowClassName}>
        <ChevronUpIcon />
      </Select.ScrollUpArrow>
    )
  }

  /* ======================
    renderScrollDownArrow()
  ====================== */

  const renderScrollDownArrow = () => {
    const scrollDownArrowClassName = `
    bg-card
    flex items-center justify-center
    bottom-0 h-6 w-full cursor-default z-1
    rounded-md text-center text-xs
    before:absolute before:left-0 before:h-full before:w-full before:content-['']
    data-[side=none]:before:bottom-[-100%]
    `
    return (
      <Select.ScrollDownArrow className={scrollDownArrowClassName}>
        <ChevronDownIcon />
      </Select.ScrollDownArrow>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <SelectPortal {...selectPortalProps}>
      <SelectPositioner {...selectPositionerProps}>
        <SelectPopup {...selectPopupProps}>
          {renderScrollUpArrow()}
          <SelectList {...selectListProps} />
          {renderScrollDownArrow()}
        </SelectPopup>
      </SelectPositioner>
    </SelectPortal>
  )
}

/* ========================================================================

======================================================================== */

function ChevronUpIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width='8'
      height='6'
      viewBox='0 0 8 6'
      fill='none'
      stroke='currentcolor'
      strokeWidth='1.5'
      {...props}
    >
      <path d='M0.5 4.5L4 1.5L7.5 4.5' />
    </svg>
  )
}

function ChevronDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width='8'
      height='6'
      viewBox='0 0 8 6'
      fill='none'
      stroke='currentcolor'
      strokeWidth='1.5'
      {...props}
    >
      <path d='M0.5 1.5L4 4.5L7.5 1.5' />
    </svg>
  )
}
