// https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx

/* 
Changes made relative to lexical-playground version:

1. Removed style prop. The ToolbarPlugin in lexical-playground merely hardcoded the value:
    
     style={'font-family'}
*/

import * as React from 'react'
import { useCallback } from 'react'
import { $addUpdateTag, $getSelection, SKIP_SELECTION_FOCUS_TAG } from 'lexical'
import { $patchStyleText } from '@lexical/selection'

import DropDown, { DropDownItem } from '../../ui/Dropdown'
import type { LexicalEditor } from 'lexical'

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana']
]

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active rte-dropdown-item-active'
  } else {
    return ''
  }
}

/* ========================================================================
                              FontFamilyDropDown      
======================================================================== */

export const FontFamilyDropDown = ({
  disabled = false,
  editor,
  title,
  value
}: {
  disabled?: boolean
  editor: LexicalEditor
  title?: string
  value: string
}): React.JSX.Element => {
  /* ======================
        handleClick()
  ====================== */

  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        $addUpdateTag(SKIP_SELECTION_FOCUS_TAG)
        const selection = $getSelection()
        if (selection !== null) {
          ///////////////////////////////////////////////////////////////////////////
          //
          // If a selection exists, $patchStyleText is called to apply the selected font family to
          // the text within the selection.
          //
          // $patchStyleText: This function applies a style to the selected text. The style is specified as an
          //                  object  where the key is the CSS property and the value is the desired style.
          //
          // option:          This is the selected font family (e.g., ‘Arial’, ‘Courier New’, etc.).
          //
          ///////////////////////////////////////////////////////////////////////////
          $patchStyleText(selection, {
            // No need to pass a style prop and do this
            // ❌ [style]: option
            // Instead, just hardcode 'font-family'
            'font-family': option
          })
        }
      })
    },
    [editor]
  )

  /* ======================
          return
  ====================== */

  return (
    <DropDown
      disabled={disabled}
      buttonClassName={'rte-toolbar-item'}
      buttonLabel={value}
      buttonIconClassName={'rte-icon-font-family'}
      buttonAriaLabel={'Formatting options for font family'}
      title={title}
    >
      {FONT_FAMILY_OPTIONS.map(([option, text]) => (
        <DropDownItem
          className={`rte-item ${dropDownActiveClass(value === option)}`}
          onClick={() => handleClick(option)}
          key={option}
        >
          <span className='rte-text'>{text}</span>
        </DropDownItem>
      ))}
    </DropDown>
  )
}
