import { getBlockType } from './utils'

import type { Editor } from '@tiptap/core'
import type { EditorStateSnapshot } from '@tiptap/react'

/* ========================================================================

======================================================================== */
// Prefer ternary operator over nullish coalescing operator for all properties.

export function menuBarStateSelector(ctx: EditorStateSnapshot<Editor | null>) {
  if (!ctx.editor) return null // Added this and null to EditorStateSnapshot<Editor | null>

  /* ======================
          return
  ====================== */

  return {
    blockType: getBlockType(ctx.editor),

    // Text formatting
    isBold: ctx.editor.isActive('bold') ? true : false,
    canBold: ctx.editor.can().chain().toggleBold().run() ? true : false,
    isItalic: ctx.editor.isActive('italic') ? true : false,
    canItalic: ctx.editor.can().chain().toggleItalic().run() ? true : false,

    //# Test this...
    isUnderline: ctx.editor.isActive('underline') ? true : false,
    canUnderline: ctx.editor.can().chain().toggleUnderline().run()
      ? true
      : false,

    isStrike: ctx.editor.isActive('strike') ? true : false,
    canStrike: ctx.editor.can().chain().toggleStrike().run() ? true : false,
    isCode: ctx.editor.isActive('code') ? true : false,
    canCode: ctx.editor.can().chain().toggleCode().run() ? true : false,
    canClearMarks: ctx.editor.can().chain().unsetAllMarks().run()
      ? true
      : false,

    // Block types

    ///////////////////////////////////////////////////////////////////////////
    //
    // ⚠️ Gotcha:
    //
    // https://github.com/ueberdosis/tiptap/issues/1058
    // isActive('paragraph') returns true inside most other node types (lists, blockquotes, tables)
    // because they all nest a <p> within them. This is a known, long-standing Tiptap issue.
    //
    //   ❌ isParagraph: ctx.editor.isActive('paragraph') ? true : false,
    //
    // The Tiptap team has never added an "exclusive" or  "isActiveOnly" mode.
    //
    ///////////////////////////////////////////////////////////////////////////

    isParagraph:
      ctx.editor.isActive('paragraph') &&
      !ctx.editor.isActive('bulletList') &&
      !ctx.editor.isActive('orderedList') &&
      !ctx.editor.isActive('blockquote')
        ? true
        : false,

    isHeading1: ctx.editor.isActive('heading', { level: 1 }) ? true : false,
    isHeading2: ctx.editor.isActive('heading', { level: 2 }) ? true : false,
    isHeading3: ctx.editor.isActive('heading', { level: 3 }) ? true : false,
    isHeading4: ctx.editor.isActive('heading', { level: 4 }) ? true : false,
    isHeading5: ctx.editor.isActive('heading', { level: 5 }) ? true : false,
    isHeading6: ctx.editor.isActive('heading', { level: 6 }) ? true : false,

    // Lists and blocks
    isBulletList: ctx.editor.isActive('bulletList') ? true : false,
    isOrderedList: ctx.editor.isActive('orderedList') ? true : false,
    isCodeBlock: ctx.editor.isActive('codeBlock') ? true : false,
    isBlockquote: ctx.editor.isActive('blockquote') ? true : false,

    // History
    canUndo: ctx.editor.can().chain().undo().run() ? true : false,
    canRedo: ctx.editor.can().chain().redo().run() ? true : false,

    // Highlight
    isHighlight: ctx.editor.isActive('highlight') ? true : false,
    //# Ask AI when this would ever not be true, or if it's redundant.
    canHighlight: ctx.editor.can().chain().toggleHighlight().run()
      ? true
      : false,

    // Alignment
    isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }) ? true : false,
    canAlignLeft: ctx.editor.can().chain().toggleTextAlign('left').run(),
    isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }) ? true : false,
    canAlignCenter: ctx.editor.can().chain().toggleTextAlign('center').run(),
    //# Ask AI when this would ever not be true, or if it's redundant.
    isAlignRight: ctx.editor.isActive({ textAlign: 'right' }) ? true : false,
    canAlignRight: ctx.editor.can().chain().toggleTextAlign('right').run(),
    isAlignJustify: ctx.editor.isActive({ textAlign: 'justify' })
      ? true
      : false,
    canAlignJustify: ctx.editor.can().chain().toggleTextAlign('justify').run()
  }
}

export type MenuBarState = ReturnType<typeof menuBarStateSelector>
