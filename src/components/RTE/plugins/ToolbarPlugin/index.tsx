// https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx

import './ToolbarPlugin.css'
import { useCallback, useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $findMatchingParent,
  // $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  $isEditorIsNestedEditor,
  IS_APPLE,
  mergeRegister
} from '@lexical/utils'

import {
  $addUpdateTag,
  // $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  // $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  // OMMAND_PRIORITY_NORMAL,
  FORMAT_TEXT_COMMAND,
  HISTORIC_TAG,
  // KEY_DOWN_COMMAND, // ❌ KEY_MODIFIER_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  SKIP_DOM_SELECTION_TAG,
  SKIP_SELECTION_FOCUS_TAG,
  UNDO_COMMAND
} from 'lexical'

import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'

import {
  $isListNode,
  ListNode
  // Previous version used REMOVE_LIST_COMMAND, but now we're using formatParagraph()
  // instead of: editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
} from '@lexical/list'

import {
  $isHeadingNode
  // $isQuoteNode
} from '@lexical/rich-text'

import {
  $isTableNode
  // $isTableSelection
} from '@lexical/table'

import { $isCodeNode } from '@lexical/code-core'

// import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'

import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText
} from '@lexical/selection'

import {
  getCodeLanguageOptions as getCodeLanguageOptionsPrism,
  normalizeCodeLanguage as normalizeCodeLanguagePrism
} from '@lexical/code-prism'

import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin'

import { INSERT_HORIZONTAL_RULE_COMMAND } from '../../nodes/HorizontalRuleNode'

// import { INSERT_SQUARE_COMMAND } from '../../nodes/SquareNode'

import { getSelectedNode } from '../../utils/getSelectedNode'

import { EmbedConfigs } from '../AutoEmbedPlugin'

import { sanitizeUrl } from '../../utils/url'

import useModal from '../../hooks/useModal'

import {
  DEFAULT_FONT_SIZE,
  blockTypeToBlockName,
  useToolbarState
} from '../../context/ToolbarContext'

///////////////////////////////////////////////////////////////////////////
//
// The logic for ImagesPlugin, ImageNode, ImageComponent and ImageResizer is
// very complex. It was taken from the Lexical playground example, then
// simplified by removing all code related to captions. Thus it still retains
// resizing and centering feature. Nonetheless, it's not something that I really
// understand, but it works.
//
// For a much more basic example, see here:
//
//   https://codesandbox.io/s/lexical-image-plugin-example-iy2bc5?file=/src/plugins/ImageToolbar.tsx:1016-1134
//
///////////////////////////////////////////////////////////////////////////

//* The new version does this. Note that InsertImageDialog
//* no longer comes from ImagesPlugin
// import {
//   INSERT_IMAGE_COMMAND,
//   InsertImageDialog,
//   InsertImagePayload
// } from '../ImagesExtension'

import { InsertImageDialog } from '../ImagesPlugin'
import { InsertInlineImageDialog } from '../InlineImagePlugin'
import { isKeyboardInput } from '../../utils/focusUtils'
import DropDown, { DropDownItem } from '../../ui/Dropdown'
import DropdownColorPicker from '../../ui/DropdownColorPicker'

import ShortcutsPlugin from '../ShortcutsPlugin'
import { BlockFormatDropDown } from './BlockFormatDropDown'
import { FontFamilyDropDown } from './FontFamilyDropDown'
import { Divider } from './Divider'

import { FontSizeDropDown } from './FontSizeDropDown'
import FontSize, { parseFontSizeForToolbar } from './FontSize'

import { AdditionalFormatDropDown } from './AdditionalFormatDropDown'

import { ElementFormatDropDown } from './ElementFormatDropDown'

import type { Dispatch, JSX } from 'react'
import type {
  CommandPayloadType,
  // ElementFormatType,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  TextFormatType
} from 'lexical'

/* ======================

====================== */
//* We may no longer need this because IS_APPLE is imported from @lexical/utils

// The official example does this, but I did it all locally.
// import { IS_APPLE } from 'shared/environment'

// export const CAN_USE_DOM: boolean =
//   typeof window !== 'undefined' &&
//   typeof window.document !== 'undefined' &&
//   typeof window.document.createElement !== 'undefined'

// const IS_APPLE: boolean = CAN_USE_DOM && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

