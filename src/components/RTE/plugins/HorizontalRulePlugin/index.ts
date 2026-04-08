/* 
Changes made relative to lexical-playground version:

1. Importing $createHorizontalRuleNode and INSERT_HORIZONTAL_RULE_COMMAND directly
   from '../../nodes/HorizontalRuleNode' rather than from  '@lexical/react/LexicalHorizontalRuleNode'.
   The original import is now deprecated. However, the custom HorizontalRuleNode is basically the 
   same code, but now we have ownership of it, and don't have to worry about it being deleted in
   future versions of Lexical.
*/

import { useEffect } from 'react'

import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR
} from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { $insertNodeToNearestRoot } from '@lexical/utils'

import {
  $createHorizontalRuleNode,
  INSERT_HORIZONTAL_RULE_COMMAND
} from '../../nodes/HorizontalRuleNode' // ❌ '@lexical/react/LexicalHorizontalRuleNode'

/* ========================================================================
                         
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Note: Lexical now has a new framework-agnostic convention that is often
// used instead of plugins.
//
//   https://lexical.dev/docs/extensions/intro
//   https://github.com/facebook/lexical/tree/main/packages/lexical-extension
//   https://github.com/facebook/lexical/blob/main/packages/lexical-extension/src/HorizontalRuleExtension.ts
//
// So no more doing this:
//
//   import { HorizontalRuleNode} from '@lexical/react/LexicalHorizontalRuleNode'
//   import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
//
// For the moment, the packages still exist in the GitHub repo, but they're deprecated.
//
//   https://github.com/facebook/lexical/blob/main/packages/lexical-react/src/LexicalHorizontalRuleNode.tsx
//   https://github.com/facebook/lexical/blob/main/packages/lexical-react/src/LexicalHorizontalRulePlugin.ts
//
// This plugin is essentially a copy of the deprecated lexical import version.
//
///////////////////////////////////////////////////////////////////////////

export function HorizontalRulePlugin(): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_HORIZONTAL_RULE_COMMAND,
      (_type) => {
        const selection = $getSelection()

        if (!$isRangeSelection(selection)) {
          return false
        }

        const focusNode = selection.focus.getNode()

        if (focusNode !== null) {
          const horizontalRuleNode = $createHorizontalRuleNode()
          $insertNodeToNearestRoot(horizontalRuleNode)
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
