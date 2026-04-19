import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListCheck,
  ListOrdered,
  MessageSquareQuote,
  Pilcrow
} from 'lucide-react'

import { Dropdown, DropdownItem } from './Dropdown'
import { blockTypeToBlockName } from './utils'
import type { JSX } from 'react'
import type { Editor } from '@tiptap/core'
import type { MenuBarState } from './menuBarState'

type BlockTypeDropdownProps = {
  disabled: boolean
  editor: Editor
  editorState: MenuBarState
}

/* ======================
    blockTypeToIcon
====================== */

const blockTypeToIcon = {
  h1: <Heading1 />,
  h2: <Heading2 />,
  h3: <Heading3 />,
  h4: <Heading4 />,
  h5: <Heading5 />,
  h6: <Heading6 />,
  bullet: <List />,
  number: <ListOrdered />,
  check: <ListCheck />,
  quote: <MessageSquareQuote />,
  code: <Code />,
  paragraph: <Pilcrow />
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

export const BlockTypeDropdown = ({
  editor,
  editorState,
  disabled = false
}: BlockTypeDropdownProps): JSX.Element => {
  const blockType = (editorState?.blockType ||
    'paragraph') as keyof typeof blockTypeToBlockName

  const dropdownIcon = blockTypeToIcon[blockType] || <Pilcrow />

  /* ======================
          return
  ====================== */

  return (
    <Dropdown
      disabled={disabled}
      // stopCloseOnMenuClick
      triggerProps={{
        'aria-label': 'block type options',
        children: blockTypeToBlockName[blockType],
        className: '',
        disabled: disabled,
        icon: dropdownIcon,
        title: 'block type options'
      }}
    >
      <DropdownItem
        className={editorState?.isParagraph ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().setParagraph().run()}
        title='paragraph'
      >
        <Pilcrow /> {blockTypeToBlockName.paragraph}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading1 ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title='heading 1'
      >
        <Heading1 /> {blockTypeToBlockName.h1}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading2 ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title='heading 2'
      >
        <Heading2 /> {blockTypeToBlockName.h2}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading3 ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title='heading 3'
      >
        <Heading3 /> {blockTypeToBlockName.h3}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading4 ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        title='heading 4'
      >
        <Heading4 /> {blockTypeToBlockName.h4}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading5 ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        title='heading 5'
      >
        <Heading5 /> {blockTypeToBlockName.h5}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading6 ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        title='heading 6'
      >
        <Heading6 /> {blockTypeToBlockName.h6}
      </DropdownItem>

      {/* ================= */}

      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--color-neutral-400)',
          margin: '4px 10px'
        }}
      />

      <DropdownItem
        className={editorState?.isBulletList ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title='bullet list'
      >
        <List /> {blockTypeToBlockName.bullet}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isOrderedList ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title='numbered list'
      >
        <ListOrdered /> {blockTypeToBlockName.number}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isTaskList ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        title='check list'
      >
        <ListCheck /> {blockTypeToBlockName.check}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isBlockquote ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title='quote'
      >
        <MessageSquareQuote /> {blockTypeToBlockName.quote}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isCodeBlock ? SELECTED_MIXIN : ''}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title='code block'
      >
        <Code /> {blockTypeToBlockName.code}
      </DropdownItem>
    </Dropdown>
  )
}
