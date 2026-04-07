/* 
Changes made relative to lexical-playground version:
1. Changed JSX class names.
2. Mofified the associated index.css
3. Added Macrotask / setTimeout around useEffect 4.
*/

import './index.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  // $addUpdateTag,
  $getSelection,
  $isLineBreakNode,
  $isNodeSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
  // SKIP_DOM_SELECTION_TAG,
  getDOMSelection
} from 'lexical'
import {
  $createLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND
} from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'

import { getSelectedNode } from '../../utils/getSelectedNode'
import { setFloatingElemPositionForLinkEditor } from '../../utils/setFloatingElemPositionForLinkEditor'
import { sanitizeUrl } from '../../utils/url'

import type { Dispatch, JSX } from 'react'
import type { BaseSelection, LexicalEditor } from 'lexical'

function preventDefault(
  event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>
): void {
  event.preventDefault()
  event.stopPropagation() //* New for testing...
}

/* ========================================================================

======================================================================== */

function FloatingLinkEditor({
  editor,
  isLink,
  setIsLink,
  anchorElem,
  isLinkEditMode,
  setIsLinkEditMode
}: {
  editor: LexicalEditor
  isLink: boolean
  setIsLink: Dispatch<boolean>
  anchorElem: HTMLElement
  isLinkEditMode: boolean
  setIsLinkEditMode: Dispatch<boolean>
}): React.JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [editedLinkUrl, setEditedLinkUrl] = useState('https://')
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null)

  /* ======================
      $updateLinkEditor()
  ====================== */

  const $updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const linkParent = $findMatchingParent(node, $isLinkNode)

      if (linkParent) {
        setLinkUrl(linkParent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl('')
      }
      if (isLinkEditMode) {
        setEditedLinkUrl(linkUrl)
      }
    } else if ($isNodeSelection(selection)) {
      const nodes = selection.getNodes()
      if (nodes.length > 0) {
        const node = nodes[0]
        const parent = node.getParent()
        if ($isLinkNode(parent)) {
          setLinkUrl(parent.getURL())
        } else if ($isLinkNode(node)) {
          setLinkUrl(node.getURL())
        } else {
          setLinkUrl('')
        }
        if (isLinkEditMode) {
          setEditedLinkUrl(linkUrl)
        }
      }
    }

    const editorElem = editorRef.current
    const nativeSelection = getDOMSelection(editor._window)
    const activeElement = document.activeElement

    if (editorElem === null) {
      return
    }

    const rootElement = editor.getRootElement()

    if (selection !== null && rootElement !== null && editor.isEditable()) {
      let domRect: DOMRect | undefined

      if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes()
        if (nodes.length > 0) {
          const element = editor.getElementByKey(nodes[0].getKey())
          if (element) {
            domRect = element.getBoundingClientRect()
          }
        }
      } else if (
        nativeSelection !== null &&
        rootElement.contains(nativeSelection.anchorNode)
      ) {
        domRect =
          nativeSelection.focusNode?.parentElement?.getBoundingClientRect()
      }

      if (domRect) {
        domRect.y += 40
        setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElem)
      }
      setLastSelection(selection)
    }

    //^ We're looking for the specifc class specified below. See below
    else if (
      !activeElement ||
      activeElement.className !==
        'rte-form-control rte-form-control-sm rte-link-input'
    ) {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchorElem)
      }
      setLastSelection(null)
      setIsLinkEditMode(false)
      setLinkUrl('')
    }

    return true
  }, [anchorElem, editor, setIsLinkEditMode, isLinkEditMode, linkUrl])

  /* ======================
         useEffect() 1
  ====================== */

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement

    const update = () => {
      editor.getEditorState().read(() => {
        $updateLinkEditor()
      })
    }

    window.addEventListener('resize', update)

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update)
    }

    return () => {
      window.removeEventListener('resize', update)

      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update)
      }
    }
  }, [anchorElem.parentElement, editor, $updateLinkEditor])

  /* ======================
         useEffect() 2
  ====================== */

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateLinkEditor()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateLinkEditor()
          return true
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false)
            return true
          }
          return false
        },
        COMMAND_PRIORITY_HIGH
      )
    )
  }, [editor, $updateLinkEditor, setIsLink, isLink])

  /* ======================
         useEffect() 3
  ====================== */

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateLinkEditor()
    })
  }, [editor, $updateLinkEditor])

  /* ======================
        useEffect() 4
  ====================== */

  useEffect(() => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // ⚠️ Gotcha: I don't know why this doesn't happen in lexical-playground, but in this version, if we don't
    // wrap it in setTimeout to create a macro task, then clicking the edit button will cause focus
    // to go to the <input> too soon, but then the input loses focus and it goes to
    //  <div.rte-content-editable-root>, which ultimately causes useEffect 5 to run and immediately
    // call setIsLinkEditMode(false)!
    //
    // Suppose we comment out useEffect 5, the real question is why does the input lose focus?
    // Under normal circumstances, the conditional logic should successfully render the input
    // and focus on it without issue - all in the same tick. Presumably, the lexical editor is
    // aggressively stealing focus based on some internal logic:
    //
    //   https://lexical.dev/docs/concepts/selection#focus
    //
    // For this case, the suggested solution didn't work.
    //
    //   editor.update(() => {
    //     $addUpdateTag(SKIP_DOM_SELECTION_TAG);
    //     // ...
    //   })
    //
    // What does work is brute-forcing by wrapping the logic in a setTimeout to create a macro task,
    // or the more idiomatic approach of using editor.setEditable(false) temporarily. The fact that
    // the latter approach works proves that this is a lexical editor issue.
    //
    ///////////////////////////////////////////////////////////////////////////

    // setTimeout(() => {
    if (isLinkEditMode && inputRef.current) {
      editor.setEditable(false)
      inputRef.current.focus()
    }
    // }, 0)

    // However, even when using editor.setEditable(), we still need setTimeout.
    setTimeout(() => {
      editor.setEditable(true)
    }, 0)
  }, [editor, isLinkEditMode, isLink])

  /* ======================
        useEffect() 5
  ====================== */

  useEffect(() => {
    const editorElement = editorRef.current // <div ref={editorRef} className='rte-link-editor'>
    if (editorElement === null) return

    const handleBlur = (event: FocusEvent) => {
      if (!editorElement.contains(event.relatedTarget as Element) && isLink) {
        setIsLink(false)
        setIsLinkEditMode(false)
      }
    }
    editorElement.addEventListener('focusout', handleBlur)
    return () => {
      editorElement.removeEventListener('focusout', handleBlur)
    }
  }, [editorRef, setIsLink, setIsLinkEditMode, isLink])

  /* ======================
  monitorInputInteraction()
  ====================== */

  const monitorInputInteraction = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleLinkSubmission(event)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setIsLinkEditMode(false)
    }
  }

  /* ======================
  handleLinkSubmission()
  ====================== */

  const handleLinkSubmission = (
    event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>
  ) => {
    event.preventDefault()
    if (lastSelection !== null) {
      if (linkUrl !== '') {
        editor.update(() => {
          editor.dispatchCommand(
            TOGGLE_LINK_COMMAND,
            sanitizeUrl(editedLinkUrl)
          )
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const parent = getSelectedNode(selection).getParent()
            if ($isAutoLinkNode(parent)) {
              const linkNode = $createLinkNode(parent.getURL(), {
                rel: parent.__rel,
                target: parent.__target,
                title: parent.__title
              })
              parent.replace(linkNode, true)
            }
          }
        })
      }
      setEditedLinkUrl('https://')

      setIsLinkEditMode(false)
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <div ref={editorRef} className='rte-link-editor'>
      {!isLink ? null : isLinkEditMode ? (
        <>
          <input
            autoComplete='off'
            //^ The className specified here is used above in logic that looks for
            //^ the specific input by className.
            className='rte-form-control rte-form-control-sm rte-link-input'
            onChange={(event) => {
              setEditedLinkUrl(event.target.value)
            }}
            onKeyDown={(event) => {
              monitorInputInteraction(event)
            }}
            ref={inputRef}
            spellCheck={false}
            value={editedLinkUrl}
          />

          <div>
            <div
              className='rte-link-cancel rte-icon-close'
              onClick={() => {
                setIsLinkEditMode(false)
              }}
              onMouseDown={preventDefault}
              role='button'
              tabIndex={0}
            />

            <div
              className='rte-link-confirm rte-icon-success-alt'
              onClick={handleLinkSubmission}
              onMouseDown={preventDefault}
              role='button'
              tabIndex={0}
            />
          </div>
        </>
      ) : (
        <div className='rte-link-view'>
          <a
            href={sanitizeUrl(linkUrl)}
            rel='noopener noreferrer'
            target='_blank'
          >
            {linkUrl}
          </a>
          <div
            className='rte-link-edit rte-icon-pencil-fill'
            onMouseDown={preventDefault}
            onClick={(event) => {
              event.preventDefault()
              setEditedLinkUrl(linkUrl)
              setIsLinkEditMode(true)
            }}
            role='button'
            tabIndex={0}
          />
          <div
            className='rte-link-trash rte-icon-clear'
            onClick={() => {
              ///////////////////////////////////////////////////////////////////////////
              //
              // Gotcha: this handler was getting called but sometimes didn't work.
              // In particular, it didn't work when in conjunction with the AutoLinkPlugin
              // feature such that after dropping a URL in the editor, the trash feature
              // wouldn't do anything.
              //
              // It turns out that the order of rendered components matters:
              //
              //   <AutoLinkPlugin /> // <-- Must come first in order
              //   <LinkPlugin />     // <-- Must come second in order.
              //
              ///////////////////////////////////////////////////////////////////////////
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
            }}
            onMouseDown={preventDefault}
            role='button'
            tabIndex={0}
          />
        </div>
      )}
    </div>
  )
}

