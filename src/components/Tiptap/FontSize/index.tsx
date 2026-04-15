import * as React from 'react'

import { Minus, Plus } from 'lucide-react'
import { useTiptapContext } from '../TipTapContext'
import { stringToNumber } from './utils'
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
flex items-center
px-1 py-1
bg-accent font-medium leading-none
rounded-lg outline-none
shadow-xs
${SOLID_BUTTON_BORDER_MIXIN}
${HOVER_MIXIN}
${FOCUS_MIXIN}
`

/* ========================================================================
          
======================================================================== */
// Note: editorState?.fontSize will be a string value like '20px'.
// The DEFAULT_FONT_SIZE for the input is 16. That said, certain blocks, like
// h1 through h6 will have a larger font size, but because this is set by CSS,
// it's not known to the editor. That's expected (and fine).

//# Todo: implement the ability to change the input directly.

//# Todo: implement the ability to click and hold the increment/decrement, so they will continue.

//# When component has hover (blue), make the focus style of the button/input/button white.

//# When done, review it with Claude.

export const FontSize = ({ disabled }: FontSizeProps) => {
  const { editor, editorState } = useTiptapContext()
  // Generally, fontSize will be string or undefined.
  const fontSize = editorState?.fontSize
  const fontSizeAsNumber: number | null = stringToNumber(fontSize)
  const valueAsNumber =
    typeof fontSizeAsNumber === 'number' ? fontSizeAsNumber : DEFAULT_FONT_SIZE

  const [internalValue, setInternalValue] = React.useState(
    DEFAULT_FONT_SIZE.toString()
  )

  /* ======================
      handleDecrement()
  ====================== */
  //# We don't actually want .focus() after every single click or keypress.
  //# We need some way to only call focus() after a pause...

  const handleDecrement = () => {
    if (!editor) return
    if (valueAsNumber <= MIN_ALLOWED_FONT_SIZE) return

    editor
      .chain()
      //# .focus()
      .setFontSize(`${valueAsNumber - 1}px`)
      .run()
  }

  /* ======================
      handleIncrement()
  ====================== */
  //# We don't actually want .focus() after every single click or keypress.
  //# We need some way to only call focus() after a pause...

  const handleIncrement = () => {
    if (!editor) return
    if (valueAsNumber >= MAX_ALLOWED_FONT_SIZE) return

    editor
      .chain()
      //# .focus()
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
          return
  ====================== */

  return (
    <div
      className={baseClasses}
      data-slot='tiptap-font-size' // Used for styling in Tiptap.css
    >
      <button
        aria-label='decrease font size'
        className={cn(
          'focus-visible:ring-border cursor-pointer rounded outline-none focus-visible:ring-1',
          valueAsNumber <= MIN_ALLOWED_FONT_SIZE && 'cursor-not-allowed'
        )}
        // If you specify valueAsNumber <= MIN_ALLOWED_FONT_SIZE as part of the disabled condition,
        // then once you click on it and its disabled the entire editor will lose the outer focus ring.
        // Consequently, the button is never disable, but instead the onClick returns early.
        disabled={disabled}
        onClick={handleDecrement}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleDecrement()
          }
        }}
        title={`decrease font size`}
        type='button'
      >
        <Minus />
      </button>

      <input
        className='appearance-none-fix focus-visible:ring-border m-0 w-[30px] appearance-none rounded border-none p-0 text-center outline-none focus-visible:ring-1'
        disabled={disabled}
        // min & max are important for constraining the spinner if there was one,
        // but also for constraining the ArrowUp/ArrowDown behavior.
        min={MIN_ALLOWED_FONT_SIZE}
        max={MAX_ALLOWED_FONT_SIZE}
        onBlur={() => {
          // When the input blurs, update internalValue to the current editorState.fontSize -> valueAsNumber
          setInternalValue(valueAsNumber.toString())
        }}
        // ArrowUp/ArrowDown also trigger the onChange
        onChange={(e) => {
          if (!editor) return

          const newValue = e.target.value

          setInternalValue(newValue)

          //# At this point we want to sanitize, coerce and validate newValue.
          //# if (currentValueAsNumber >= MAX_ALLOWED_FONT_SIZE) return
          //# if (currentValueAsNumber <= MIN_ALLOWED_FONT_SIZE) return

          //# If newValue meets the criteria, then call:

          // editor .chain()
          //   //# .focus()
          //   .setFontSize(`${newValue}px`).run()

          // Otherwise, whatever internalValue currently is, fix it onBlur.
        }}
        onKeyDown={(e) => {
          // Prevent Enter from submitting the form.
          if (e.key === 'Enter') {
            e.preventDefault()
          }
        }}
        title='font size'
        type='number'
        value={internalValue}
      />

      <button
        aria-label='increase font size'
        className={cn(
          'focus-visible:ring-border cursor-pointer rounded outline-none focus-visible:ring-1',
          valueAsNumber >= MAX_ALLOWED_FONT_SIZE && 'cursor-not-allowed'
        )}
        disabled={disabled}
        onClick={handleIncrement}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleIncrement()
          }
        }}
        title={`increase font size`}
        type='button'
      >
        <Plus />
      </button>
    </div>
  )
}
