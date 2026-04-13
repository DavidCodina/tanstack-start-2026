import * as React from 'react'
import { DropdownProvider, useDropdownContext } from './DropdownContext'
import type { ItemRefType } from './DropdownContext'

type DropdownMenuProps = {
  children: React.ReactNode
  dropDownRef: React.Ref<HTMLDivElement>
  onClose: () => void
}

const baseClasses = `
fixed flex flex-col gap-1 p-2
bg-card border rounded-lg
shadow
z-[100]
`

/* ========================================================================
               
======================================================================== */

const DropdownMenu = ({
  children,
  dropDownRef,
  onClose
}: DropdownMenuProps) => {
  const { items } = useDropdownContext()
  const [focusedItem, setFocusedItem] = React.useState<ItemRefType>()

  /* ======================
        handleKeyDown()
  ====================== */

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!items) return
    const key = event.key

    if (['Escape', 'ArrowUp', 'ArrowDown', 'Tab'].includes(key)) {
      event.preventDefault()
    }

    // Enable closing the menu with Escape/Tab
    if (key === 'Escape' || key === 'Tab') {
      onClose()
      return
    }

    // Enable navigating the menu with ArrowUp/ArrowDown
    if (key === 'ArrowUp') {
      setFocusedItem((prev) => {
        if (!prev) return items[0]
        const index = items.indexOf(prev) - 1
        return items[index === -1 ? items.length - 1 : index]
      })
      return
    }

    // Enable navigating the menu with ArrowUp/ArrowDown
    if (key === 'ArrowDown') {
      setFocusedItem((prev) => {
        if (!prev) return items[0]
        return items[items.indexOf(prev) + 1]
      })
    }
  }

  /* ======================
         useEffect()
  ====================== */
  // Focus the first item when the menu opens

  React.useEffect(() => {
    if (items && !focusedItem) {
      setFocusedItem(items[0])
    }

    if (focusedItem && focusedItem.current) {
      focusedItem.current.focus()
    }
  }, [items, focusedItem])

  /* ======================
          return
  ====================== */

  return (
    <div className={baseClasses} ref={dropDownRef} onKeyDown={handleKeyDown}>
      {children}
    </div>
  )
}

/* ========================================================================
               
======================================================================== */

export const DropdownMenuWithProvider = (props: DropdownMenuProps) => {
  return (
    <DropdownProvider>
      <DropdownMenu {...props} />
    </DropdownProvider>
  )
}

export { DropdownMenuWithProvider as DropdownMenu }
