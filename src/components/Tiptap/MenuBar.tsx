import { Copy, Eraser, RotateCcw, RotateCw, Trash2 } from 'lucide-react'
import { DOMSerializer } from '@tiptap/pm/model'
import { useTiptapContext } from './TiptapContext'
import { Divider } from './Divider'
import { BlockTypeDropdown } from './BlockTypeDropdown'
import { TextFormatDropdown } from './TextFormatDropdown'
import { AlignmentTypeDropdown } from './AlignmenTypeDropdown'
import { InsertDropdown } from './InsertDropdown'
import { FontFamilyDropdown } from './FontFamilyDropdown'
import { FontSize } from './FontSize'
import type { Editor } from '@tiptap/core'

import { cn } from '@/utils'

type MenuBarProps = {
  defaultFontFamily?: string
  disabled?: boolean
  editor: Editor | null
}

const SOLID_BUTTON_BORDER_MIXIN = `border border-[rgba(0,0,0,0.3)] dark:border-[rgba(255,255,255,0.35)]`

const HOVER_MIXIN = `
hover:bg-blue-500
hover:text-white
hover:border-blue-700
dark:hover:border-blue-300
`

const FOCUS_MIXIN = `
focus-visible:ring-[3px]
focus-visible:ring-black/10
dark:focus-visible:ring-white/20
`

const buttonClasses = `
flex items-center gap-2
px-1 py-1
bg-accent font-medium leading-none
rounded-lg outline-none cursor-pointer
shadow-xs
${SOLID_BUTTON_BORDER_MIXIN}
${HOVER_MIXIN}
${FOCUS_MIXIN}
`

/* ========================================================================

======================================================================== */

export const MenuBar = ({
  defaultFontFamily,
  disabled = false,
  editor
}: MenuBarProps) => {
  const { editorState } = useTiptapContext()

  if (!editor /* || !editorState */) {
    return null
  }

  /* =====================
      renderUndoRedo()
  ====================== */

  const renderUndoRedo = () => {
    return (
      <>
        <button
          className={cn(
            buttonClasses,

            !editorState?.canUndo && 'cursor-not-allowed opacity-50'
          )}
          disabled={disabled || !editorState?.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
          title='Undo'
          type='button'
        >
          <RotateCcw />
        </button>

        <button
          className={cn(
            buttonClasses,
            !editorState?.canRedo && 'cursor-not-allowed opacity-50'
          )}
          disabled={disabled || !editorState?.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
          title='Redo'
          type='button'
        >
          <RotateCw />
        </button>
      </>
    )
  }

  /* =====================
    renderClearActions()
  ====================== */

  const renderClearActions = () => {
    return (
      <>
        <button
          className={cn(
            buttonClasses,
            'hover:border-yellow-600 hover:bg-yellow-400 hover:text-white'
          )}
          disabled={disabled}
          onClick={() => editor.chain().focus().clearNodes().run()}
          title='remove nodes'
          type='button'
        >
          <Eraser />
        </button>

        <button
          className={cn(
            buttonClasses,
            'hover:border-rose-700 hover:bg-rose-500 hover:text-white'
          )}
          disabled={disabled}
          onClick={() => {
            const { empty } = editor.state.selection
            if (empty) {
              editor.chain().focus().clearContent(true).run()
            } else {
              editor.chain().focus().deleteSelection().run()
            }
          }}
          title='delete content'
          type='button'
        >
          <Trash2 />
        </button>
      </>
    )
  }

  /* =====================
          return
  ====================== */

  return (
    <div data-slot='tiptap-menu-bar' className='border-b'>
      <div className='mx-auto flex w-fit flex-wrap items-start gap-2 p-2'>
        {renderUndoRedo()}

        <Divider />

        <BlockTypeDropdown
          disabled={disabled}
          editor={editor}
          editorState={editorState}
        />

        <Divider />

        <FontFamilyDropdown
          disabled={disabled}
          editor={editor}
          editorState={editorState}
          defaultFontFamily={defaultFontFamily}
        />

        <Divider />

        <FontSize disabled={disabled} />

        <Divider />

        <TextFormatDropdown
          disabled={disabled}
          editor={editor}
          editorState={editorState}
        />

        <Divider />

        <InsertDropdown
          disabled={disabled}
          editor={editor}
          editorState={editorState}
        />

        <Divider />

        <AlignmentTypeDropdown
          disabled={disabled}
          editor={editor}
          editorState={editorState}
        />

        <Divider />

        <button
          className={cn(buttonClasses)}
          disabled={disabled}
          onClick={() => {
            const { empty } = editor.state.selection
            if (empty) {
              navigator.clipboard.writeText(editor.getText())
            } else {
              const { from, to } = editor.state.selection
              const text = editor.state.doc.textBetween(from, to, ' ')
              navigator.clipboard.writeText(text)
            }
          }}
          title='copy text'
          type='button'
        >
          <Copy />
        </button>

        <button
          className={cn(buttonClasses)}
          disabled={disabled}
          onClick={() => {
            // If you ever wanted *strictly* the selected content (not the full block),
            // you'd swap those for plain `from`/`to`.
            const { empty, $from, $to /*, from, to */ } = editor.state.selection
            if (empty) {
              navigator.clipboard.writeText(editor.getHTML())
            } else {
              // Even if you select part of a block, this will give you back the entire block.
              const slice = editor.state.doc.slice($from.before(), $to.after())
              const serializer = DOMSerializer.fromSchema(editor.schema)
              const div = document.createElement('div')
              div.appendChild(serializer.serializeFragment(slice.content))
              navigator.clipboard.writeText(div.innerHTML)
            }
          }}
          title='copy html'
          type='button'
        >
          <svg width='24' height='24' fill='currentColor' viewBox='0 0 16 16'>
            <path
              fillRule='evenodd'
              d='M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zm-9.736 7.35v3.999h-.791v-1.714H1.79v1.714H1V11.85h.791v1.626h1.682V11.85h.79Zm2.251.662v3.337h-.794v-3.337H4.588v-.662h3.064v.662zm2.176 3.337v-2.66h.038l.952 2.159h.516l.946-2.16h.038v2.661h.715V11.85h-.8l-1.14 2.596H9.93L8.79 11.85h-.805v3.999zm4.71-.674h1.696v.674H12.61V11.85h.79v3.325Z'
            />
          </svg>
        </button>

        {renderClearActions()}
      </div>
    </div>
  )
}
