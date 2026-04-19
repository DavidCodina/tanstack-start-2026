import './Tiptap.css'
import * as React from 'react'
import { EditorContent } from '@tiptap/react'
// https://tiptap.dev/docs/editor/extensions/functionality/drag-handle-react
import DragHandle from '@tiptap/extension-drag-handle-react'
import { GripVertical } from 'lucide-react'

import { TiptapProvider, useTiptapContext } from './TiptapContext'
import { MenuBar } from './MenuBar'
import { FormatBubbleMenu } from './FormatBubbleMenu'

import type { DragHandleProps } from '@tiptap/extension-drag-handle-react'
import type { TiptapProviderProps } from './TiptapContext'

import { cn } from '@/utils'

type TiptapProps = Omit<
  React.ComponentProps<'div'>,
  'children' | 'onChange'
> & {
  /** Used by the FontFamilyDropdown as fallback value for the trigger.
   * Set this to your default application font.
   */
  defaultFontFamily?: string
  disabled?: boolean
}

type NestedProp = DragHandleProps['nested']
type NestedOptions = Exclude<NestedProp, boolean | undefined>

const NESTED_CONFIG_LTR: NestedOptions = {
  edgeDetection: { threshold: -16, edges: ['left'] }
}
const NESTED_CONFIG_RTL: NestedOptions = {
  edgeDetection: { threshold: -16, edges: ['right'] }
}

const baseClasses = `
[--tiptap-min-content-height:250px]
bg-card rounded-lg border shadow-xs
focus-within:ring-[3px] focus-within:ring-primary/50
`

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Tiptap Youtube:         https://www.youtube.com/@tiptap-editor/videos
// ✅ Cand Dev:            https://www.youtube.com/watch?v=QVffer2fRfg
// Cand Dev:               https://www.youtube.com/watch?v=M3BdmN4etYg
// ✅ StackWild:           https://www.youtube.com/watch?v=s1lpwpeSGW4
// Age Concepts:           https://www.youtube.com/watch?v=zIm1FYi8A7c
//
// ❌ Code DPS:            https://www.youtube.com/watch?v=hpQmgLPaCcE&list=PL6yN8EtcWUmYfgln8Vxm5sEde8FroZYt0
// ❌ De Mawo:             https://www.youtube.com/watch?v=MEhVUDP3a_k
// ❌ Solve It Out:        https://www.youtube.com/watch?v=LiELuVk12ig
//
// Examples:               https://tiptap.dev/docs/examples
// UI componentss          https://tiptap.dev/docs/ui-components/components/overview
// awesome-tiptap:         https://github.com/ueberdosis/awesome-tiptap/
// Roadmap:                https://tiptap.dev/roadmap
// Tiptap Editor Overview: https://tiptap.dev/docs/editor/getting-started/overview
// Extenstions Overview:   https://tiptap.dev/docs/editor/extensions/overview
//
// Does TipTap sanitize HTML?
// https://github.com/ueberdosis/tiptap/discussions/2845?utm_source=copilot.com
//
// Note: There is a @tiptap/cli. However, for TanStack Start, go manual.
//
//   https://tiptap.dev/docs/editor/getting-started/install/react
//   - @tiptap/react: The React bindings for Tiptap including Tiptap's core functionality.
//   - @tiptap/pm: Tiptap's ProseMirror dependencies, which are required for the editor to function.
//   - @tiptap/starter-kit: A collection of commonly used extensions that provide basic functionality
//     like paragraphs, headings, bold, italic, and more.
//
//   npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
//
// See this: https://tiptap.dev/docs/guides/react-composable-api
//
///////////////////////////////////////////////////////////////////////////

