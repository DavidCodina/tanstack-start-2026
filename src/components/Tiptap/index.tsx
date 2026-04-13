import './Tiptap.css'
import { EditorContent } from '@tiptap/react'
import { TiptapProvider, useTiptapContext } from './TipTapContext'
import { MenuBar } from './MenuBar'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Tiptap Youtube:         https://www.youtube.com/@tiptap-editor/videos
// ✅ Cand Dev:            https://www.youtube.com/watch?v=QVffer2fRfg //# Start at 13:15
//    Cand Dev:            https://www.youtube.com/watch?v=M3BdmN4etYg
//    StackWild:           https://www.youtube.com/watch?v=s1lpwpeSGW4
//    Age Concepts:        https://www.youtube.com/watch?v=zIm1FYi8A7c
//    Code DPS:            https://www.youtube.com/watch?v=hpQmgLPaCcE&list=PL6yN8EtcWUmYfgln8Vxm5sEde8FroZYt0
//    De Mawo:             https://www.youtube.com/watch?v=MEhVUDP3a_k
//    Solve It Out:        https://www.youtube.com/watch?v=LiELuVk12ig
//
// Examples:               https://tiptap.dev/docs/examples
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

const Tiptap = () => {
  const { editor } = useTiptapContext()

  if (!editor) {
    return null
  }

  /* =====================
          return
  ====================== */

  return (
    <div className='bg-card focus-within:ring-primary/50 mx-auto max-w-[850px] rounded-lg border shadow [--tiptap-min-content-height:250px] focus-within:ring-[3px]'>
      <MenuBar editor={editor} />

      <EditorContent
        data-slot='editor-content'
        // Using resize-y works well for now, but if you run into actual
        // isues where content is hidden by overflow-auto, then you many want
        // to go to a programmatic solution.
        className='min-h-(--tiptap-min-content-height) resize-y overflow-auto'
        editor={editor}
      />
    </div>
  )
}

//! temporary any
const TiptapWithProvider = (props: any) => {
  return (
    <TiptapProvider>
      <Tiptap {...props} />
    </TiptapProvider>
  )
}

export { TiptapWithProvider as Tiptap }

// //
//   {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu> */}
//   {/* <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>  */}
