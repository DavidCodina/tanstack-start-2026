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
  // $createParagraphNode,
  // $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  // $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,

  // FORMAT_TEXT_COMMAND,
  KEY_DOWN_COMMAND, // ❌ KEY_MODIFIER_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
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

import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL
  // $patchStyleText
} from '@lexical/selection'

import {
  //# Used later as part of CODE_LANGUAGE_OPTIONS_PRISM
  // getCodeLanguageOptions as getCodeLanguageOptionsPrism,
  normalizeCodeLanguage as normalizeCodeLanguagePrism
} from '@lexical/code-prism'

import { INSERT_SQUARE_COMMAND } from '../../nodes/SquareNode'

import { getSelectedNode } from '../../utils/getSelectedNode'

import { sanitizeUrl } from '../../utils/url'

import useModal from '../../hooks/useModal'

import {
  DEFAULT_FONT_SIZE,
  blockTypeToBlockName,
  useToolbarState
} from '../../context/ToolbarContext'

import { BlockFormatDropDown } from './BlockFormatDropDown'
import { Divider } from './Divider'

import type { Dispatch, JSX } from 'react'
import type {
  // ElementFormatType,
  LexicalNode,
  NodeKey
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

/* ========================================================================
                              ToolbarPlugin()            
======================================================================== */
//# Next Steps:

//# Review useAPI({ apiRef, contentEditableRef }) in the main RTE/index.tsx file?
//# Is this a custom hook that I made?
//# It's not part of the official lexical-playground/src/hooks.

//# Add back each feature one by one...

// FontDropDown

// Divider

// FontSize

// Divider

// Bold button

// Italic button

// Underline button

// Code button;
// Conditionally shown based off of: canViewerSeeInsertCodeButton
// const canViewerSeeInsertCodeButton = !toolbarState.isImageCaption

// Insert link button

// DropdownColorPicker (text)

// DropdownColorPicker (background)

// Dropdown (formatting)

// Divider

// Dropdown (insert)

// Divider

// ElementFormatDropdown (i.e., alignment)

//# Once everything is wired up, do an in-depth comparison of the current components vs. new components.

//# On top of that we need to bring in and compare/contrast each file/folder from the CURRENT/FULL github
//# lexical-playground/src.
//#
//#   - Editor.tsx
//#   - plugins
//#   - nodes
//#   - themes
//#   - ui
//#   - utils
//#   - context
//#   - hooks
//#   - buildHTMLConfig.tsx
//#   - index.css (???)
//#   - images/icons and images/emoji

//# Implement ShortcutsPlugin.

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
  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)

  // Used by onCodeLanguageSelect()
  const [_selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  )

  const [_modal, _showModal] = useModal()

  const [isEditable, setIsEditable] = useState(() => editor.isEditable())

  const { toolbarState, updateToolbarState } = useToolbarState()

  /* ======================

  ====================== */

  //* Newer version adds the following here
  //* Review to see where/how these are actually used.

  //* dispatchToolbarCommand

  //* dispatchFormatTextCommand

  /* ======================

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

      //^ Set rootType based on if tableNode or not.
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
  //
  //
  // The CHANGELOG gives us the answer directly. KEY_MODIFIER_COMMAND was deprecated,
  // and the playground shortcuts were migrated to use KEY_DOWN_COMMAND instead (#7472).
  // The logic moved out of ToolbarPlugin entirely and into the dedicated.
  // The logic moved out of ToolbarPlugin entirely and into the dedicated ShortcutsPlugin you can see imported in Editor.tsx.
  //
  ///////////////////////////////////////////////////////////////////////////

  const isLink = toolbarState.isLink
  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_DOWN_COMMAND, // ❌ KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload
        const { code, ctrlKey, metaKey } = event

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault()
          let url: string | null

          if (!isLink) {
            setIsLinkEditMode(true)
            url = sanitizeUrl('https://')
          } else {
            setIsLinkEditMode(false)
            url = null
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
        }
        return false
      },
      COMMAND_PRIORITY_NORMAL
    )
  }, [activeEditor, isLink, setIsLinkEditMode])

  /* ======================
      applyStyleText() 
  ====================== */

  // ...

  /* ======================
      clearFormatting() 
  ====================== */
  // ⚠️ The new lexical-playground doesn't explicitly have this.
  // Maybe it moved to ShortcutsPlugin (?).

  // ...

  /* ======================
     onFontColorSelect() 
  ====================== */
  // Used by DropdownColorPicker (text) onChange.

  // ...

  /* ======================
      onBgColorSelect() 
  ====================== */
  // Used by DropdownColorPicker (background) onChange.

  // ...

  /* ======================
        insertLink() 
  ====================== */
  // Used by the insert link button's onClick.

  // ...

  /* ======================
    onCodeLanguageSelect()
  ====================== */
  // Used by Prism and Shiki Dropdowns onClick

  // ...

  /* ======================
    onCodeThemeSelect()
  ====================== */
  // ⚠️ New version of lexical-playground adds this. However, we may
  // not need it because it seems to only be used by Shiki Dropdown

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

      <button
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
      </button>

      {/* =====================
              undo/redo 
      ===================== */}

      <button
        disabled={!toolbarState.canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined)
        }}
        title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
        type='button'
        className='rte-toolbar-item'
        aria-label='Undo'
      >
        <i className='format rte-icon-undo' />
      </button>

      <button
        disabled={!toolbarState.canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined)
        }}
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
          Code Stuff Here...
          {/* 
          It's unclear to me where isCodeHighlighted and isCodeShiki come from.

          Prism Dropdown (conditional)
        
          Shiki Dropdown (conditional)
          */}
        </>
      ) : (
        <>
          Non-Code Stuff Here...
          {/* 

        FontDropDown

        Divider

        FontSize

        Divider

        Bold button

        Italic button

        Underline button

        Code button;
        Conditionally shown based off of: canViewerSeeInsertCodeButton
        const canViewerSeeInsertCodeButton = !toolbarState.isImageCaption

        Insert link button

        DropdownColorPicker (text)

        DropdownColorPicker (background)

        Dropdown (formatting)

        Divider

        Dropdown (insert)

        Divider

        ElementFormatDropdown (i.e., alignment)
        */}
        </>
      )}

      {/* {modal} */}
    </div>
  )
}
