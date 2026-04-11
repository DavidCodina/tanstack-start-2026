/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './fontSize.css'

import * as React from 'react'
// import { IS_APPLE } from '@lexical/utils'
import {
  MAX_ALLOWED_FONT_SIZE,
  MIN_ALLOWED_FONT_SIZE
} from '../../../context/ToolbarContext'
import { isKeyboardInput } from '../../../utils/focusUtils'

import { SHORTCUTS } from '../../ShortcutsPlugin/shortcuts'

import {
  UpdateFontSizeType,
  updateFontSize,
  updateFontSizeInSelection
} from '../utils'

import type { LexicalEditor } from 'lexical'

function parseFontSize(input: string): [number, string] | null {
  const match = input.match(/^(\d+(?:\.\d+)?)(px|pt)$/)
  return match ? [Number(match[1]), match[2]] : null
}

function normalizeToPx(fontSize: number, unit: string): number {
  return unit === 'pt' ? Math.round((fontSize * 4) / 3) : fontSize
}

function isValidFontSize(fontSizePx: number): boolean {
  return (
    fontSizePx >= MIN_ALLOWED_FONT_SIZE && fontSizePx <= MAX_ALLOWED_FONT_SIZE
  )
}

export function parseFontSizeForToolbar(input: string): string {
  const parsed = parseFontSize(input)
  if (!parsed) {
    return ''
  }

  const [fontSize, unit] = parsed
  const fontSizePx = normalizeToPx(fontSize, unit)
  return `${fontSizePx}px`
}

export function parseAllowedFontSize(input: string): string {
  const parsed = parseFontSize(input)
  if (!parsed) {
    return ''
  }

  const [fontSize, unit] = parsed
  const fontSizePx = normalizeToPx(fontSize, unit)
  return isValidFontSize(fontSizePx) ? input : ''
}

/* ========================================================================
          
======================================================================== */

export default function FontSize({
  selectionFontSize,
  disabled,
  editor
}: {
  selectionFontSize: string
  disabled: boolean
  editor: LexicalEditor
}) {
  const [inputValue, setInputValue] = React.useState<string>(selectionFontSize)
  const [inputChangeFlag, setInputChangeFlag] = React.useState<boolean>(false)
  const [isMouseMode, setIsMouseMode] = React.useState(false)

  /* ======================

  ====================== */

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValueNumber = Number(inputValue)

    if (e.key === 'Tab') {
      return
    }
    if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
      e.preventDefault()
      setInputValue('')
      return
    }
    setInputChangeFlag(true)
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault()

      updateFontSizeByInputValue(inputValueNumber, !isMouseMode)
    }
  }

  /* ======================

  ====================== */

  const handleInputBlur = () => {
    setIsMouseMode(false)

    if (inputValue !== '' && inputChangeFlag) {
      const inputValueNumber = Number(inputValue)
      updateFontSizeByInputValue(inputValueNumber)
    }
  }

  /* ======================

  ====================== */

  const handleClick = (_e: React.MouseEvent) => {
    setIsMouseMode(true)
  }

  /* ======================

  ====================== */

  const updateFontSizeByInputValue = (
    inputValueNumber: number,
    skipRefocus: boolean = false
  ) => {
    let updatedFontSize = inputValueNumber
    if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
      updatedFontSize = MAX_ALLOWED_FONT_SIZE
    } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
      updatedFontSize = MIN_ALLOWED_FONT_SIZE
    }

    setInputValue(String(updatedFontSize))
    updateFontSizeInSelection(
      editor,
      String(updatedFontSize) + 'px',
      null,
      skipRefocus
    )
    setInputChangeFlag(false)
  }

  /* ======================

  ====================== */

  React.useEffect(() => {
    setInputValue(selectionFontSize)
  }, [selectionFontSize])

  /* ======================

  ====================== */

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <button
        aria-label='Decrease font size'
        className='rte-toolbar-item rte-font-decrement'
        disabled={
          disabled ||
          (selectionFontSize !== '' &&
            Number(inputValue) <= MIN_ALLOWED_FONT_SIZE)
        }
        onClick={(e) => {
          updateFontSize(
            editor,
            UpdateFontSizeType.decrement,
            inputValue,
            isKeyboardInput(e)
          )
        }}
        title={`Decrease font size (${SHORTCUTS.DECREASE_FONT_SIZE})`}
        type='button'
      >
        <i className='format rte-icon-minus' />
      </button>

      <input
        className='rte-font-size-input'
        disabled={disabled}
        min={MIN_ALLOWED_FONT_SIZE}
        max={MAX_ALLOWED_FONT_SIZE}
        onBlur={handleInputBlur}
        onChange={(e) => setInputValue(e.target.value)}
        onClick={handleClick}
        onKeyDown={handleKeyPress}
        title='Font size'
        type='number'
        value={inputValue}
      />

      <button
        aria-label='Increase font size'
        className='rte-toolbar-item rte-font-increment'
        disabled={
          disabled ||
          (selectionFontSize !== '' &&
            Number(inputValue) >= MAX_ALLOWED_FONT_SIZE)
        }
        onClick={(e) => {
          updateFontSize(
            editor,
            UpdateFontSizeType.increment,
            inputValue,
            isKeyboardInput(e)
          )
        }}
        title={`Increase font size (${SHORTCUTS.INCREASE_FONT_SIZE})`}
        type='button'
      >
        <i className='format rte-icon-add' />
      </button>
    </div>
  )
}
