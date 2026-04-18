import './Tiptap.css'
import { EditorContent } from '@tiptap/react'
import { TiptapProvider, useTiptapContext } from './TipTapContext'
import { MenuBar } from './MenuBar'
import { FormatBubbleMenu } from './FormatBubbleMenu'

import type { TiptapProviderProps } from './TipTapContext'
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
//    Cand Dev:            https://www.youtube.com/watch?v=M3BdmN4etYg
// ✅ StackWild:           https://www.youtube.com/watch?v=s1lpwpeSGW4
//    Age Concepts:        https://www.youtube.com/watch?v=zIm1FYi8A7c
// ❌ Code DPS:            https://www.youtube.com/watch?v=hpQmgLPaCcE&list=PL6yN8EtcWUmYfgln8Vxm5sEde8FroZYt0
// ❌ De Mawo:             https://www.youtube.com/watch?v=MEhVUDP3a_k
// ❌ Solve It Out:        https://www.youtube.com/watch?v=LiELuVk12ig
//
// Examples:               https://tiptap.dev/docs/examples
// Roadmap:                https://tiptap.dev/roadmap
// Tiptap Editor Overview: https://tiptap.dev/docs/editor/getting-started/overview
// Extenstions Overview:   https://tiptap.dev/docs/editor/extensions/overview
// StarterKit:             https://tiptap.dev/docs/editor/extensions/functionality/starterkit
//
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

  if (!editor) {
    return null
  }

  /* =====================
          return
  ====================== */

  return (
    <div
      {...otherProps}
      data-slot='tiptap-editor'
      className={cn(baseClasses, className)}
      // This stops event bubbling for all 'Enter' presses within the component.
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.stopPropagation()
          otherProps.onKeyDown?.(e)
        }
      }}
    >
      <MenuBar
        defaultFontFamily={defaultFontFamily}
        disabled={disabled}
        editor={editor}
      />

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
