import * as React from 'react'

import { Minus, Plus } from 'lucide-react'
import { useTiptapContext } from '../TipTapContext'
import { stringToNumberOrNull } from './utils'
import { cn } from '@/utils'

type FontSizeProps = {
  disabled?: boolean
}

const MIN_ALLOWED_FONT_SIZE = 8
const MAX_ALLOWED_FONT_SIZE = 72
const DEFAULT_FONT_SIZE = 16

const SOLID_BUTTON_BORDER_MIXIN = `border border-[rgba(0,0,0,0.3)] dark:border-[rgba(255,255,255,0.35)]`

const HOVER_MIXIN = `
hover:bg-blue-500
hover:text-white
hover:border-blue-700
dark:hover:border-blue-300
`

const FOCUS_MIXIN = `
focus-within:ring-[3px]
focus-within:ring-black/10
dark:focus-within:ring-white/20
`

const baseClasses = `
group flex items-center
px-1 py-1
bg-accent font-medium leading-none
rounded-lg outline-none
shadow-xs
${SOLID_BUTTON_BORDER_MIXIN}
${HOVER_MIXIN}
${FOCUS_MIXIN}
`

const buttonClasses = `
cursor-pointer rounded outline-none
focus-visible:ring-border focus-visible:ring-1
group-hover:focus-visible:ring-white
`

const inputClasses = `
appearance-none-fix 
appearance-none
m-0 p-0 w-[30px] text-center border-none outline-none rounded  
focus-visible:ring-border focus-visible:ring-1
group-hover:focus-visible:ring-white
`

/* ========================================================================
          
======================================================================== */
// Note: editorState?.fontSize will be a string value like '20px'.
// The DEFAULT_FONT_SIZE for the input is 16. That said, certain blocks, like
// h1 through h6 will have a larger font size, but because this is set by CSS,
// it's not known to the editor. That's expected (and fine).

