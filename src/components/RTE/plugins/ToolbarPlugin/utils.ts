/* 
Changes made relative to lexical-playground version:

1. Changed: import { $createCodeNode } from '@lexical/code'
   To:      import { $createCodeNode } from '@lexical/code-core
   https://lexical.dev/docs/api/modules/lexical_code-core

2. Changed the logic for calculateNextFontSize() increment/decrement.
*/

import {
  $addUpdateTag,
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $isElementNode,
  $isLineBreakNode,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  $splitNode,
  SKIP_DOM_SELECTION_TAG,
  SKIP_SELECTION_FOCUS_TAG
} from 'lexical'

import { $createCodeNode } from '@lexical/code-core'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND
} from '@lexical/list'
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode
} from '@lexical/rich-text'
import { $patchStyleText, $setBlocksType } from '@lexical/selection'
import { $isTableSelection } from '@lexical/table'
import { $getNearestBlockElementAncestorOrThrow } from '@lexical/utils'

import {
  DEFAULT_FONT_SIZE,
  MAX_ALLOWED_FONT_SIZE,
  MIN_ALLOWED_FONT_SIZE
} from '../../context/ToolbarContext'

import type {
  ElementNode,
  LexicalEditor,
  LexicalNode,
  RangeSelection
} from 'lexical'

import type { HeadingTagType } from '@lexical/rich-text'

export enum UpdateFontSizeType {
  increment = 1,
  decrement
}

/* ========================================================================
                         
======================================================================== */
/**
 * Calculates the new font size based on the update type.
 * @param currentFontSize - The current font size
 * @param updateType - The type of change, either increment or decrement
 * @returns the next font size
 */
export const calculateNextFontSize = (
  currentFontSize: number,
  updateType: UpdateFontSizeType | null
) => {
  if (!updateType) {
    return currentFontSize
  }

  let updatedFontSize: number = currentFontSize
  switch (updateType) {
    case UpdateFontSizeType.decrement:
      switch (true) {
        case currentFontSize > MAX_ALLOWED_FONT_SIZE:
          updatedFontSize = MAX_ALLOWED_FONT_SIZE
          break

        ///////////////////////////////////////////////////////////////////////////
        //
        // This part was in the playground version. It's unusual to have a bunch of weird
        // rules like this for incrementing.
        //
        // case currentFontSize >= 48:
        //   updatedFontSize -= 12
        //   break
        // case currentFontSize >= 24:
        //   updatedFontSize -= 4
        //   break
        // case currentFontSize >= 14:
        //   updatedFontSize -= 2
        //   break
        // case currentFontSize >= 9:
        //   updatedFontSize -= 1
        //   break
        //
        // I replaced it with the case that immediately follows.
        //
        ///////////////////////////////////////////////////////////////////////////

        case currentFontSize > MIN_ALLOWED_FONT_SIZE - 1:
          updatedFontSize -= 1
          break
        default:
          updatedFontSize = MIN_ALLOWED_FONT_SIZE
          break
      }
      break

    case UpdateFontSizeType.increment:
      switch (true) {
        case currentFontSize < MIN_ALLOWED_FONT_SIZE:
          updatedFontSize = MIN_ALLOWED_FONT_SIZE
          break

        ///////////////////////////////////////////////////////////////////////////
        //
        // This part was in the playground version. It's unusual to have a bunch of weird
        // rules like this for incrementing.
        //
        //
        // case currentFontSize < 12:
        //   updatedFontSize += 1
        //   break
        // case currentFontSize < 20:
        //   updatedFontSize += 2
        //   break
        // case currentFontSize < 36:
        //   updatedFontSize += 4
        //   break
        // case currentFontSize <= 60:
        //   updatedFontSize += 12
        //   break
        //
        // I replaced it with the case that immediately follows.
        //
        ///////////////////////////////////////////////////////////////////////////

        case currentFontSize < MAX_ALLOWED_FONT_SIZE + 1:
          updatedFontSize += 1
          break

        default:
          updatedFontSize = MAX_ALLOWED_FONT_SIZE
          break
      }
      break

    default:
      break
  }
  return updatedFontSize
}

/* ========================================================================
                         
======================================================================== */
/**
 * Patches the selection with the updated font size.
 */
export const updateFontSizeInSelection = (
  editor: LexicalEditor,
  newFontSize: string | null,
  updateType: UpdateFontSizeType | null,
  skipRefocus: boolean
) => {
  const getNextFontSize = (prevFontSize: string | null): string => {
    if (!prevFontSize) {
      prevFontSize = `${DEFAULT_FONT_SIZE}px`
    }
    prevFontSize = prevFontSize.slice(0, -2)
    const nextFontSize = calculateNextFontSize(Number(prevFontSize), updateType)
    return `${nextFontSize}px`
  }

  editor.update(() => {
    if (skipRefocus) {
      $addUpdateTag(SKIP_DOM_SELECTION_TAG)
    }
    if (editor.isEditable()) {
      const selection = $getSelection()
      if (selection !== null) {
        $patchStyleText(selection, {
          'font-size': newFontSize || getNextFontSize
        })
      }
    }
  })
}

/* ========================================================================
                         
======================================================================== */

export const updateFontSize = (
  editor: LexicalEditor,
  updateType: UpdateFontSizeType,
  inputValue: string,
  skipRefocus: boolean = false
) => {
  if (inputValue !== '') {
    const nextFontSize = calculateNextFontSize(Number(inputValue), updateType)
    updateFontSizeInSelection(
      editor,
      String(nextFontSize) + 'px',
      null,
      skipRefocus
    )
  } else {
    updateFontSizeInSelection(editor, null, updateType, skipRefocus)
  }
}

