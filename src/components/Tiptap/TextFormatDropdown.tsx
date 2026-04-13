import {
  ALargeSmall,
  Bold,
  Code,
  Highlighter,
  Italic,
  Strikethrough,
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
bg-green-500 hover:bg-green-500 focus-visible:bg-green-500
border-green-700 dark:border-green-300
hover:border-green-700 dark:hover:border-green-300
focus-visible:border-green-700 dark:focus-visible:border-green-300
focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50
shadow-xs
`

/* ========================================================================
 
======================================================================== */
// This is for rendering inline text formatting.
// However, using the Tiptap/ProseMirror jargon, we would call these "marks" / MarksDropdown.

//# Add Link

//# Add Underline

//# Add Subscript

//# Add Superscript.

//# Add superscript / subscript here...

//# Add lowercase, uppercase, capitalize here...

export const TextFormatDropdown = ({
  editor,
  editorState,
  disabled = false
}: BlockTypeDropdownProps): JSX.Element => {
  /* ======================
          return
  ====================== */

  return (
    <Dropdown
      disabled={disabled}
      // stopCloseOnMenuClick
      triggerAriaLabel='Text format options'
      triggerClassName=''
      triggerIcon={<ALargeSmall />}
      triggerText={''}
      triggerTitle='Text format options'
    >
      <DropdownItem
        className={editorState?.isBold ? SELECTED_MIXIN : ''}
        //# disabled={!editorState?.canBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title='bold'
      >
        <Bold /> Bold
      </DropdownItem>

      <DropdownItem
        className={editorState?.isItalic ? SELECTED_MIXIN : ''}
        //# disabled={!editorState?.canItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title='italic'
      >
        <Italic /> Italic
      </DropdownItem>

      <DropdownItem
        className={editorState?.isUnderline ? SELECTED_MIXIN : ''}
        //# disabled={!editorState?.canUnderline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title='underline'
      >
        <Underline /> Underline
      </DropdownItem>

      <DropdownItem
        className={editorState?.isStrike ? SELECTED_MIXIN : ''}
        //# disabled={!editorState?.canStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title='strikethrough'
      >
        <Strikethrough /> Strikethrough
      </DropdownItem>

      <DropdownItem
        className={editorState?.isCode ? SELECTED_MIXIN : ''}
        //# disabled={!editorState?.canCode}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title='code'
      >
        <Code /> Code
      </DropdownItem>

      <DropdownItem
        className={editorState?.isHighlight ? SELECTED_MIXIN : ''}
        //# disabled={!editorState?.canHighlight}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        title='highlight'
      >
        <Highlighter /> Highlight
      </DropdownItem>
    </Dropdown>
  )
}

// const renderMarks = () => {
//   return (
//     <>
//       <button
//         className={cn(buttonClasses, editorState?.isBold && SELECTED_MIXIN)}
//         disabled={!editorState?.canBold}
//         onClick={() => editor.chain().focus().toggleBold().run()}
//         title='bold'
//         type='button'
//       >
//         <Bold />
//       </button>

//       <button
//         className={cn(buttonClasses, editorState?.isItalic && SELECTED_MIXIN)}
//         disabled={!editorState?.canItalic}
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//         title='italic'
//         type='button'
//       >
//         <Italic />
//       </button>

//       <button
//         className={cn(buttonClasses, editorState?.isStrike && SELECTED_MIXIN)}
//         disabled={!editorState?.canStrike}
//         onClick={() => editor.chain().focus().toggleStrike().run()}
//         title='strikethrough'
//         type='button'
//       >
//         <Strikethrough />
//       </button>

//       <button
//         className={cn(buttonClasses, editorState?.isCode && SELECTED_MIXIN)}
//         disabled={!editorState?.canCode}
//         onClick={() => editor.chain().focus().toggleCode().run()}
//         title='code'
//         type='button'
//       >
//         <Code />
//       </button>

//       <button
//         onClick={() => editor.chain().focus().toggleHighlight().run()}
//         className={cn(
//           buttonClasses,
//           editorState?.isHighlight && SELECTED_MIXIN
//         )}
//         title='highlight'
//         type='button'
//       >
//         <Highlighter />
//       </button>
//     </>
//   )
// }
