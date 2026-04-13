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
  disabled?: boolean
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
bg-green-500 hover:bg-green-500 focus-visible:bg-green-500
border-green-700 dark:border-green-300
hover:border-green-700 dark:hover:border-green-300
focus-visible:border-green-700 dark:focus-visible:border-green-300
focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50
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
      triggerAriaLabel='Block type options'
      triggerIcon={dropdownIcon}
      triggerText={blockTypeToBlockName[blockType]}
      triggerTitle='Block type options'
    >
      <DropdownItem
        className={editorState?.isParagraph ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow /> Paragraph
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading1 ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title='Heading 1'
      >
        <Heading1 /> Heading 1
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading2 ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title='Heading 2'
      >
        <Heading2 /> Heading 2
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading3 ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title='Heading 3'
      >
        <Heading3 /> Heading 3
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading4 ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        title='Heading 4'
      >
        <Heading4 /> Heading 4
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading5 ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        title='Heading 5'
      >
        <Heading5 /> Heading 5
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading6 ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        title='Heading 6'
      >
        <Heading6 /> Heading 6
      </DropdownItem>

      <DropdownItem
        className={editorState?.isBulletList ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title='Bullet List'
      >
        <List /> Bullet List
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHeading5 ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title='Ordered List'
      >
        <ListOrdered /> Ordered List
      </DropdownItem>

      {/* 
      //# Possibly add check list
      */}

      <DropdownItem
        className={editorState?.isBlockquote ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title='quote'
      >
        <MessageSquareQuote /> Quote
      </DropdownItem>

      <DropdownItem
        className={editorState?.isCodeBlock ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title='Code Block'
      >
        <Code /> Code Block
      </DropdownItem>
    </Dropdown>
  )
}
