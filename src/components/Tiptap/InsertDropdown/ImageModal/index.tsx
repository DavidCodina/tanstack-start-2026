import * as React from 'react'
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'

import { useFocusTrap } from '../../useFocusTrap'
import { useClickOutside } from './useClickOutside'
import { isOneOf, stringToNumberOrUndefined } from './utils'
import { cn } from '@/utils'

type ImageModalProps = {
  disabled?: boolean
  onCancel: () => void

  onSubmit: (values: { url: string; width?: number; margin?: string }) => void
  url?: string
  width?: string
}

const inputClasses = `
block w-full rounded border px-2 py-1 text-sm outline-none
focus:ring-[3px] focus:ring-primary/50
`

const options: { value: string; label: string; Icon: React.ElementType }[] = [
  { value: '0px auto 0px 0px', label: 'Left', Icon: AlignLeft },
  { value: '0px auto', label: 'Center', Icon: AlignCenter },
  { value: '0px 0px 0px auto', label: 'Right', Icon: AlignRight }
]

const MIN = 150
const MAX = 1000

/* ========================================================================

======================================================================== */

export const ImageModal = ({
  disabled,
  onCancel,
  onSubmit,
  url: externalUrl = '',
  width: externalWidth = ''
}: ImageModalProps) => {
  /* =====================
        state & refs
  ====================== */

  const [url, setUrl] = React.useState(externalUrl)
  const [width, setWidth] = React.useState(externalWidth)

  const [alignment, setAlignment] = React.useState<
    '0px auto 0px 0px' | '0px auto' | '0px 0px 0px auto' // left, center, right
  >()

  const clickOutsideRef = useClickOutside(() => {
    onCancel()
  })

  const focusTrapRef = useFocusTrap()

  /* =====================
      renderUrlInput()
  ====================== */

  const renderUrlInput = () => {
    return (
      <div className='mb-4'>
        <label
          htmlFor='image-url-input'
          className='mb-0 text-sm font-semibold text-blue-500'
        >
          Image URL <sup className='text-rose-500'>*</sup>
        </label>
        <input
          disabled={disabled}
          autoCapitalize='none'
          autoComplete='new-password'
          autoCorrect='off'
          spellCheck={false}
          id='image-url-input'
          className={inputClasses}
          onChange={(e) => setUrl(e.target.value)}
          placeholder='https://...'
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
          htmlFor='image-width-input'
        >
          Width
        </label>
        <input
          disabled={disabled}
          autoCapitalize='none'
          autoComplete='new-password'
          autoCorrect='off'
          spellCheck={false}
          id='image-width-input'
          className={inputClasses}
          min={MIN}
          max={MAX}
          placeholder='500'
          step={50}
          onChange={(e) => setWidth(e.target.value)}
          onKeyDown={(e) => {
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
    renderAlignmentRadios()
  ====================== */

  const renderAlignmentRadios = () => {
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

          const acceptableValues = [
            '0px auto 0px 0px',
            '0px auto',
            '0px 0px 0px auto'
          ] as const
          if (isOneOf(acceptableValues, value)) {
            setAlignment(value)
          }
        }}
      >
        <legend className='mb-1 text-sm font-semibold text-blue-500'>
          Alignment
        </legend>
        <div className='flex flex-1 gap-2'>
          {options.map(({ value, label, Icon }) => {
            const checked = alignment === value

            const labelBaseClasses = `
            relative flex flex-1 items-center justify-center gap-2 
            rounded border px-2 py-1 text-sm font-medium 
            select-none cursor-pointer
            focus-within:ring-[3px]
            `

            return (
              <label
                key={value}
                htmlFor={`radio-align-${value}`}
                className={cn(
                  labelBaseClasses,
                  checked
                    ? `border-blue-700 bg-blue-500 text-white focus-within:ring-blue-500/50`
                    : `bg-card text-foreground hover:bg-accent focus-within:ring-primary/50`
                )}
              >
                <input
                  disabled={disabled}
                  id={`radio-align-${value}`}
                  name='alignment-radios'
                  type='radio'
                  value={value}
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
          className='min-w-[80px] flex-1 cursor-pointer rounded border border-rose-700 bg-rose-500 px-2 py-1 text-sm font-medium text-white outline-none focus-visible:ring-[3px] focus-visible:ring-rose-500/50'
          onClick={() => {
            onCancel?.()
          }}
          type='button'
        >
          Cancel
        </button>

        <button
          className='min-w-[80px] flex-1 cursor-pointer rounded border border-green-700 bg-green-500 px-2 py-1 text-sm font-medium text-white outline-none focus-visible:ring-[3px] focus-visible:ring-green-500/50'
          disabled={disabled}
          onClick={() => {
            let widthAsNumberOrUndefined = stringToNumberOrUndefined(width, {
              noDecimal: true,
              noNegative: true
            })

            if (typeof widthAsNumberOrUndefined === 'number') {
              if (widthAsNumberOrUndefined < MIN) {
                widthAsNumberOrUndefined = MIN
              } else if (widthAsNumberOrUndefined > MAX) {
                widthAsNumberOrUndefined = MAX
              }
            }

            onSubmit?.({
              url: url,
              width: widthAsNumberOrUndefined,
              margin: alignment
            })
          }}
          type='button'
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
    <div
      className='fixed inset-0 z-9999 bg-black/35'
      data-slot='tiptap-image-modal'
    >
      <div
        ref={(node) => {
          clickOutsideRef.current = node
          focusTrapRef(node)
        }}
        className='bg-card absolute top-1/2 left-1/2 min-h-[100px] w-[600px] max-w-[calc(100%-48px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border p-4'
      >
        {renderUrlInput()}

        <div className='mb-6 flex gap-2'>
          {renderWidthInput()}
          {renderAlignmentRadios()}
        </div>

        {renderActions()}
      </div>
    </div>
  )
}