/* ========================================================================

======================================================================== */

function useFloatingLinkEditorToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  isLinkEditMode: boolean,
  setIsLinkEditMode: Dispatch<boolean>
): JSX.Element | null {
  const [activeEditor, setActiveEditor] = useState(editor)
  const [isLink, setIsLink] = useState(false)

  useEffect(() => {
    function $updateToolbar() {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection)
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode)
        const focusAutoLinkNode = $findMatchingParent(
          focusNode,
          $isAutoLinkNode
        )
        if (!(focusLinkNode || focusAutoLinkNode)) {
          setIsLink(false)
          return
        }
        const badNode = selection
          .getNodes()
          .filter((node) => !$isLineBreakNode(node))
          .find((node) => {
            const linkNode = $findMatchingParent(node, $isLinkNode)
            const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode)
            return (
              (focusLinkNode && !focusLinkNode.is(linkNode)) ||
              (linkNode && !linkNode.is(focusLinkNode)) ||
              (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
              (autoLinkNode &&
                (!autoLinkNode.is(focusAutoLinkNode) ||
                  autoLinkNode.getIsUnlinked()))
            )
          })
        if (!badNode) {
          setIsLink(true)
        } else {
          setIsLink(false)
        }
      } else if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes()
        if (nodes.length === 0) {
          setIsLink(false)
          return
        }
        const node = nodes[0]
        const parent = node.getParent()
        if ($isLinkNode(parent) || $isLinkNode(node)) {
          setIsLink(true)
        } else {
          setIsLink(false)
        }
      }
    }
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          $updateToolbar()
          setActiveEditor(newEditor)
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection)
            const linkNode = $findMatchingParent(node, $isLinkNode)
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank')
              return true
            }
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor])

  /* ======================
          return
  ====================== */

  return createPortal(
    <FloatingLinkEditor
      editor={activeEditor}
      isLink={isLink}
      anchorElem={anchorElem}
      setIsLink={setIsLink}
      isLinkEditMode={isLinkEditMode}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    anchorElem
  )
}

/* ========================================================================

======================================================================== */

export default function FloatingLinkEditorPlugin({
  anchorElem = document.body,
  isLinkEditMode,
  setIsLinkEditMode
}: {
  anchorElem?: HTMLElement
  isLinkEditMode: boolean
  setIsLinkEditMode: Dispatch<boolean>
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  return useFloatingLinkEditorToolbar(
    editor,
    anchorElem,
    isLinkEditMode,
    setIsLinkEditMode
  )
}