/* ======================

====================== */

function $findTopLevelElement(node: LexicalNode) {
  let topLevelElement =
    node.getKey() === 'root'
      ? node
      : $findMatchingParent(node, (e) => {
          const parent = e.getParent()
          return parent !== null && $isRootOrShadowRoot(parent)
        })

  if (topLevelElement === null) {
    topLevelElement = node.getTopLevelElementOrThrow()
  }
  return topLevelElement
}

/* ======================

====================== */

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active rte-dropdown-item-active'
  } else {
    return ''
  }
}

/* ======================

====================== */

const CODE_LANGUAGE_OPTIONS_PRISM: [string, string][] =
  getCodeLanguageOptionsPrism().filter((option) =>
    [
      'c',
      'clike',
      'cpp',
      'css',
      'html',
      'java',
      'js',
      'javascript',
      'markdown',
      'objc',
      'objective-c',
      'plain',
      'powershell',
      'py',
      'python',
      'rust',
      'sql',
      'swift',
      'typescript',
      'xml'
    ].includes(option[0])
  )

/* ========================================================================
                              ToolbarPlugin()            
======================================================================== */
//# Next Steps:

//# Add focus styles

//# Review old ColorPicker and fix styles on new one.

//# Consider changing the DraggableBlockPlugin/index.css to use the rte-* prefix as before.

//# Review useAPI({ apiRef, contentEditableRef }) in the main RTE/index.tsx file?
//# Is this a custom hook that I made?
//# It's not part of the official lexical-playground/src/hooks.

//# When Updating AutoEmbedPlugin, I had to update YoutubePlugin and YoutubeNode.
//# The YoutubeNode previously had custom logic in it for sizing and centering.
//# That no longer exists in the current version.
//# Similarly, in te old AutoEmbedPlugin -> PlaygroundEmbedConfig, there was both
//# width and insertNode props, so overall the AutoEmbedPlugin/YoutubePlugin/YoutubeNode
//# Still needs updating to get back to the previous abilities.

//# The numbering isn't showing up in the dangerouslySetInnerHTML for CodeHighlightPrismPlugin

//# Once everything is sufficiently wired up, do a deep dive on all CSS files, compared to
//# current ones on GitHub.

//# There are several spots in this RTE that make use of window. This can potentially be
//# problematic for server-side rendering.

//# Once ShortcutsPlugin is implemented, update:
//# - BlockFormatDropDown.tsx.
//# - FontSize.tsx
//# - AdditionalFormatDropDown.ts.
//# - ElementFormatDropDown.tsx

//# Bonus:
//# Once everything is working, consider adding the Shiki logic back in.
//# You don't need to add SettingsContext.tsx
//# Just make it the default, or hardcode these values internally: isCodeHighlighted, isCodeShiki
//# Then be sure to update all places where those values are intended to be used.