const Tiptap = ({
  className,
  // When disabled changes, TipTapContext.tsx sets editor.setEditable(!disabled).
  // However, this only locks the contenteditable div. You still must guard your
  // functionality by checking if disabled and/or editor.isEditable.
  disabled,
  defaultFontFamily,
  ...otherProps
}: TiptapProps) => {
  const { editor } = useTiptapContext()
  const [rtl, _setRtl] = React.useState(false)
  // If you set nested to true, then the associated CSS will need to be
  // modified slightly, for lists etc.
  const [nested, _setNested] = React.useState(false)

  let nestedConfig: NestedProp

  if (nested) {
    nestedConfig = rtl ? NESTED_CONFIG_RTL : NESTED_CONFIG_LTR
  }

  /* =====================
          return
  ====================== */

  if (!editor) {
    return null
  }

  return (
    <div
      {...otherProps}
      data-slot='tiptap-editor'
      className={cn(baseClasses, className)}
    >
      <MenuBar
        defaultFontFamily={defaultFontFamily}
        disabled={disabled}
        editor={editor}
      />

      <DragHandle
        editor={editor}
        className=''
        // https://tiptap.dev/docs/editor/extensions/functionality/drag-handle-react#nested
        nested={nestedConfig}
        // https://tiptap.dev/docs/editor/extensions/functionality/drag-handle-react#computepositionconfig
        computePositionConfig={{
          placement: rtl ? 'right-start' : 'left-start'
          // strategy: 'fixed'
        }}
        ///////////////////////////////////////////////////////////////////////////
        //
        // This is the underline that you see when dragging a block.
        //
        //   <div class="prosemirror-dropcursor-block" />
        //
        // However, it often takes a few seconds to disappear. The delay is a known quirk.
        // ProseMirror's dropcursor plugin removes the indicator by tracking dragleave/dragend
        // events, but the browser's drag lifecycle often keeps those events firing for a second
        // or two after you release, so ProseMirror doesn't clean up immediately.
        //
        // The cleanest fix is to hook into dragend and/or drop on the editor DOM element yourself
        // and force-remove the cursor node. Using onElementDragEnd should be sufficient, but as
        // an alternative approach one could also do this:
        //
        //   React.useEffect(() => {
        //     const contentEditableDiv = editor?.view?.dom
        //     if (!contentEditableDiv) return
        //     const removeCursor = () => {}
        //     contentEditableDiv.addEventListener('dragend', removeCursor)
        //     contentEditableDiv.addEventListener('drop', removeCursor)
        //     return () => {
        //       contentEditableDiv.removeEventListener('dragend', removeCursor)
        //       contentEditableDiv.removeEventListener('drop', removeCursor)
        //     }
        //   }, [editor])
        //
        ///////////////////////////////////////////////////////////////////////////
        onElementDragEnd={() => {
          const removeCursor = () => {
            // rAF lets ProseMirror process the event first,
            // then we nuke any leftover dropcursor element
            requestAnimationFrame(() => {
              const dropCursor = document.querySelector(
                '.prosemirror-dropcursor-block'
              )
              // ProseMirror recreates the element on each new drag, so setting
              // display: none on the old one doesn't break future drags.
              if (dropCursor && dropCursor instanceof HTMLElement) {
                dropCursor.style.display = 'none'
              }
            })
          }

          removeCursor()
        }}
      >
        <GripVertical className='text-muted-foreground cursor-grab active:cursor-grabbing' />
      </DragHandle>

      <EditorContent
        data-slot='tiptap-editor-content'
        // Using resize-y works well for now, but if you run into actual
        // isues where content is hidden by overflow-auto, then you many want
        // to go to a programmatic solution. Fortunately, this is not an issue
        // for the BubbleMenu.
        className='min-h-(--tiptap-min-content-height) resize-y overflow-auto'
        editor={editor}
      />

      <FormatBubbleMenu disabled={disabled} />
    </div>
  )
}

/* ========================================================================

======================================================================== */

const TiptapWithProvider = ({
  disabled = false,
  editorProps,
  onChange,
  ...otherProps
}: TiptapProviderProps & TiptapProps) => {
  return (
    <TiptapProvider
      disabled={disabled}
      editorProps={editorProps}
      onChange={onChange}
    >
      <Tiptap disabled={disabled} {...otherProps} />
    </TiptapProvider>
  )
}

export { TiptapWithProvider as Tiptap }
