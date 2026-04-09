// https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx

import { blockTypeToBlockName } from '../../context/ToolbarContext'

import DropDown, { DropDownItem } from '../../ui/Dropdown'

import {
  // clearFormatting,
  formatBulletList,
  formatCheckList,
  formatCode,
  formatHeading,
  formatNumberedList,
  formatParagraph,
  formatQuote
} from './utils'

import type { JSX } from 'react'
import type { LexicalEditor } from 'lexical'

// eslint-disable-next-line
const rootTypeToRootName = {
  root: 'Root',
  table: 'Table'
}

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active rte-dropdown-item-active'
  } else {
    return ''
  }
}

/* ========================================================================
                              BlockFormatDropDown       
======================================================================== */
// BlockFormatDropDown is built on top of DropDown and DropDownItem.

export const BlockFormatDropDown = ({
  editor,
  blockType,
  // rootType, // Not being used.
  disabled = false
}: {
  blockType: keyof typeof blockTypeToBlockName
  rootType: keyof typeof rootTypeToRootName
  editor: LexicalEditor
  disabled?: boolean
}): JSX.Element => {
  /* ======================
          return
  ====================== */

  return (
    <DropDown
      disabled={disabled}
      buttonClassName='rte-toolbar-item'
      // blockType: 'paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'bullet', 'check', 'number', 'quote', 'code', etc.
      buttonIconClassName={`rte-icon-${blockType}`}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel='Formatting options for text style'
      title='Formatting options for text style'
    >
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'paragraph')}
        onClick={() => formatParagraph(editor)}
      >
        <i className='rte-icon-paragraph' />

        <span className='rte-text'>Normal</span>
      </DropDownItem>
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'h1')}
        onClick={() => formatHeading(editor, blockType, 'h1')}
      >
        <i className='rte-icon-h1' />
        <span className='rte-text'>Heading 1</span>
      </DropDownItem>
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'h2')}
        onClick={() => formatHeading(editor, blockType, 'h2')}
      >
        <i className='rte-icon-h2' />
        <span className='rte-text'>Heading 2</span>
      </DropDownItem>

      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'h3')}
        onClick={() => formatHeading(editor, blockType, 'h3')}
      >
        <i className='rte-icon-h3' />
        <span className='rte-text'>Heading 3</span>
      </DropDownItem>

      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'h4')}
        onClick={() => formatHeading(editor, blockType, 'h4')}
      >
        <i className='rte-icon-h4' />
        <span className='rte-text'>Heading 4</span>
      </DropDownItem>

      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'h5')}
        onClick={() => formatHeading(editor, blockType, 'h5')}
      >
        <i className='rte-icon-h5' />
        <span className='rte-text'>Heading 5</span>
      </DropDownItem>

      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'h6')}
        onClick={() => formatHeading(editor, blockType, 'h6')}
      >
        <i className='rte-icon-h6' />
        <span className='rte-text'>Heading 6</span>
      </DropDownItem>

      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'bullet')}
        onClick={() => formatBulletList(editor, blockType)}
      >
        <i className='rte-icon-bullet' />
        <span className='rte-text'>Bullet List</span>
      </DropDownItem>
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'number')}
        onClick={() => formatNumberedList(editor, blockType)}
      >
        <i className='rte-icon-number' />
        <span className='rte-text'>Numbered List</span>
      </DropDownItem>
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'check')}
        onClick={() => formatCheckList(editor, blockType)}
      >
        <i className='rte-icon-check' />
        <span className='rte-text'>Check List</span>
      </DropDownItem>
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'quote')}
        onClick={() => formatQuote(editor, blockType)}
      >
        <i className='rte-icon-quote' />
        <span className='rte-text'>Quote</span>
      </DropDownItem>
      <DropDownItem
        className={'rte-item ' + dropDownActiveClass(blockType === 'code')}
        onClick={() => formatCode(editor, blockType)}
      >
        <i className='rte-icon-code' />
        <span className='rte-text'>Code Block</span>
      </DropDownItem>
    </DropDown>
  )
}
