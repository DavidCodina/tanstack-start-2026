/* 
This node is built off of the deprecated HorizontalRuleNode in the lexical-react package.
https://github.com/facebook/lexical/blob/main/packages/lexical-react/src/LexicalHorizontalRuleNode.tsx

Changes made relative to lexical-playground version:
1. Defined BaseHorizontalRuleNode, INSERT_HORIZONTAL_RULE_COMMAND and $isHorizontalRuleNode
   directly within this file, rather than importing from '@lexical/extension'

  import {
    $isHorizontalRuleNode,
    HorizontalRuleNode as BaseHorizontalRuleNode,
    INSERT_HORIZONTAL_RULE_COMMAND
  } from '@lexical/extension'

  This gives us more ownership over the code.

2. Modified exportDOM()

3. Added exportJSON()
*/

import { useEffect } from 'react'

import {
  $applyNodeReplacement,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  createCommand
} from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import {
  addClassNamesToElement,
  mergeRegister,
  removeClassNamesFromElement
} from '@lexical/utils'

import type { JSX } from 'react'
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey
} from 'lexical'
import type { SerializedHorizontalRuleNode } from '@lexical/extension'

export const INSERT_HORIZONTAL_RULE_COMMAND = createCommand(
  'INSERT_HORIZONTAL_RULE_COMMAND'
)

export { type SerializedHorizontalRuleNode }

/* ========================================================================

======================================================================== */

function HorizontalRuleComponent({ nodeKey }: { nodeKey: NodeKey }) {
  const [editor] = useLexicalComposerContext()
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          const hrElem = editor.getElementByKey(nodeKey)

          if (event.target === hrElem) {
            if (!event.shiftKey) {
              clearSelection()
            }
            setSelected(!isSelected)
            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [clearSelection, editor, isSelected, nodeKey, setSelected])

  useEffect(() => {
    const hrElem = editor.getElementByKey(nodeKey)
    const isSelectedClassName = editor._config.theme.hrSelected ?? 'selected'

    if (hrElem !== null) {
      if (isSelected) {
        addClassNamesToElement(hrElem, isSelectedClassName)
      } else {
        removeClassNamesFromElement(hrElem, isSelectedClassName)
      }
    }
  }, [editor, isSelected, nodeKey])

  return null
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// It would make sense to simply integrate all this directly into HorizontalRuleNode.
// However, I'm keeping this because it reflects what lexical-playground does, and
// will be easier to understand when making future comparisons.
//
// See here for DecoratorNode and LexicalNode source code:
// https://github.com/facebook/lexical/blob/main/packages/lexical/src/nodes/LexicalDecoratorNode.ts
// https://github.com/facebook/lexical/blob/main/packages/lexical/src/LexicalNode.ts
//
///////////////////////////////////////////////////////////////////////////

class BaseHorizontalRuleNode extends DecoratorNode<unknown> {
  static getType(): string {
    return 'horizontalrule'
  }

  static clone(node: HorizontalRuleNode): HorizontalRuleNode {
    return new HorizontalRuleNode(node.__key)
  }

  static importJSON(
    serializedNode: SerializedHorizontalRuleNode
  ): HorizontalRuleNode {
    return $createHorizontalRuleNode().updateFromJSON(serializedNode)
  }

  static importDOM(): DOMConversionMap | null {
    return {
      hr: () => ({
        conversion: $convertHorizontalRuleElement,
        priority: 0
      })
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  //
  // ❌ Originally the BaseHorizontalRuleNode did this:
  //
  //   exportDOM(): DOMExportOutput {
  //     return { element: document.createElement('hr') }
  //   }
  //
  // Instead use super.exportDOM(editor). Why?
  // Because then $generateHtmlFromNodes() will work
  // correctly and pass the className.
  //
  ///////////////////////////////////////////////////////////////////////////

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const { element } = super.exportDOM(editor)
    return { element }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('hr')
    addClassNamesToElement(element, config.theme.hr)
    return element
  }

  getTextContent(): string {
    return '\n'
  }

  isInline(): false {
    return false
  }

  updateDOM(): boolean {
    return false
  }
}

/* ========================================================================

======================================================================== */

export class HorizontalRuleNode extends BaseHorizontalRuleNode {
  static getType(): string {
    return 'horizontalrule'
  }

  static clone(node: HorizontalRuleNode): HorizontalRuleNode {
    return new HorizontalRuleNode(node.__key)
  }

  static importJSON(
    serializedNode: SerializedHorizontalRuleNode
  ): HorizontalRuleNode {
    return $createHorizontalRuleNode().updateFromJSON(serializedNode)
  }

  static importDOM(): DOMConversionMap | null {
    return {
      hr: () => ({
        conversion: $convertHorizontalRuleElement,
        priority: 0
      })
    }
  }

  // ⚠️ exportJSON() was in my previous custom HorizontalRuleNode,
  // but not in the new lexical version.
  exportJSON(): SerializedHorizontalRuleNode {
    return {
      // Inherits indirectly from LexicalNode through DecoratorNode.
      ...super.exportJSON(),
      type: 'horizontalrule',
      version: 1
    }
  }

  // exportDOM is in BaseHorizontalRuleNode

  // createDOM is in BaseHorizontalRuleNode

  // getTextContent is in BaseHorizontalRuleNode

  // isInline is in BaseHorizontalRuleNode

  // updateDOM is in BaseHorizontalRuleNode

  // ⚠️ This is necessary for theme.hrSelected to work.
  decorate(): JSX.Element {
    return <HorizontalRuleComponent nodeKey={this.__key} />
  }
}

/* ========================================================================

======================================================================== */

function $convertHorizontalRuleElement(): DOMConversionOutput {
  return { node: $createHorizontalRuleNode() }
}

/* ========================================================================

======================================================================== */

export function $createHorizontalRuleNode(): HorizontalRuleNode {
  return $applyNodeReplacement(new HorizontalRuleNode())
}

/* ========================================================================

======================================================================== */

export function $isHorizontalRuleNode(
  node: LexicalNode | null | undefined
): node is HorizontalRuleNode {
  return node instanceof HorizontalRuleNode
}
