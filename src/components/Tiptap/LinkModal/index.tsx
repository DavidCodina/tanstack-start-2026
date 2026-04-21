import * as React from 'react'
import { useFocusTrap } from '../useFocusTrap'
import { useClickOutside } from './useClickOutside'

type LinkModalProps = {
  disabled?: boolean
  onCancel: () => void
  onSubmit: (url: string) => void
  url?: string
}

const inputClasses = `
block w-full rounded border px-2 py-1 text-sm outline-none
focus:ring-[3px] focus:ring-primary/50
`

/* ========================================================================

======================================================================== */
// Used by TextFormatDropdown and FormatBubbleMenu.

export const LinkModal = ({
  disabled,
  onCancel,
  onSubmit,
  url: externalUrl = ''
}: LinkModalProps) => {
  /* =====================
        state & refs
  ====================== */

  const [url, setUrl] = React.useState(externalUrl)
  const focusTrapRef = useFocusTrap()
  const clickOutsideRef = useClickOutside(() => {
    onCancel()
  })

  /* =====================
      renderUrlInput()
  ====================== */

  const renderUrlInput = () => {
    return (
      <div className='mb-4'>
        <label
          className='mb-0 text-sm font-semibold text-blue-500'
          htmlFor='link-url-input'
        >
          Link URL <sup className='text-rose-500'>*</sup>
        </label>
        <input
          autoCapitalize='none'
          autoComplete='new-password'
          autoCorrect='off'
          className={inputClasses}
          disabled={disabled}
          id='link-url-input'
          onChange={(e) => setUrl(e.target.value)}
          placeholder='https://www.google.com'
          spellCheck={false}
          type='text' // Or url
          value={url}
        />
      </div>
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
            onSubmit?.(url)
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
      data-slot='tiptap-link-modal'
    >
      <div
        ref={(node) => {
          clickOutsideRef.current = node
          focusTrapRef(node)
        }}
        className='bg-card absolute top-1/2 left-1/2 min-h-[100px] w-[600px] max-w-[calc(100%-48px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border p-4'
      >
        {renderUrlInput()}
        {renderActions()}
      </div>
    </div>
  )
}