/* ========================================================================
                         
======================================================================== */

export const formatParagraph = (editor: LexicalEditor) => {
  editor.update(() => {
    $addUpdateTag(SKIP_SELECTION_FOCUS_TAG)
    const selection = $getSelection()
    $setBlocksType(selection, () => $createParagraphNode())
  })
}

/* ========================================================================
                         
======================================================================== */

export const formatHeading = (
  editor: LexicalEditor,
  blockType: string,
  headingSize: HeadingTagType
) => {
  if (blockType !== headingSize) {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG)
      const selection = $getSelection()
      $setBlocksType(selection, () => $createHeadingNode(headingSize))
    })
  }
}

/* ========================================================================
                         
======================================================================== */

export const formatBulletList = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'bullet') {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG)
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    })
  } else {
    formatParagraph(editor)
  }
}

/* ========================================================================
                         
======================================================================== */

export const formatCheckList = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'check') {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG)
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
    })
  } else {
    formatParagraph(editor)
  }
}

/* ========================================================================
                         
======================================================================== */

export const formatNumberedList = (
  editor: LexicalEditor,
  blockType: string
) => {
  if (blockType !== 'number') {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG)
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    })
  } else {
    formatParagraph(editor)
  }
}

/* ========================================================================
                         
======================================================================== */
//# Here we may want to add back logic for toggling back to formatParagraph()

export const formatQuote = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'quote') {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG)
      const selection = $getSelection()
      $setBlocksType(selection, () => $createQuoteNode())
    })
  }
}

/* ========================================================================
                         
======================================================================== */

function $splitParagraphsByLineBreaks(selection: RangeSelection): void {
  const blocks: Set<ElementNode> = new Set()
  for (const node of selection.getNodes()) {
    const block = $isParagraphNode(node) ? node : $findParagraphParent(node)
    if (block !== null) {
      blocks.add(block)
    }
  }
  for (const point of [selection.anchor, selection.focus]) {
    const block = $findParagraphParent(point.getNode())
    if (block !== null) {
      blocks.add(block)
    }
  }

  const anchorKey = selection.anchor.key
  const anchorOffset = selection.anchor.offset
  const anchorType = selection.anchor.type
  const focusKey = selection.focus.key
  const focusOffset = selection.focus.offset
  const focusType = selection.focus.type

  for (const block of blocks) {
    const children = block.getChildren()
    const lbIndices: number[] = []
    for (let i = 0; i < children.length; i++) {
      if ($isLineBreakNode(children[i])) {
        lbIndices.push(i)
      }
    }
    if (lbIndices.length === 0) {
      continue
    }
    for (let j = lbIndices.length - 1; j >= 0; j--) {
      const [, rightBlock] = $splitNode(block, lbIndices[j])
      const firstChild = rightBlock.getFirstChild()
      if ($isLineBreakNode(firstChild)) {
        firstChild.remove()
      }
    }
  }

  const newSelection = $createRangeSelection()
  newSelection.anchor.set(anchorKey, anchorOffset, anchorType)
  newSelection.focus.set(focusKey, focusOffset, focusType)
  $setSelection(newSelection)
}

/* ========================================================================
                         
======================================================================== */

function $findParagraphParent(node: LexicalNode): ElementNode | null {
  if ($isParagraphNode(node)) {
    return node
  }
  const parent = node.getParent()
  return $isElementNode(parent) && $isParagraphNode(parent) ? parent : null
}

/* ========================================================================
                         
======================================================================== */

export const formatCode = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'code') {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG)
      let selection = $getSelection()
      if (!selection) {
        return
      }
      if (!$isRangeSelection(selection) || selection.isCollapsed()) {
        $setBlocksType(selection, () => $createCodeNode())
      } else {
        $splitParagraphsByLineBreaks(selection)
        selection = $getSelection()
        if (!$isRangeSelection(selection)) {
          return
        }
        const textContent = selection.getTextContent()
        const codeNode = $createCodeNode()
        selection.insertNodes([codeNode])
        selection = $getSelection()
        if ($isRangeSelection(selection)) {
          selection.insertRawText(textContent)
        }
      }
    })
  }
}

/* ========================================================================
                         
======================================================================== */

export const clearFormatting = (
  editor: LexicalEditor,
  skipRefocus: boolean = false
) => {
  editor.update(() => {
    if (skipRefocus) {
      $addUpdateTag(SKIP_DOM_SELECTION_TAG)
    }
    const selection = $getSelection()
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      const anchor = selection.anchor
      const focus = selection.focus
      const extractedNodes = selection.extract()

      if (anchor.key === focus.key && anchor.offset === focus.offset) {
        return
      }

      extractedNodes.forEach((node) => {
        if ($isTextNode(node)) {
          if (node.getStyle() !== '') {
            node.setStyle('')
          }
          if (node.getFormat() !== 0) {
            node.setFormat(0)
          }
          const nearestBlockElement =
            $getNearestBlockElementAncestorOrThrow(node)
          if (nearestBlockElement.getFormat() !== 0) {
            nearestBlockElement.setFormat('')
          }
          if (nearestBlockElement.getIndent() !== 0) {
            nearestBlockElement.setIndent(0)
          }
        } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
          node.replace($createParagraphNode(), true)
        } else if ($isDecoratorBlockNode(node)) {
          node.setFormat('')
        }
      })
    }
  })
}
