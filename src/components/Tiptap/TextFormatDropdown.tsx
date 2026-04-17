import * as React from 'react'

import {
  ALargeSmall,
  Bold,
  Code,
  Highlighter,
  Italic,
  Link,
  RemoveFormatting,
  Strikethrough,
  Subscript,
  Superscript,
  Underline
} from 'lucide-react'

import { Dropdown, DropdownItem } from './Dropdown'
import type { JSX } from 'react'
import type { Editor } from '@tiptap/core'
import type { MenuBarState } from './menuBarState'

type BlockTypeDropdownProps = {
  disabled?: boolean
  editor: Editor
  editorState: MenuBarState
}

const SELECTED_MIXIN = `
text-white hover:text-white focus-visible:text-white 
bg-blue-500 hover:bg-blue-500 focus-visible:bg-blue-500
border-blue-700 dark:border-blue-300
hover:border-blue-700 dark:hover:border-blue-300
focus-visible:border-blue-700 dark:focus-visible:border-blue-300
focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-500/50
shadow-xs
`

/* ========================================================================
 
======================================================================== */

export const TextFormatDropdown = ({
  editor,
  editorState,
  disabled = false
}: BlockTypeDropdownProps): JSX.Element => {
  const [stopCloseOnMenuClick, setStopCloseOnMenuClick] = React.useState(false)

  const textColorInputRef = React.useRef<HTMLInputElement | null>(null)
  const backgroundColorInputRef = React.useRef<HTMLInputElement | null>(null)

  /* ======================
          return
  ====================== */

  return (
    <Dropdown
      disabled={disabled}
      stopCloseOnMenuClick={stopCloseOnMenuClick}
      triggerProps={{
        'aria-label': 'text format options',
        children: '',
        className: '',
        icon: <ALargeSmall />,
        onClick: () => {
          setStopCloseOnMenuClick(false)
        },
        title: 'text format options'
      }}
    >
      <DropdownItem
        className={editorState?.isBold ? SELECTED_MIXIN : ''}
        // disabled={!editorState?.canBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title='bold'
      >
        <Bold /> Bold
      </DropdownItem>

      <DropdownItem
        className={editorState?.isItalic ? SELECTED_MIXIN : ''}
        // disabled={!editorState?.canItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title='italic'
      >
        <Italic /> Italic
      </DropdownItem>

      <DropdownItem
        className={editorState?.isUnderline ? SELECTED_MIXIN : ''}
        // disabled={!editorState?.canUnderline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title='underline'
      >
        <Underline /> Underline
      </DropdownItem>

      <DropdownItem
        className={editorState?.isStrike ? SELECTED_MIXIN : ''}
        // disabled={!editorState?.canStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title='strikethrough'
      >
        <Strikethrough /> Strikethrough
      </DropdownItem>

      <DropdownItem
        className={editorState?.isLink ? SELECTED_MIXIN : ''}
        // disabled={!editorState?.canSetLink && !editorState?.canUnsetLink}
        onClick={() => {
          if (editorState?.isLink) {
            // Already on a link — edit or remove it
            const currentLinkHref = editorState.currentLinkHref ?? '' // => 'https://www.google.com'

            const url = window.prompt(
              'Edit URL (delete value to remove link)',
              currentLinkHref
            )
            if (url === null) return // The user cancelled.

            if (url === '') {
              editor.chain().focus().unsetLink().run()
              return
            }

            //# Add link validation here, or see how it's done with isAllowedUri.

            editor.chain().focus().setLink({ href: url }).run()
            return
          }

          // Otherwise, there's no link yet, so let's set one.
          const url = window.prompt('Enter URL')
          if (!url) return

          //# Add link validation here, or see how it's done with isAllowedUri.
          editor.chain().focus().setLink({ href: url }).run()
        }}
        ///////////////////////////////////////////////////////////////////////////
        //
        // This is a simpler version of the above.
        //
        //   onClick={() => {
        //     const isLink = editorState?.isLink
        //     if (isLink) {
        //       editor.chain().focus().unsetLink().run()
        //       return
        //     }
        //     const url = window.prompt('Enter URL')
        //     if (!url) return
        //     // Add link validation here.
        //     editor.chain().focus().setLink({ href: url }).run()
        //   }}
        //
        ///////////////////////////////////////////////////////////////////////////
        title='link'
      >
        <Link /> Link
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHighlight ? SELECTED_MIXIN : ''}
        // disabled={!editorState?.canHighlight}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        title='highlight'
      >
        <Highlighter /> Highlight
      </DropdownItem>

      <DropdownItem
        className={editorState?.isCode ? SELECTED_MIXIN : ''}
        // disabled={!editorState?.canCode}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title='code'
      >
        <Code /> Code
      </DropdownItem>

      {/* Note: <input type="color"> does not support the alpha channel (at least in Chrome).
      For maximum control and consistency, implement a custom ColorPicker component.   */}

      <DropdownItem
        onClick={() => {
          const textColorInput = textColorInputRef.current
          if (!textColorInput) return
          textColorInput.click()
        }}
        onMouseDown={() => {
          // If the Dropdown menu closes/unmounts, the color picker will mount
          // but it will be orphaned, the actual input is gone so it can't
          // communicate with it, and can't set the color.
          //^ In general, I don't really like how the Dropdown is implemented.
          //^ I would prefer that that each item instead exposed its own
          //^ handler for closing or not closing the menu. Presumably, that
          //^ state would be part of the DropdownContext.
          setStopCloseOnMenuClick(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setStopCloseOnMenuClick(true)
          }
        }}
        title='text color'
      >
        <input
          className='h-[24px] w-[24px] cursor-pointer rounded p-0'
          //# Why not onChange?
          onInput={(event) => {
            editor.chain().focus().setColor(event.currentTarget.value).run()
          }}
          onKeyDown={(e) => {
            // Prevent Enter from submitting a form.
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
          ref={textColorInputRef}
          style={{ colorScheme: 'normal' }}
          type='color'
          value={editorState?.color ? editorState.color : '#000000'}
        />{' '}
        Text Color
      </DropdownItem>

      <DropdownItem
        onClick={() => {
          const backgroundColorInput = backgroundColorInputRef.current
          if (!backgroundColorInput) return
          backgroundColorInput.click()
        }}
        onMouseDown={() => {
          setStopCloseOnMenuClick(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setStopCloseOnMenuClick(true)
          }
        }}
        title='background color'
      >
        <input
          className='h-[24px] w-[24px] cursor-pointer rounded p-0'
          //# Why not onChange?
          onInput={(event) => {
            editor
              .chain()
              .focus()
              .setBackgroundColor(event.currentTarget.value)
              .run()
          }}
          onKeyDown={(e) => {
            // Prevent Enter from submitting a form.
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
          ref={backgroundColorInputRef}
          style={{ colorScheme: 'normal' }}
          type='color'
          value={
            editorState?.backgroundColor
              ? editorState.backgroundColor
              : '#000000'
          }
        />{' '}
        Background Color
      </DropdownItem>

      <DropdownItem
        className={editorState?.isSubscript ? SELECTED_MIXIN : ''}
        //# Check if superscript and remove.
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        title='subscript'
      >
        <Subscript /> Subscript
      </DropdownItem>

      <DropdownItem
        className={editorState?.isSuperscript ? SELECTED_MIXIN : ''}
        //# Check if subscript and remove.
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        title='superscript'
      >
        <Superscript /> Superscript
      </DropdownItem>

      <DropdownItem
        className={''}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title='clear formatting' // clear marks
      >
        <RemoveFormatting /> Clear Formatting
      </DropdownItem>
    </Dropdown>
  )
}