export const ToolbarPlugin = ({
  // This is associated to the 4th useEffect() below.
  // I'm not sure if I added all this myself or if it was part of an earlier playground example.
  // In any case, newer version don't have a 4th useEffect()
  setIsLinkEditMode
}: {
  setIsLinkEditMode: Dispatch<boolean>
}): JSX.Element => {
  /* ======================
          state
  ====================== */

  // In the lexical-playground example, both editor and activeEditor are passed in as props.
  // For the most part, this works fine
  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  )
  const [modal, showModal] = useModal()
  const [isEditable, setIsEditable] = useState(() => editor.isEditable())
  const { toolbarState, updateToolbarState } = useToolbarState()

  /* ======================

  ====================== */

  const dispatchToolbarCommand = <T extends LexicalCommand<unknown>>(
    command: T,
    payload: CommandPayloadType<T> | undefined = undefined,
    skipRefocus: boolean = false
  ) => {
    activeEditor.update(() => {
      if (skipRefocus) {
        $addUpdateTag(SKIP_DOM_SELECTION_TAG)
      }

      // Re-assert on Type so that payload can have a default param
      activeEditor.dispatchCommand(command, payload as CommandPayloadType<T>)
    })
  }

  /* ======================
  dispatchFormatTextCommand()
  ====================== */

  const _dispatchFormatTextCommand = (
    payload: TextFormatType,
    skipRefocus: boolean = false
  ) => dispatchToolbarCommand(FORMAT_TEXT_COMMAND, payload, skipRefocus)

  /* ======================
    $handleHeadingNode()
  ====================== */

  const $handleHeadingNode = useCallback(
    (selectedElement: LexicalNode) => {
      // 'paragraph', 'code', etc.
      const type = $isHeadingNode(selectedElement)
        ? selectedElement.getTag()
        : selectedElement.getType()

      if (type in blockTypeToBlockName) {
        updateToolbarState(
          'blockType',
          type as keyof typeof blockTypeToBlockName
        )
      }

      // ⚠️ Gotcha: This is necessary when backspacing on a 'code' blockType
      // in order to switch the 'code' blockType back to a 'paragraph'.
      if (type === 'custom-paragraph') {
        updateToolbarState('blockType', 'paragraph')
      }
    },
    [updateToolbarState]
  )

  /* ======================
      ⚠️ Omit Settings 
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // The lexical-playground version adds:
  //
  //   const { settings: { isCodeHighlighted, isCodeShiki } } = useSettings()
  //
  // The lexical-playground has a sidebar which allows one to toggle:
  //
  //   - Enable Code Highlighting
  //   - Use Shiki for Code Highlighting
  //
  // This also corresponds to SettingsContext.tsx, and the default settings in appSettings.ts:
  //
  //   isCodeHighlighted: true,
  //   isCodeShiki: false,
  //
  // However, in the case of this Lexical editor, we can simply omit isCodeHighlighted because
  // we always want to have the code highlighting dropdown (i.e., the language selector).
  // Moreover, we can omit any use of isCodeShiki, and just stick with the Prism implementation (i.e., Prism Dropdown).
  //
  ///////////////////////////////////////////////////////////////////////////

  /* ======================
      $handleCodeNode()
  ====================== */
  // ⚠️ $handleCodeNode has been modified here to only support Prism logic,
  // rather than also having conditional logic for Shiki. In other words,
  // it's not using isCodeHighlighted, isCodeShiki, etc.

  const $handleCodeNode = useCallback(
    (element: LexicalNode) => {
      if ($isCodeNode(element)) {
        const language = element.getLanguage() || ''

        updateToolbarState(
          'codeLanguage',
          language ? normalizeCodeLanguagePrism(language) : ''
        )
      }
    },
    [updateToolbarState]
  )

  /* ======================
      $updateToolbar()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Called in first three useEffects below.
  // The job of $updateToolbar() is to read the current editor state and sync the toolbar UI to match it.
  // Whenever something changes in the editor — the cursor moves, text is typed, a node is inserted —
  // the toolbar needs to reflect what's happening at the current selection.
  // $updateToolbar does that by inspecting the selection and updating toolbar state
  // (block type, formatting flags like bold/italic, whether we're in a link, etc.).
  //
  ///////////////////////////////////////////////////////////////////////////

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      // ⚠️ Not sure if I'm currently using 'image-caption-container'
      if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
        const rootElement = activeEditor.getRootElement()
        updateToolbarState(
          'isImageCaption',
          !!rootElement?.parentElement?.classList.contains(
            'image-caption-container'
          )
        )
      } else {
        updateToolbarState('isImageCaption', false)
      }

      const anchorNode = selection.anchor.getNode()

      let element = $findTopLevelElement(anchorNode)

      // ⚠️ Newer version doesn't do this.
      // Why am I doing this? Is it necessary or useful?
      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow()
      }

      const elementKey = element.getKey()
      const elementDOM = activeEditor.getElementByKey(elementKey)

      //^ RTL
      // Not really sure how this works.
      // Maybe the start/end alignment options are what control this...
      updateToolbarState('isRTL', $isParentElementRTL(selection))

      //^ LinkNodes
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      const isLink = $isLinkNode(parent) || $isLinkNode(node)
      updateToolbarState('isLink', isLink)

      //^ TableNode/RootNode: Set rootType based on if tableNode or not.
      const tableNode = $findMatchingParent(node, $isTableNode)
      if ($isTableNode(tableNode)) {
        updateToolbarState('rootType', 'table')
      } else {
        updateToolbarState('rootType', 'root')
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey)
        //^ ListNodes
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          )
          const type = parentList
            ? parentList.getListType()
            : element.getListType()

          updateToolbarState('blockType', type)
        } else {
          //^ HeadingNodes
          $handleHeadingNode(element)

          //^ CodeNodes
          $handleCodeNode(element)
        }
      }

      //^ Handle buttons
      updateToolbarState(
        'fontColor',
        $getSelectionStyleValueForProperty(selection, 'color', '#000')
      )

      updateToolbarState(
        'bgColor',
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff'
        )
      )

      updateToolbarState(
        'fontFamily',
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial')
      )

      let matchingParent
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        )
      }

      // If matchingParent is a valid node, pass it's format type
      updateToolbarState(
        'elementFormat',
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left'
      )
    }

    //^ Update text format
    if ($isRangeSelection(selection)) {
      updateToolbarState('isBold', selection.hasFormat('bold'))

      updateToolbarState('isItalic', selection.hasFormat('italic'))

      updateToolbarState('isUnderline', selection.hasFormat('underline'))

      updateToolbarState(
        'isStrikethrough',
        selection.hasFormat('strikethrough')
      )

      updateToolbarState('isSubscript', selection.hasFormat('subscript'))

      updateToolbarState('isSuperscript', selection.hasFormat('superscript'))

      updateToolbarState('isHighlight', selection.hasFormat('highlight'))

      updateToolbarState('isCode', selection.hasFormat('code'))

      updateToolbarState(
        'fontSize',
        $getSelectionStyleValueForProperty(
          selection,
          'font-size',
          `${DEFAULT_FONT_SIZE}px`
        )
      )

      updateToolbarState('isLowercase', selection.hasFormat('lowercase'))

      updateToolbarState('isUppercase', selection.hasFormat('uppercase'))

      updateToolbarState('isCapitalize', selection.hasFormat('capitalize'))
    }

    // This block only runs when the selection is a NodeSelection
    // A NodeSelection is when one or more whole nodes are selected as discrete objects,
    // rather than a text cursor spanning characters. The classic example is clicking on
    // an image — you're not placing a text cursor, you're selecting the image node itself.
    if ($isNodeSelection(selection)) {
      const nodes = selection.getNodes()
      for (const selectedNode of nodes) {
        // Handles the edge case where a selected node (e.g. an image) happens to live inside
        // a list item. The toolbar should still reflect that you're in a list context, so it
        // walks up the tree to find the nearest ListNode and updates blockType accordingly.
        const parentList = $getNearestNodeOfType<ListNode>(
          selectedNode,
          ListNode
        )
        if (parentList) {
          const type = parentList.getListType()
          updateToolbarState('blockType', type)
        } else {
          const selectedElement = $findTopLevelElement(selectedNode)
          $handleHeadingNode(selectedElement)
          $handleCodeNode(selectedElement)
          // Update elementFormat for node selection (e.g., images)
          if ($isElementNode(selectedElement)) {
            updateToolbarState('elementFormat', selectedElement.getFormatType())
          }
        }
      }
    }
  }, [
    activeEditor,
    editor,
    updateToolbarState,
    $handleHeadingNode,
    $handleCodeNode
  ])

  /* ======================
        useEffect() 1 
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // As far as I can tell, this useEffect ony runs on mount.
  // However, the SELECTION_CHANGE_COMMAND callback fires whenever the user
  // moves the cursor or changes their selection — clicking somewhere, pressing arrow keys, etc.
  //
  // Why fire $updateToolbar()? The selection changed, so the toolbar context may have changed entirely.
  // The cursor might have moved from a heading into a list, or into a link.
  // The toolbar needs to resync to wherever the cursor now is.
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        // console.log('\nSelection Changed')
        setActiveEditor(newEditor)
        $updateToolbar()
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
    // The lexical-playground source code adds setActiveEditor to the dependency array.
    // However, that's only necessary because it's passed in as a prop rather than defined internally.
  }, [editor, $updateToolbar])

  /* ======================
        useEffect() 2
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Here we're calling $updateToolbar() whenever the activeEditor changes.
  // When the active editor switches — say the user clicks into a table cell
  // which has its own nested editor — the toolbar needs to immediately reflect
  // that new editor's current state, not the previous one's. This reads the new
  // active editor's state right away and syncs the toolbar.
  //
  // The activeEditor changes when we call setActiveEditor(newEditor) in the first useEffect().
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    activeEditor.getEditorState().read(
      () => {
        $updateToolbar()
      },
      ///////////////////////////////////////////////////////////////////////////
      //
      // What {editor: activeEditor} does
      //
      //   When Lexical executes a read() callback, it establishes an internal active editor context
      //   — essentially a thread-local pointer saying "this is the editor you're currently reading from."
      //   Many $-prefixed functions inside that callback implicitly rely on this context to know which editor to operate against.
      //   Passing {editor: activeEditor} explicitly sets that context to activeEditor for the duration of the callback.
      //
      // Why it matters
      //
      //   Without it, the context defaults to whichever editor getEditorState() is called on — which sounds fine,
      //   since that is activeEditor. But the issue arises with nested editors (e.g. a table cell editor).
      //   When activeEditor is a nested editor instance, without the explicit option, some internal Lexical resolution
      //   can fall back to the root editor as the context. This means $updateToolbar might call things like $getSelection()
      //   or $getRoot() and get results from the wrong editor — the root — rather than the nested one the user is actually interacting with.
      //
      //   Tables are the main place in the playground where nested editors appear.
      //   Table cells become their own editors: https://github.com/facebook/lexical/issues/2792
      //
      ///////////////////////////////////////////////////////////////////////////
      { editor: activeEditor }
    )
  }, [activeEditor, $updateToolbar])

  /* ======================
        useEffect() 3 
  ====================== */
  // It bundles four listeners together with mergeRegister (which
  // just means they all get cleaned up together on unmount).

  useEffect(() => {
    return mergeRegister(
      // registerEditableListener — fires when the editor is toggled read-only vs editable.
      // Updates isEditable state so the toolbar can disable its buttons.
      editor.registerEditableListener((editable) => {
        setIsEditable(editable)
      }),

      // registerUpdateListener — fires after any editor state change (typing, formatting, paste, undo, etc.).
      // This is the broadest net — it calls $updateToolbar so the toolbar stays in sync after any content mutation.
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar()
          },
          { editor: activeEditor }
        )
      }),

      // CAN_UNDO_COMMAND / CAN_REDO_COMMAND — Lexical dispatches these automatically when the undo/redo stack changes.
      // They just flip canUndo and canRedo in toolbar state to enable/disable those buttons.

      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          updateToolbarState('canUndo', payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      ),

      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          updateToolbarState('canRedo', payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      )
    )
  }, [$updateToolbar, activeEditor, editor, updateToolbarState])

  /* ======================
        useEffect() 4 
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // This useEffect() was previously part of the lexical-playground example.
  // It handled Ctrl/Cmd+K as a keyboard shortcut to toggle a link on the current selection:
  //
  //   - If the cursor was not in a link → set link edit mode to true, dispatch TOGGLE_LINK_COMMAND
  //     with a starter URL (https://), which would open the floating link editor
  //
  //   - If the cursor was already in a link → set link edit mode to false, dispatch TOGGLE_LINK_COMMAND
  //     with null, which removes the link
  //
  // However, they removed it. Why?
  // It didn't belong in ToolbarPlugin conceptually. A keyboard shortcut isn't toolbar logic — it's editor
  // input handling. Putting it in ToolbarPlugin was a separation-of-concerns issue. The playground now
  // has a dedicated ShortcutsPlugin that owns all keyboard shortcuts (Ctrl+K for links, plus others),
  // keeping ToolbarPlugin focused purely on reflecting and controlling toolbar state.
  //
  // The CHANGELOG gives us the answer directly. KEY_MODIFIER_COMMAND was deprecated,
  // and the playground shortcuts were migrated to use KEY_DOWN_COMMAND instead (#7472).
  // The logic moved out of ToolbarPlugin entirely and into the dedicated.
  // The logic moved out of ToolbarPlugin entirely and into the dedicated ShortcutsPlugin you can see imported in Editor.tsx.
  //
  ///////////////////////////////////////////////////////////////////////////

  // const toolbarStateIsLink = toolbarState.isLink
  // useEffect(() => {
  //   return activeEditor.registerCommand(
  //     KEY_DOWN_COMMAND, // ❌ KEY_MODIFIER_COMMAND,
  //     (payload) => {
  //       const event: KeyboardEvent = payload
  //       const { code, ctrlKey, metaKey } = event

  //       if (code === 'KeyK' && (ctrlKey || metaKey)) {
  //         event.preventDefault()
  //         let url: string | null

  //         if (!toolbarStateIsLink) {
  //           setIsLinkEditMode(true)
  //           url = sanitizeUrl('https://')
  //         } else {
  //           setIsLinkEditMode(false)
  //           url = null
  //         }
  //         return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
  //       }
  //       return false
  //     },
  //     COMMAND_PRIORITY_NORMAL
  //   )
  // }, [activeEditor, toolbarStateIsLink, setIsLinkEditMode])

  /* ======================
      applyStyleText() 
  ====================== */
  // Used by onFontColorSelect which is then used by DropdownColorPicker (text) onChange.
  // Used by onBgColorSelect which is then used by DropdownColorPicker (background) onChange.

  const applyStyleText = useCallback(
    (
      styles: Record<string, string>,
      skipHistoryStack?: boolean,
      skipRefocus: boolean = false
    ) => {
      activeEditor.update(
        () => {
          if (skipRefocus) {
            $addUpdateTag(SKIP_DOM_SELECTION_TAG)
          }
          const selection = $getSelection()
          if (selection !== null) {
            $patchStyleText(selection, styles)
          }
        },
        skipHistoryStack ? { tag: HISTORIC_TAG } : {}
      )
    },
    [activeEditor]
  )

  /* ======================
     onFontColorSelect() 
  ====================== */
  // Used by DropdownColorPicker (text) onChange.

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean, skipRefocus: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack, skipRefocus)
    },
    [applyStyleText]
  )

  /* ======================
      onBgColorSelect() 
  ====================== */
  // Used by DropdownColorPicker (background) onChange.

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean, skipRefocus: boolean) => {
      applyStyleText(
        { 'background-color': value },
        skipHistoryStack,
        skipRefocus
      )
    },
    [applyStyleText]
  )

  /* ======================
        insertLink() 
  ====================== */
  // Used by the insert link button's onClick.

  const insertLink = useCallback(() => {
    if (!toolbarState.isLink) {
      setIsLinkEditMode(true)
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'))
    } else {
      setIsLinkEditMode(false)
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [activeEditor, setIsLinkEditMode, toolbarState.isLink])

  /* ======================
    onCodeLanguageSelect()
  ====================== */
  // Used by Prism and Shiki Dropdowns onClick

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        $addUpdateTag(SKIP_SELECTION_FOCUS_TAG)
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey)
          if ($isCodeNode(node)) {
            node.setLanguage(value)
          }
        }
      })
    },
    [activeEditor, selectedElementKey]
  )

  /* ======================
    onCodeThemeSelect()
  ====================== */
  // ⚠️ New version of lexical-playground adds this. However, we may
  // not need it because it seems to only be used by Shiki Dropdown

  // const onCodeThemeSelect = useCallback(
  //   (value: string) => {
  //     activeEditor.update(() => {
  //       if (selectedElementKey !== null) {
  //         const node = $getNodeByKey(selectedElementKey)
  //         if ($isCodeNode(node)) {
  //           node.setTheme(value)
  //         }
  //       }
  //     })
  //   },
  //   [activeEditor, selectedElementKey]
  // )

  /* ======================

  ====================== */
  // ⚠️ Only needed if you plan on implementing:
  // Dropdown (insert) -> DropDownItem -> GIF

  // const insertGifOnClick = (payload: InsertImagePayload) => {
  //   activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
  // }

  /* ======================

  ====================== */

  //* const canViewerSeeInsertDropdown = !toolbarState.isImageCaption
  //* const canViewerSeeInsertCodeButton = !toolbarState.isImageCaption

  /* ======================
          return
  ====================== */

  return (
    <div
      className='rte-toolbar'
      style={{
        backgroundColor: 'rgb(245,245,245)',
        borderTopLeftRadius: 'inherit',
        borderTopRightRadius: 'inherit',
        borderBottom: '1px solid #ccc',
        // overflow: 'auto',
        flexWrap: 'wrap',
        padding: 5,
        width: '100%'
      }}
    >
      {/* Demo implementation of SquarePlugin  */}

      {/* <button
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(INSERT_SQUARE_COMMAND, undefined)
        }}
        title={'Insert Square'}
        style={{
          alignSelf: 'center',
          backgroundColor: 'rgb(132, 204, 22)',
          border: '1px solid #65a30d',
          borderRadius: 5,
          color: 'white',
          fontSize: 12,
          fontWeight: 'bold',
          lineHeight: 1,
          padding: '4px 6px',
          userSelect: 'none',
          cursor: 'pointer'
        }}
        type='button'
        aria-label='Insert Square'
      >
        Square
      </button> */}

      {/* =====================
              undo/redo 
      ===================== */}

      <button
        disabled={!toolbarState.canUndo || !isEditable}
        onClick={(e) =>
          dispatchToolbarCommand(UNDO_COMMAND, undefined, isKeyboardInput(e))
        }
        title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
        type='button'
        className='rte-toolbar-item'
        aria-label='Undo'
      >
        <i className='format rte-icon-undo' />
      </button>

      <button
        disabled={!toolbarState.canRedo || !isEditable}
        onClick={(e) =>
          dispatchToolbarCommand(REDO_COMMAND, undefined, isKeyboardInput(e))
        }
        title={IS_APPLE ? 'Redo (⇧⌘Z)' : 'Redo (Ctrl+Y)'}
        type='button'
        className='rte-toolbar-item'
        aria-label='Redo'
      >
        <i className='format rte-icon-redo' />
      </button>

      <Divider />

      {/* =====================
          BlockFormatDropDown
      ===================== */}

      {toolbarState.blockType in blockTypeToBlockName &&
        activeEditor === editor && (
          <>
            <BlockFormatDropDown
              disabled={!isEditable}
              blockType={toolbarState.blockType}
              rootType={toolbarState.rootType}
              editor={activeEditor}
            />
            <Divider />
          </>
        )}

      {/* =============================================================================== */}

      {toolbarState.blockType === 'code' ? (
        <>
          <DropDown
            disabled={!isEditable}
            buttonClassName='rte-toolbar-item rte-code-language'
            buttonLabel={
              (CODE_LANGUAGE_OPTIONS_PRISM.find(
                (opt) =>
                  opt[0] ===
                  normalizeCodeLanguagePrism(toolbarState.codeLanguage)
              ) || ['', ''])[1]
            }
            buttonAriaLabel='Select language'
          >
            {/* Map out the menu items for the selected code language  */}
            {CODE_LANGUAGE_OPTIONS_PRISM.map(([value, name]) => {
              return (
                <DropDownItem
                  className={`rte-item ${dropDownActiveClass(
                    value === toolbarState.codeLanguage
                  )}`}
                  onClick={() => onCodeLanguageSelect(value)}
                  key={value}
                >
                  <span className='rte-text'>{name}</span>
                </DropDownItem>
              )
            })}
          </DropDown>
        </>
      ) : (
        <>
          <FontFamilyDropDown
            disabled={!isEditable}
            value={toolbarState.fontFamily}
            editor={activeEditor}
            title='Font family formatting options'
          />

          <Divider />

          {/* The FontSizeDropDown is more or less redundant with the FontSize component below. 
          I'm leaving it in for now, but in production you might want to comment out one of them.
          Note: This component is not width restricted so as the value changes, there may be a little
          layout shift. */}

          <FontSizeDropDown
            disabled={!isEditable}
            value={toolbarState.fontSize}
            editor={editor}
            title='Font size formatting options'
          />

          <Divider />

          <FontSize
            selectionFontSize={parseFontSizeForToolbar(
              toolbarState.fontSize
            ).slice(0, -2)}
            editor={activeEditor}
            disabled={!isEditable}
          />

          <Divider />

          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
            }}
            className={
              'rte-toolbar-item ' + (toolbarState.isBold ? 'active' : '')
            }
            title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
            type='button'
            aria-label={`Format text as bold. Shortcut: ${
              IS_APPLE ? '⌘B' : 'Ctrl+B'
            }`}
          >
            <i className='format rte-icon-bold' />
          </button>

          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
            }}
            className={
              'rte-toolbar-item ' + (toolbarState.isItalic ? 'active' : '')
            }
            title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
            type='button'
            aria-label={`Format text as italics. Shortcut: ${
              IS_APPLE ? '⌘I' : 'Ctrl+I'
            }`}
          >
            <i className='format rte-icon-italic' />
          </button>

          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
            }}
            className={
              'rte-toolbar-item ' + (toolbarState.isUnderline ? 'active' : '')
            }
            title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
            type='button'
            aria-label={`Format text to underlined. Shortcut: ${
              IS_APPLE ? '⌘U' : 'Ctrl+U'
            }`}
          >
            <i className='format rte-icon-underline' />
          </button>

          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
            }}
            className={
              'rte-toolbar-item ' + (toolbarState.isCode ? 'active' : '')
            }
            title='Insert code block'
            type='button'
            aria-label='Insert code block'
          >
            <i className='format rte-icon-code' />
          </button>

          <button
            disabled={!isEditable}
            onClick={insertLink}
            className={
              'rte-toolbar-item ' + (toolbarState.isLink ? 'active' : '')
            }
            aria-label='Insert link'
            title='Insert link'
            type='button'
          >
            <i className='format rte-icon-link' />
          </button>

          <DropdownColorPicker
            disabled={!isEditable}
            buttonClassName='rte-toolbar-item color-picker'
            buttonAriaLabel='Formatting text color'
            buttonIconClassName='rte-icon-font-color'
            color={toolbarState.fontColor}
            onChange={onFontColorSelect}
            title='text color'
          />

          <DropdownColorPicker
            disabled={!isEditable}
            buttonClassName='rte-toolbar-item color-picker'
            buttonAriaLabel='Formatting background color'
            buttonIconClassName='rte-icon-bg-color'
            color={toolbarState.bgColor}
            onChange={onBgColorSelect}
            title='bg color'
          />

          <AdditionalFormatDropDown
            activeEditor={activeEditor}
            isEditable={isEditable}
          />

          <Divider />

          {/* 
          // Todo: Abstract into it's own component.
          */}

          <DropDown
            disabled={!isEditable}
            buttonClassName='rte-toolbar-item'
            buttonLabel='Insert'
            buttonAriaLabel='Insert specialized editor node'
            buttonIconClassName='rte-icon-plus'
            title='Insert specialized editor node'
          >
            <DropDownItem
              onClick={() =>
                dispatchToolbarCommand(INSERT_HORIZONTAL_RULE_COMMAND)
              }
              className='rte-item'
            >
              <i className='rte-icon-horizontal-rule' />
              <span className='rte-text'>Horizontal Rule</span>
            </DropDownItem>

            <DropDownItem
              className='rte-item'
              onClick={() => {
                showModal('Insert Image', (onClose) => (
                  <InsertImageDialog
                    //# Review InsertImageDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ))
              }}
            >
              <i className='rte-icon-image' />
              <span className='rte-text'>Image</span>
            </DropDownItem>

            {/* 
            //* In newer version of leixical-playground, this seems to no longer
            //* be a part of the Insert dropdown.
            */}

            <DropDownItem
              onClick={() => {
                showModal('Insert Inline Image', (onClose) => (
                  <InsertInlineImageDialog
                    //# Review InsertInlineImageDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ))
              }}
              className='rte-item'
            >
              <i className='rte-icon-image' />
              <span className='rte-text'>Inline Image</span>
            </DropDownItem>

            {EmbedConfigs.map((embedConfig) => (
              <DropDownItem
                key={embedConfig.type}
                onClick={() =>
                  dispatchToolbarCommand(INSERT_EMBED_COMMAND, embedConfig.type)
                }
                className='rte-item'
              >
                {embedConfig.icon}
                <span className='rte-text'>{embedConfig.contentName}</span>
              </DropDownItem>
            ))}
          </DropDown>

          {/* The playground example includes this even when the blockType === 'code'. 
          However, I don't see any point in having alignment options for code blocks.
          Moreover, it looks correct within the editor, but will not currently look correct
          in the exported DOM HTML string. */}
          <Divider />

          <ElementFormatDropDown
            disabled={!isEditable}
            value={toolbarState.elementFormat}
            editor={activeEditor}
            isRTL={toolbarState.isRTL}
          />

          {/* This was added in ToolbarPlugin since this is where activeEditor is defined.
          This works fine for now, but conceptually, it's more appropriate for it to be in RTE. */}

          <ShortcutsPlugin
            editor={activeEditor}
            setIsLinkEditMode={setIsLinkEditMode}
          />
        </>
      )}

      {modal}
    </div>
  )
}
