//# Not loving the text-blue-500

//# Is there aw way to check isYoutubeVideo, then open up editing options, similar to the Link?

import * as React from 'react'
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'
import { isOneOf, stringToNumberOrUndefined } from './utils'
import { cn } from '@/utils'

type ModalProps = {
  onCancel: () => void

  onSubmit: (values: {
    url: string
    width?: number
    textAlign?: 'left' | 'center' | 'right'
  }) => void
}

const inputClasses = `
block w-full rounded border px-2 py-1 text-sm outline-none
focus:ring-[3px] focus:ring-primary/50
`

type TextAlign = 'left' | 'center' | 'right'

const options: { value: TextAlign; label: string; Icon: React.ElementType }[] =
  [
    { value: 'left', label: 'Left', Icon: AlignLeft },
    { value: 'center', label: 'Center', Icon: AlignCenter },
    { value: 'right', label: 'Right', Icon: AlignRight }
  ]

/* ========================================================================

======================================================================== */
//# Also add other options to inputs to preven auto filling, etc.

export const Modal = ({ onCancel, onSubmit }: ModalProps) => {
  const [url, setUrl] = React.useState('')
  const [width, setWidth] = React.useState('')
  const [textAlign, setTextAlign] = React.useState<
    'left' | 'center' | 'right'
  >()

  const widthAsNumberOrUndefined = stringToNumberOrUndefined(width, {
    noDecimal: true,
    noNegative: true
  })

  const urlInputCallbackRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      node?.focus()
    },
    []
  )

  /* =====================
      renderUrlInput()
  ====================== */

  const renderUrlInput = () => {
    return (
      <div className='mb-4'>
        <label
          htmlFor='youtube-url-input'
          className='mb-0 text-sm font-semibold text-blue-500'
        >
          Youtube URL <sup className='text-rose-500'>*</sup>
        </label>
        <input
          id='youtube-url-input'
          className={inputClasses}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            //# There may be a more global solution...
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
          ref={urlInputCallbackRef}
          value={url}
        />
      </div>
    )
  }

  /* =====================
      renderWidthInput()
  ====================== */

  const renderWidthInput = () => {
    return (
      <div className='flex-1'>
        <label
          className='mb-0 text-sm font-semibold text-blue-500'
          htmlFor='youtube-width-input'
        >
          Width
        </label>
        <input
          //# Review <input type="number"> in FontSize and add to this one.

          id='youtube-width-input'
          className={inputClasses}
          min={0}
          max={1000}
          step={50}
          onChange={(e) => setWidth(e.target.value)}
          onKeyDown={(e) => {
            //# There may be a more global solution...
            if (e.key === 'Enter') {
              e.preventDefault()
            }

            // These characters can still sneak in on paste, which
            // is why we have the additiona checks in the onChange handler
            // prior to calling setFontSize().
            if (['e', 'E', '+', '-', '.', ' '].includes(e.key)) {
              e.preventDefault()
            }
          }}
          type='number'
          value={width}
        />
      </div>
    )
  }

  /* =====================
    renderTextAlignRadios()
  ====================== */
  //! Focus gets lost on the radios buttons!

  const renderTextAlignRadios = () => {
    return (
      <fieldset
        className='flex-1'
        onChange={(e) => {
          ///////////////////////////////////////////////////////////////////////////
          //
          // Why this works:
          //
          // Radios bubble their change events, so grouping them under a single handler is clean
          // and avoids duplication. Consequently, you only need one handler.
          //
          // Note: Previously I was doing this to get TypeScript to accept that target had a value:
          //
          //   ❌ const target = e.target  as unknown as EventTarget & HTMLInputElement
          //
          // However, type assertion is generally discouraged. Instead, use concrete checks.
          //
          ///////////////////////////////////////////////////////////////////////////
          const target = e.target

          // Ensure the bubbled event came from a radio input
          if (!(target instanceof HTMLInputElement)) return
          if (target.type !== 'radio') return

          const value = target.value

          const acceptableValues = ['left', 'center', 'right'] as const
          if (isOneOf(acceptableValues, value)) {
            setTextAlign(value)
          }
        }}
      >
        <legend className='mb-1 text-sm font-semibold text-blue-500'>
          Alignment
        </legend>
        <div className='flex flex-1 gap-2'>
          {/* <input
            id='youtube-radio-align-left'
            name='text-align-radios'
            onKeyDown={(e) => {
              //# There may be a more global solution...
              if (e.key === 'Enter') {
                e.preventDefault()
              }
            }}
            type='radio'
            value='left'
          />
          <label
            className='mb-0 text-sm font-medium text-blue-500'
            htmlFor='youtube-radio-align-left'
          >
            Left
          </label>
        </div>

        <div className='flex gap-2'>
          <input
            id='youtube-radio-align-center'
            name='text-align-radios'
            onKeyDown={(e) => {
              //# There may be a more global solution...
              if (e.key === 'Enter') {
                e.preventDefault()
              }
            }}
            type='radio'
            value='center'
          />

          <label
            className='mb-0 text-sm font-medium text-blue-500'
            htmlFor='youtube-radio-align-center'
          >
            Center
          </label>
        </div>

        <div className='flex gap-2'>
          <input
            id='youtube-radio-align-right'
            name='text-align-radios'
            onKeyDown={(e) => {
              //# There may be a more global solution...
              if (e.key === 'Enter') {
                e.preventDefault()
              }
            }}
            type='radio'
            value='right'
          />
          <label
            className='mb-0 text-sm font-medium text-blue-500'
            htmlFor='youtube-radio-align-right'
          >
            Right
          </label> */}

          {options.map(({ value, label, Icon }) => {
            const checked = textAlign === value
            return (
              <label
                key={value}
                htmlFor={`radio-align-${value}`}
                className={cn(
                  'relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded border px-2 py-1 text-sm font-medium select-none',
                  checked
                    ? 'border-blue-700 bg-blue-500 text-white'
                    : 'bg-card text-foreground hover:border-primary/50 hover:bg-accent border'
                )}
              >
                <input
                  id={`radio-align-${value}`}
                  name='text-align-radios'
                  type='radio'
                  value={value}
                  //! defaultChecked={value === 'left'}
                  className='sr-only'
                />
                <Icon className='h-4 w-4' aria-hidden='true' />
                {label}
              </label>
            )
          })}
        </div>
      </fieldset>
    )
  }

  /* =====================
      renderActions()
  ====================== */

  const renderActions = () => {
    return (
      <div className='flex gap-2'>
        <button
          className='min-w-[80px] flex-1 cursor-pointer rounded border border-rose-700 bg-rose-500 px-2 py-1 text-sm font-medium text-white'
          onClick={() => {
            onCancel?.()
          }}
        >
          Cancel
        </button>
        <button
          className='min-w-[80px] flex-1 cursor-pointer rounded border border-green-700 bg-green-500 px-2 py-1 text-sm font-medium text-white'
          onClick={() => {
            onSubmit?.({
              url: url,
              width: widthAsNumberOrUndefined,
              textAlign: textAlign
            })
          }}
        >
          Submit
        </button>
      </div>
    )
  }

  /* =====================
          return
  ====================== */

  return (
    <div className='fixed inset-0 z-9999 bg-black/50'>
      <div className='bg-card absolute top-1/2 left-1/2 min-h-[100px] w-[600px] max-w-[calc(100%-48px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border p-4'>
        {renderUrlInput()}

        <div className='mb-6 flex gap-2'>
          {renderWidthInput()}
          {renderTextAlignRadios()}
        </div>

        {renderActions()}
      </div>
    </div>
  )
}
