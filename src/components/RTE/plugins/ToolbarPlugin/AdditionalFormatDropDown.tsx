/* 
Changes made relative to lexical-playground version:

1. Abstracted into separate component. This logic was originally directly within the ToolbarPlugin.
2. Added own copies of dispatchToolbarCommand() and dispatchFormatTextCommand()

*/

import {
  $addUpdateTag,
  FORMAT_TEXT_COMMAND,
  SKIP_DOM_SELECTION_TAG
} from 'lexical'
import DropDown, { DropDownItem } from '../../ui/Dropdown'
import { isKeyboardInput } from '../../utils/focusUtils'
import { useToolbarState } from '../../context/ToolbarContext'
import { SHORTCUTS } from '../ShortcutsPlugin/shortcuts'
import { clearFormatting } from './utils'

import type { JSX } from 'react'

import type {
  CommandPayloadType,
  LexicalCommand,
  LexicalEditor,
  TextFormatType
} from 'lexical'

type AdditionalFormatDropDownProps = {
  activeEditor: LexicalEditor
  isEditable: boolean
}

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active rte-dropdown-item-active'
  } else {
    return ''
  }
}

/* ========================================================================
                            AdditionalFormatDropDown       
======================================================================== */

export const AdditionalFormatDropDown = ({
  activeEditor,
  isEditable
}: AdditionalFormatDropDownProps): JSX.Element => {
  const { toolbarState /*, updateToolbarState */ } = useToolbarState()

  /* ======================
  dispatchToolbarCommand()
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

  const dispatchFormatTextCommand = (
    payload: TextFormatType,
    skipRefocus: boolean = false
  ) => dispatchToolbarCommand(FORMAT_TEXT_COMMAND, payload, skipRefocus)

  /* ======================
          return
  ====================== */

  return (
    <DropDown
      disabled={!isEditable}
      buttonClassName='rte-toolbar-item'
      buttonLabel=''
      buttonAriaLabel='Additional formatting options'
      buttonIconClassName='rte-icon-dropdown-more'
      title='Additional formatting options'
    >
      {/* ================= */}

      <DropDownItem
        aria-label='Format text to lowercase'
        className={'rte-item ' + dropDownActiveClass(toolbarState.isLowercase)}
        onClick={(e) =>
          dispatchFormatTextCommand('lowercase', isKeyboardInput(e))
        }
        title='Lowercase'
      >
        <i className='rte-icon-lowercase' />
        <span className='rte-text'>Lowercase</span>
        <span className='rte-shortcut'>{SHORTCUTS.LOWERCASE}</span>
      </DropDownItem>

      {/* ================= */}

      <DropDownItem
        aria-label='Format text to uppercase'
        className={'rte-item ' + dropDownActiveClass(toolbarState.isUppercase)}
        onClick={(e) =>
          dispatchFormatTextCommand('uppercase', isKeyboardInput(e))
        }
        title='Uppercase'
      >
        <i className='rte-icon-uppercase' />
        <span className='rte-text'>Uppercase</span>
        <span className='rte-shortcut'>{SHORTCUTS.UPPERCASE}</span>
      </DropDownItem>

      {/* ================= */}

      <DropDownItem
        aria-label='Format text to capitalize'
        className={'rte-item ' + dropDownActiveClass(toolbarState.isCapitalize)}
        onClick={(e) =>
          dispatchFormatTextCommand('capitalize', isKeyboardInput(e))
        }
        title='Capitalize'
      >
        <i className='rte-icon-capitalize' />
        <span className='rte-text'>Capitalize</span>
        <span className='rte-shortcut'>{SHORTCUTS.CAPITALIZE}</span>
      </DropDownItem>

      {/* ================= */}

      <DropDownItem
        aria-label='Format text with a strikethrough'
        className={
          'rte-item ' + dropDownActiveClass(toolbarState.isStrikethrough)
        }
        onClick={(e) =>
          dispatchFormatTextCommand('strikethrough', isKeyboardInput(e))
        }
        title='Strikethrough'
      >
        <i className='rte-icon-strikethrough' />
        <span className='rte-text'>Strikethrough</span>
        <span className='rte-shortcut'>{SHORTCUTS.STRIKETHROUGH}</span>
      </DropDownItem>

      {/* ================= */}

      <DropDownItem
        aria-label='Format text with a subscript'
        className={'rte-item ' + dropDownActiveClass(toolbarState.isSubscript)}
        onClick={(e) =>
          dispatchFormatTextCommand('subscript', isKeyboardInput(e))
        }
        title='Subscript'
      >
        <i className='rte-icon-subscript' />
        <span className='rte-text'>Subscript</span>
        <span className='rte-shortcut'>{SHORTCUTS.SUBSCRIPT}</span>
      </DropDownItem>

      {/* ================= */}

      <DropDownItem
        aria-label='Format text with a superscript'
        className={
          'rte-item ' + dropDownActiveClass(toolbarState.isSuperscript)
        }
        onClick={(e) =>
          dispatchFormatTextCommand('superscript', isKeyboardInput(e))
        }
        title='Superscript'
      >
        <i className='rte-icon-superscript' />
        <span className='rte-text'>Superscript</span>
        <span className='rte-shortcut'>{SHORTCUTS.SUPERSCRIPT}</span>
      </DropDownItem>

      {/* ================= */}

      {/* This will wrap text in a <mark> tag.
      By default the user agent stylesheet will add these styles in Chrome:

        background-color: mark;
        color: marktext;

      However, for greater control, one can add a CSS class designation to 
      theme.text.highlight. This will add the class to a <span> within the <mark>.
      */}

      <DropDownItem
        aria-label='Format text with a highlight'
        className={'rte-item ' + dropDownActiveClass(toolbarState.isHighlight)}
        onClick={(e) =>
          dispatchFormatTextCommand('highlight', isKeyboardInput(e))
        }
        title='Highlight'
      >
        <i className='rte-icon-highlight' />
        <span className='rte-text'>Highlight</span>
      </DropDownItem>

      {/* ================= */}

      <DropDownItem
        aria-label='Clear all text formatting'
        className='rte-item'
        onClick={(e) => clearFormatting(activeEditor, isKeyboardInput(e))}
        title='Clear text formatting'
      >
        <i className='rte-icon-clear' />
        <span className='rte-text'>Clear Formatting</span>
        <span className='rte-shortcut'>{SHORTCUTS.CLEAR_FORMATTING}</span>
      </DropDownItem>
    </DropDown>
  )
}
