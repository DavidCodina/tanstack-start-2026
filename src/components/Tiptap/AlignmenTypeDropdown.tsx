import {
  ListIndentDecrease,
  ListIndentIncrease,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart
} from 'lucide-react'

import { Dropdown, DropdownItem } from './Dropdown'
import { alignmentTypeToAlignmentName } from './utils'
import type { JSX } from 'react'
import type { Editor } from '@tiptap/core'
import type { MenuBarState } from './menuBarState'

type AlignmentTypeDropdownProps = {
  disabled?: boolean
  editor: Editor
  editorState: MenuBarState
}

/* ======================
    alignmentToIcon
====================== */

const alignmentToIcon = {
  left: <TextAlignStart />,
  center: <TextAlignCenter />,
  right: <TextAlignEnd />,
  justify: <TextAlignJustify />
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

export const AlignmentTypeDropdown = ({
  editor,
  editorState,
  disabled = false
}: AlignmentTypeDropdownProps): JSX.Element => {
  const alignmentType = (editorState?.alignmentType ||
    'left') as keyof typeof alignmentTypeToAlignmentName

  const alignmentIcon = alignmentToIcon[alignmentType] || <TextAlignStart />

  /* ======================
          return
  ====================== */

  return (
    <Dropdown
      disabled={disabled}
      // stopCloseOnMenuClick
      triggerProps={{
        'aria-label': 'alignment options',
        children: alignmentTypeToAlignmentName[alignmentType],
        className: '',
        icon: alignmentIcon,
        title: 'alignment options'
      }}
    >
      <DropdownItem
        className={editorState?.isAlignLeft ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleTextAlign('left').run()}
        title='left align'
      >
        <TextAlignStart /> {alignmentTypeToAlignmentName.left}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isAlignCenter ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleTextAlign('center').run()}
        title='center align'
      >
        <TextAlignCenter /> {alignmentTypeToAlignmentName.center}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isAlignRight ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleTextAlign('right').run()}
        title='right align'
      >
        <TextAlignEnd /> {alignmentTypeToAlignmentName.right}
      </DropdownItem>

      <DropdownItem
        className={editorState?.isAlignJustify ? SELECTED_MIXIN : ''}
        onClick={() => editor.chain().focus().toggleTextAlign('justify').run()}
        title='justify align'
      >
        <TextAlignJustify /> {alignmentTypeToAlignmentName.justify}
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
        className=''
        onClick={() => editor.chain().focus().indent().run()}
        title='indent'
      >
        <ListIndentIncrease /> Indent
      </DropdownItem>

      <DropdownItem
        className=''
        onClick={() => editor.chain().focus().outdent().run()}
        title='outdentt'
      >
        <ListIndentDecrease /> Outdent
      </DropdownItem>
    </Dropdown>
  )
}
