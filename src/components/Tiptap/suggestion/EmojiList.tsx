'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import type { EmojiItem } from '@tiptap/extension-emoji'

export interface EmojiListProps {
  items: EmojiItem[]
  command: (item: EmojiItem) => void
}

export interface EmojiListRef {
  onKeyDown: (event: KeyboardEvent) => boolean
}

/* ========================================================================
             
======================================================================== */

const EmojiList = forwardRef<EmojiListRef, EmojiListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = useCallback(
      (index: number) => {
        const item = items[index]
        if (item) {
          command(item)
        }
      },
      [items, command]
    )

    const upHandler = useCallback(() => {
      setSelectedIndex((prev) => (prev + items.length - 1) % items.length)
    }, [items.length])

    const downHandler = useCallback(() => {
      setSelectedIndex((prev) => (prev + 1) % items.length)
    }, [items.length])

    const enterHandler = useCallback(() => {
      selectItem(selectedIndex)
    }, [selectItem, selectedIndex])

    useEffect(() => {
      setSelectedIndex(0) // eslint-disable-line
    }, [items])

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
          upHandler()
          return true
        }

        if (event.key === 'ArrowDown') {
          downHandler()
          return true
        }

        if (event.key === 'Enter') {
          enterHandler()
          return true
        }

        return false
      }
    }))

    if (items.length === 0) {
      return (
        <div className='bg-popover text-popover-foreground text-muted-foreground rounded-lg border p-3 text-sm shadow-lg'>
          No emojis found
        </div>
      )
    }

    return (
      <div className='bg-popover text-popover-foreground max-h-80 overflow-hidden overflow-y-auto rounded-lg border shadow-lg'>
        {items.map((item, index) => (
          <button
            key={item.name}
            onClick={() => selectItem(index)}
            className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
              index === selectedIndex
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-muted'
            }`}
            type='button'
          >
            <span className='text-xl' role='img' aria-label={item.name}>
              {item.emoji}
            </span>
            <span className='text-muted-foreground'>:{item.name}:</span>
          </button>
        ))}
      </div>
    )
  }
)

EmojiList.displayName = 'EmojiList'

export { EmojiList }
