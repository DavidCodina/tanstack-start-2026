import React, { useRef, useState } from 'react'
import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole
} from '@floating-ui/react'

interface DropdownItem {
  id: string
  label: string
  value: string
  disabled?: boolean
}

interface DropdownMenuProps {
  items: DropdownItem[]
  placeholder?: string
  onSelect?: (item: DropdownItem) => void
  className?: string
}

/* ========================================================================

======================================================================== */

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  placeholder = 'Select an option...',
  onSelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null)

  const listRef = useRef<Array<HTMLElement | null>>([])

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  })

  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'listbox' })
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [dismiss, role, listNavigation]
  )

  /* =====================

  ====================== */

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return

    setSelectedItem(item)
    setIsOpen(false)
    setActiveIndex(null)
    onSelect?.(item)
  }

  /* =====================

  ====================== */

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (
        activeIndex !== null &&
        items[activeIndex] &&
        !items[activeIndex].disabled
      ) {
        handleSelect(items[activeIndex])
      }
    }
  }

  /* =====================
          return
  ====================== */

  return (
    <div className={`dropdown-container ${className}`}>
      <button
        ref={(node) => {
          refs.setReference(node)
        }}
        className='dropdown-trigger'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        {...getReferenceProps({
          onClick() {
            setIsOpen(!isOpen)
          }
        })}
        type='button'
      >
        <span className='dropdown-text'>
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <svg
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width='12'
          height='12'
          viewBox='0 0 12 12'
          fill='none'
        >
          <path
            d='M3 4.5L6 7.5L9 4.5'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={(node) => {
                refs.setFloating(node)
              }}
              className='dropdown-menu'
              style={floatingStyles}
              onKeyDown={handleKeyDown}
              {...getFloatingProps()}
            >
              <div className='dropdown-list'>
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    ref={(node) => {
                      listRef.current[index] = node
                    }}
                    className={`dropdown-item ${
                      activeIndex === index ? 'active' : ''
                    } ${item.disabled ? 'disabled' : ''} ${
                      selectedItem?.id === item.id ? 'selected' : ''
                    }`}
                    role='option'
                    aria-selected={selectedItem?.id === item.id}
                    aria-disabled={item.disabled}
                    tabIndex={activeIndex === index ? 0 : -1}
                    onClick={() => handleSelect(item)}
                    {...getItemProps({
                      onClick() {
                        handleSelect(item)
                      }
                    })}
                  >
                    {item.label}
                    {selectedItem?.id === item.id && (
                      <svg
                        className='check-icon'
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                      >
                        <path
                          d='M13.5 4.5L6 12L2.5 8.5'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  )
}
