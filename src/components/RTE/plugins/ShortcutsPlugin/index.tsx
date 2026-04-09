/* 
Changes made relative to lexical-playground version:

1. Removed: import {INSERT_INLINE_COMMAND} from '../CommentPlugin';
   And removed all associated logic.
2. Removed isFormatHeading()
3. Added isHeading1(), isHeading2(), isHeading3().
*/

import { useEffect } from 'react'

import { TOGGLE_LINK_COMMAND } from '@lexical/link'

import {
  COMMAND_PRIORITY_NORMAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  KEY_DOWN_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  isModifierMatch
} from 'lexical'

import { useToolbarState } from '../../context/ToolbarContext'
import { sanitizeUrl } from '../../utils/url'
// import { INSERT_INLINE_COMMAND } from '../CommentPlugin'
import {
  UpdateFontSizeType,
  clearFormatting,
  formatBulletList,
  formatCheckList,
  formatCode,
  formatHeading,
  formatNumberedList,
  formatParagraph,
  formatQuote,
  updateFontSize
} from '../ToolbarPlugin/utils'
import {
  // isAddComment,
  isCapitalize,
  isCenterAlign,
  isClearFormatting,
  isDecreaseFontSize,
  isFormatBulletList,
  isFormatCheckList,
  isFormatCode,
  // ❌ isFormatHeading,
  isFormatNumberedList,
  isFormatParagraph,
  isFormatQuote,
  isHeading1, //  New - instead of isFormatHeading,
  isHeading2, //  New - instead of isFormatHeading,
  isHeading3, //  New - instead of isFormatHeading,
  isIncreaseFontSize,
  isIndent,
  isInsertCodeBlock,
  isInsertLink,
  isJustifyAlign,
  isLeftAlign,
  isLowercase,
  isOutdent,
  isRightAlign,
  isStrikeThrough,
  isSubscript,
  isSuperscript,
  isUppercase
} from './shortcuts'

import type { Dispatch } from 'react'
import type { LexicalEditor } from 'lexical'
// import type { HeadingTagType } from '@lexical/rich-text'

/* ========================================================================
                         
======================================================================== */

export default function ShortcutsPlugin({
  editor,
  setIsLinkEditMode
}: {
  editor: LexicalEditor
  setIsLinkEditMode: Dispatch<boolean>
}): null {
  const { toolbarState } = useToolbarState()

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    const keyboardShortcutsHandler = (event: KeyboardEvent) => {
      // console.log('keyboardShortcutsHandler() event:', event)

      // Short-circuit, a least one modifier must be set
      if (isModifierMatch(event, {})) {
        return false
      }

      //
      else if (isFormatParagraph(event)) {
        formatParagraph(editor)
      }

      // ❌ Removed this
      // else if (isFormatHeading(event)) {
      //   const headingSize = `h${event.key}` as HeadingTagType
      //   formatHeading(editor, toolbarState.blockType, headingSize)
      // }

      // ⚠️ Added this
      else if (isHeading1(event)) {
        formatHeading(editor, toolbarState.blockType, 'h1')
      }

      // ⚠️ Added this
      else if (isHeading2(event)) {
        formatHeading(editor, toolbarState.blockType, 'h2')
      }

      // ⚠️ Added this
      else if (isHeading3(event)) {
        formatHeading(editor, toolbarState.blockType, 'h3')
      }

      //
      else if (isFormatBulletList(event)) {
        formatBulletList(editor, toolbarState.blockType)
      } else if (isFormatNumberedList(event)) {
        formatNumberedList(editor, toolbarState.blockType)
      } else if (isFormatCheckList(event)) {
        formatCheckList(editor, toolbarState.blockType)
      } else if (isFormatCode(event)) {
        formatCode(editor, toolbarState.blockType)
      } else if (isFormatQuote(event)) {
        formatQuote(editor, toolbarState.blockType)
      } else if (isStrikeThrough(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
      } else if (isLowercase(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase')
      } else if (isUppercase(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase')
      } else if (isCapitalize(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'capitalize')
      } else if (isIndent(event)) {
        editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
      } else if (isOutdent(event)) {
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
      } else if (isCenterAlign(event)) {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
      } else if (isLeftAlign(event)) {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
      } else if (isRightAlign(event)) {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
      } else if (isJustifyAlign(event)) {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
      } else if (isSubscript(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
      } else if (isSuperscript(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
      } else if (isInsertCodeBlock(event)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
      } else if (isIncreaseFontSize(event)) {
        updateFontSize(
          editor,
          UpdateFontSizeType.increment,
          toolbarState.fontSizeInputValue
        )
      } else if (isDecreaseFontSize(event)) {
        updateFontSize(
          editor,
          UpdateFontSizeType.decrement,
          toolbarState.fontSizeInputValue
        )
      } else if (isClearFormatting(event)) {
        clearFormatting(editor)
      } else if (isInsertLink(event)) {
        const url = toolbarState.isLink ? null : sanitizeUrl('https://')
        setIsLinkEditMode(!toolbarState.isLink)
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
      }

      // ❌ Removed this
      // else if (isAddComment(event)) {
      //   editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined)
      // }
      else {
        // No match for any of the event handlers
        return false
      }
      event.preventDefault()
      return true
    }

    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      keyboardShortcutsHandler,
      COMMAND_PRIORITY_NORMAL
    )
  }, [
    editor,
    toolbarState.isLink,
    toolbarState.blockType,
    toolbarState.fontSizeInputValue,
    setIsLinkEditMode
  ])

  return null
}
