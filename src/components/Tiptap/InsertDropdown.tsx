import { CornerDownLeft, Plus, Ruler } from 'lucide-react'
import { Dropdown, DropdownItem } from './Dropdown'

import type { JSX } from 'react'
import type { Editor } from '@tiptap/core'
import type { MenuBarState } from './menuBarState'

type InsertDropdownProps = {
  disabled?: boolean
  editor: Editor
  editorState: MenuBarState
}

// const SELECTED_MIXIN = `
// text-white hover:text-white focus-visible:text-white
// bg-blue-500 hover:bg-blue-500 focus-visible:bg-blue-500
// border-blue-700 dark:border-blue-300
// hover:border-blue-700 dark:hover:border-blue-300
// focus-visible:border-blue-700 dark:focus-visible:border-blue-300
// focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-500/50
// shadow-xs
// `

/* ========================================================================
 
======================================================================== */

export const InsertDropdown = ({
  editor,
  // editorState,
  disabled = false
}: InsertDropdownProps): JSX.Element => {
  /* ======================
          return
  ====================== */

  return (
    <Dropdown
      disabled={disabled}
      // stopCloseOnMenuClick
      triggerProps={{
        'aria-label': 'insert options',
        children: 'Insert',
        className: '',
        icon: <Plus />,
        title: 'insert options'
      }}
    >
      <DropdownItem
        className=''
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title='horizontal rule'
      >
        <Ruler /> Horizontal Rule
      </DropdownItem>

      <DropdownItem
        className=''
        onClick={() => editor.chain().focus().setHardBreak().run()}
        title='hard break'
      >
        <CornerDownLeft /> Hard Break
      </DropdownItem>
    </Dropdown>
  )
}
