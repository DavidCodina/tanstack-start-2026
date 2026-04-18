import { getAlignmentType, getBlockType } from './utils'

import type { Editor } from '@tiptap/core'
import type { EditorStateSnapshot } from '@tiptap/react'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: can* checks
//
//  Each .can().chain().<command>().run() call is not free.
//  — Tiptap has to simulate the command to determine feasibility. You have roughly 15+ of those in here.
// If you ever notice performance issues during rapid typing, these are the first suspects.
// The mitigation would be to either memoize them or, more practically, just drop the ones that are almost
// always true (which your "Ask AI" comments are already flagging — good instinct, and I'll answer those below).
//
///////////////////////////////////////////////////////////////////////////

export function menuBarSelector(ctx: EditorStateSnapshot<Editor | null>) {
  if (!ctx.editor) return null // Added this and null to EditorStateSnapshot<Editor | null>

  /* ======================
          return
  ====================== */

  return {
    blockType: getBlockType(ctx.editor),
    alignmentType: getAlignmentType(ctx.editor),

    /* =====================
          History
    ====================== */

    canUndo: ctx.editor.can().chain().undo().run() ? true : false,
    canRedo: ctx.editor.can().chain().redo().run() ? true : false,

    /* =====================
          Block types
    ====================== */
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

    isBulletList: ctx.editor.isActive('bulletList') ? true : false,
    isOrderedList: ctx.editor.isActive('orderedList') ? true : false,
    isCodeBlock: ctx.editor.isActive('codeBlock') ? true : false,
    isBlockquote: ctx.editor.isActive('blockquote') ? true : false,

    /* =====================
        Text Formatting
    ====================== */

    isBold: ctx.editor.isActive('bold') ? true : false,
    // ❌ canBold: ctx.editor.can().chain().toggleBold().run() ? true : false,

    isItalic: ctx.editor.isActive('italic') ? true : false,
    // ❌ canItalic: ctx.editor.can().chain().toggleItalic().run() ? true : false,

    isUnderline: ctx.editor.isActive('underline') ? true : false,
    // ❌ canUnderline: ctx.editor.can().chain().toggleUnderline().run() ? true : false,

    isStrike: ctx.editor.isActive('strike') ? true : false,
    // ❌ canStrike: ctx.editor.can().chain().toggleStrike().run() ? true : false,

    isLink: ctx.editor.isActive('link') ? true : false,
    canSetLink: ctx.editor.can().chain().setLink({ href: '' }).run()
      ? true
      : false,
    canUnsetLink: ctx.editor.can().chain().unsetLink().run() ? true : false,
    currentLinkHref: ctx.editor.isActive('link') // => 'https://www.google.com'
      ? ((ctx.editor.getAttributes('link').href as string) ?? null)
      : null,

    isHighlight: ctx.editor.isActive('highlight') ? true : false,
    // ❌ canHighlight: ctx.editor.can().chain().toggleHighlight().run() ? true : false,

    isCode: ctx.editor.isActive('code') ? true : false,
    // ❌ canCode: ctx.editor.can().chain().toggleCode().run() ? true : false,

    isSuperscript: ctx.editor.isActive('superscript') ? true : false,
    // ❌ canSuperscript: ctx.editor.can().chain().toggleSuperscript().run(),

    isSubscript: ctx.editor.isActive('subscript') ? true : false,
    // ❌ canSubscript: ctx.editor.can().chain().toggleSubscript().run(),

    // ❌ canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ? true : false,

    /* =====================
            Alignment
    ====================== */

    isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }) ? true : false,
    // ❌ canAlignLeft: ctx.editor.can().chain().toggleTextAlign('left').run(),

    isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }) ? true : false,
    // ❌ canAlignCenter: ctx.editor.can().chain().toggleTextAlign('center').run(),

    isAlignRight: ctx.editor.isActive({ textAlign: 'right' }) ? true : false,
    // ❌ canAlignRight: ctx.editor.can().chain().toggleTextAlign('right').run(),

    isAlignJustify: ctx.editor.isActive({ textAlign: 'justify' })
      ? true
      : false,
    // ❌ canAlignJustify: ctx.editor.can().chain().toggleTextAlign('justify').run(),

    isIndent: ctx.editor.isActive('indent') ? true : false,
    // ❌ canIndent: ctx.editor.can().chain().indent().run(),

    isOutdent: ctx.editor.isActive('outdent') ? true : false,
    // ❌ canOutdent: ctx.editor.can().chain().outdent().run(),

    /* =====================
            Color
    ====================== */
    // https://tiptap.dev/docs/editor/extensions/functionality/color
    // https://tiptap.dev/docs/editor/extensions/functionality/background-color

    color: ctx.editor.getAttributes('textStyle').color,
    backgroundColor: ctx.editor.getAttributes('textStyle').backgroundColor,

    /* =====================
              Font
    ====================== */

    fontSize: ctx.editor.getAttributes('textStyle').fontSize,
    fontFamily: ctx.editor.getAttributes('textStyle').fontFamily,

    isArial: ctx.editor.isActive('textStyle', { fontFamily: 'Arial' })
      ? true
      : false,

    isComicSans: ctx.editor.isActive('textStyle', {
      fontFamily: '"Comic Sans MS", "Comic Sans"'
    }),

    isCourier: ctx.editor.isActive('textStyle', { fontFamily: 'Courier' })
      ? true
      : false,

    isCursive: ctx.editor.isActive('textStyle', { fontFamily: 'cursive' })
      ? true
      : false,

    isGeorgia: ctx.editor.isActive('textStyle', { fontFamily: 'Georgia' })
      ? true
      : false,

    isTahoma: ctx.editor.isActive('textStyle', { fontFamily: 'Tahoma' })
      ? true
      : false,

    isTimesNewRoman: ctx.editor.isActive('textStyle', {
      fontFamily: 'Times New Roman'
    })
      ? true
      : false,

    isVerdana: ctx.editor.isActive('textStyle', { fontFamily: 'Verdana' })
      ? true
      : false,

    // isCssVariable: ctx.editor.isActive('textStyle', {
    //   fontFamily: 'var(--font-sans)'
    // })

    /* =====================
            Embeds
    ====================== */

    isYoutube: ctx.editor.isActive('youtube') ? true : false,
    // Used within FomratBubbleMenu.tsx to opt out of showing the bubble menu.
    isCustomYoutube: ctx.editor.isActive('custom-youtube') ? true : false
  }
}

export type MenuBarState = ReturnType<typeof menuBarSelector>