export const FontSize = ({ disabled }: FontSizeProps) => {
  /* ======================
        state & refs
  ====================== */

  const { editor, editorState } = useTiptapContext()
  // Generally, fontSize will be string or undefined.
  const fontSize = editorState?.fontSize
  const fontSizeAsNumber: number | null = stringToNumberOrNull(fontSize) // stringToNumber() still allows +/-
  const valueAsNumber =
    typeof fontSizeAsNumber === 'number' ? fontSizeAsNumber : DEFAULT_FONT_SIZE

  const [internalValue, setInternalValue] = React.useState(
    DEFAULT_FONT_SIZE.toString()
  )

  const timeoutRef = React.useRef<NodeJS.Timeout>(undefined)
  const fontSizeWhenInputFocusedRef = React.useRef(fontSize)

  /* ======================
      handleDecrement()
  ====================== */

  const handleDecrement = (options?: { keyDown?: boolean }) => {
    if (!editor) return
    if (valueAsNumber <= MIN_ALLOWED_FONT_SIZE) return

    // Note: In Lexical if a keyboard user interacts with the increment/decrement buttons,
    // focus never goes back to the selection.
    if (options?.keyDown === true) {
      editor
        .chain()
        // ❌ .focus()
        .setFontSize(`${valueAsNumber - 1}px`)
        .run()
      return
    }

    // Note: Because focus() goes back to the selection here, one can't
    // merely switch to pressing Enter or Space. Instead, the keyDown
    // behavior must be approached by first tabbing to the button.
    editor
      .chain()
      .focus()
      .setFontSize(`${valueAsNumber - 1}px`)
      .run()
  }

  /* ======================
      handleIncrement()
  ====================== */

  const handleIncrement = (options?: { keyDown?: boolean }) => {
    if (!editor) return
    if (valueAsNumber >= MAX_ALLOWED_FONT_SIZE) return

    if (options?.keyDown === true) {
      editor
        .chain()
        // ❌ .focus()
        .setFontSize(`${valueAsNumber + 1}px`)
        .run()
      return
    }

    // Note: Because focus() goes back to the selection here, one can't
    // merely switch to pressing Enter or Space. Instead, the keyDown
    // behavior must be approached by first tabbing to the button.
    editor
      .chain()
      .focus()
      .setFontSize(`${valueAsNumber + 1}px`)
      .run()
  }

  /* ======================
         useEffect()
  ====================== */

  React.useEffect(() => {
    setInternalValue(valueAsNumber.toString())
  }, [valueAsNumber])

  /* ======================
   renderDecrementButton()
  ====================== */

  const renderDecrementButton = () => {
    return (
      <button
        aria-label='decrease font size'
        className={cn(
          buttonClasses,
          valueAsNumber <= MIN_ALLOWED_FONT_SIZE && 'cursor-not-allowed'
        )}
        disabled={disabled}
        onClick={() => {
          handleDecrement()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            clearTimeout(timeoutRef.current)
            e.preventDefault()
            handleDecrement({ keyDown: true })
          }
        }}
        ///////////////////////////////////////////////////////////////////////////
        //
        // When onKeyDown calls handleDecrement({ keyDown: true }), it opts out of
        // focusing back on the selection. If you'd prefer to allow the user to press
        // Enter or Space repeatedly, but eventually focus back on the selection, then
        // uncomment the onKeyUp here and in the other button as well.
        //
        ///////////////////////////////////////////////////////////////////////////

        // onKeyUp={(e) => {
        //   if (e.key === 'Enter' || e.key === ' ') {
        //     timeoutRef.current = setTimeout(() => {
        //       if (!editor) return
        //       editor.chain().focus().run()
        //     }, 500)
        //   }
        // }}
        title={`decrease font size`}
        type='button'
      >
        <Minus />
      </button>
    )
  }

  /* ======================
        renderInput()
  ====================== */

  const renderInput = () => {
    return (
      <input
        className={inputClasses}
        disabled={disabled}
        // min & max are important for constraining the spinner if there was
        // one, but also for constraining the ArrowUp/ArrowDown behavior.
        min={MIN_ALLOWED_FONT_SIZE}
        max={MAX_ALLOWED_FONT_SIZE}
        onFocus={() => {
          fontSizeWhenInputFocusedRef.current = fontSize
        }}
        onBlur={() => {
          const internalValueAsNumber = stringToNumberOrNull(internalValue)

          if (
            editor &&
            typeof internalValueAsNumber === 'number' &&
            internalValueAsNumber < MIN_ALLOWED_FONT_SIZE
          ) {
            // Calling setFontSize() will also trigger the useEffect() that updates internalValue.
            editor.chain().setFontSize(`${MIN_ALLOWED_FONT_SIZE}px`).run()
          } else if (
            editor &&
            typeof internalValueAsNumber === 'number' &&
            internalValueAsNumber > MAX_ALLOWED_FONT_SIZE
          ) {
            // Calling setFontSize() will also trigger the useEffect() that updates internalValue.
            editor.chain().setFontSize(`${MAX_ALLOWED_FONT_SIZE}px`).run()
          } else {
            // When the input blurs, update internalValue to the
            // current editorState.fontSize -> valueAsNumber
            setInternalValue(valueAsNumber.toString())
          }

          ///////////////////////////////////////////////////////////////////////////
          //
          // Focus jumping back to the editor selection can be unexpected for keyboard users.
          // This is mitigated by only focusing back on the selection if fontSize has
          // changed. Otherwise, allow the user to tab through the buttons.
          // This behavior is similar to what is done in the Lexical playgroud.
          // https://playground.lexical.dev/
          //
          ///////////////////////////////////////////////////////////////////////////
          if (editor && fontSizeWhenInputFocusedRef.current !== fontSize) {
            editor.chain().focus().run()
          }
        }}
        // ArrowUp/ArrowDown trigger the onChange, but the +/- button's don't
        onChange={(e) => {
          if (!editor) return
          clearTimeout(timeoutRef.current)

          const newValue = e.target.value.trim()

          setInternalValue(newValue)

          // Sanitize, coerce and validate newValue. If newValue passes
          // checks, then call .setFontSize(`${newValueAsNumber}px`)
          if (
            !newValue ||
            newValue === '' ||
            newValue.includes('.') ||
            newValue.includes('-') ||
            !/^\d+$/.test(newValue)
          ) {
            return
          }

          const newValueAsNumber = stringToNumberOrNull(newValue)

          if (
            typeof newValueAsNumber !== 'number' ||
            isNaN(newValueAsNumber) ||
            newValueAsNumber > MAX_ALLOWED_FONT_SIZE ||
            newValueAsNumber < MIN_ALLOWED_FONT_SIZE ||
            fontSize === `${newValueAsNumber}px`
          ) {
            return
          }

          editor.chain().setFontSize(`${newValueAsNumber}px`).run()
        }}
        onKeyDown={(e) => {
          // These characters can still sneak in on paste, which
          // is why we have the additiona checks in the onChange handler
          // prior to calling setFontSize().
          if (['e', 'E', '+', '-', '.', ' '].includes(e.key)) {
            e.preventDefault()
          }
        }}
        title='font size'
        type='number'
        value={internalValue}
      />
    )
  }

  /* ======================
   renderIncrementButton()
  ====================== */

  const renderIncrementButton = () => {
    return (
      <button
        aria-label='increase font size'
        className={cn(
          buttonClasses,
          valueAsNumber >= MAX_ALLOWED_FONT_SIZE && 'cursor-not-allowed'
        )}
        disabled={disabled}
        onClick={() => {
          handleIncrement()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            clearTimeout(timeoutRef.current)
            e.preventDefault()
            handleIncrement({ keyDown: true })
          }
        }}
        // onKeyUp={(e) => {
        //   if (e.key === 'Enter' || e.key === ' ') {
        //     timeoutRef.current = setTimeout(() => {
        //       if (!editor) return
        //       editor.chain().focus().run()
        //     }, 500)
        //   }
        // }}
        title={`increase font size`}
        type='button'
      >
        <Plus />
      </button>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <div
      className={baseClasses}
      data-slot='tiptap-font-size' // Used for styling in Tiptap.css
    >
      {renderDecrementButton()}
      {renderInput()}
      {renderIncrementButton()}
    </div>
  )
}
