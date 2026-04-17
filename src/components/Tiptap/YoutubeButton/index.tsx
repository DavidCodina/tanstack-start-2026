import * as React from 'react'
import { useTiptapContext } from '../TipTapContext'
import { Modal } from './Modal'
import { cn } from '@/utils'

const SOLID_BUTTON_BORDER_MIXIN = `border border-[rgba(0,0,0,0.3)] dark:border-[rgba(255,255,255,0.35)]`

const HOVER_MIXIN = `
hover:bg-blue-500
hover:text-white
hover:border-blue-700
dark:hover:border-blue-300
`

const FOCUS_MIXIN = `
focus-visible:ring-[3px]
focus-visible:ring-black/10
dark:focus-visible:ring-white/20
`

const buttonClasses = `
flex items-center gap-2
px-1 py-1
bg-accent font-medium leading-none
rounded-lg outline-none cursor-pointer
shadow-xs
${SOLID_BUTTON_BORDER_MIXIN}
${HOVER_MIXIN}
${FOCUS_MIXIN}
`

/* ========================================================================

======================================================================== */
// This is a demo button for prototyping the actual youtube feature.
// The goal here is to create a modal that gets the URL, and optional width,
// and alignment value (radio buttons).

export const YoutubeButton = () => {
  const { editor } = useTiptapContext()
  const [showModal, setShowModal] = React.useState(false)

  /* =====================
          return
  ====================== */

  return (
    <>
      <button
        className={cn(buttonClasses)}
        onClick={() => {
          setShowModal(true)
        }}
        title='youtube'
        type='button'
      >
        <svg width='24' height='24' fill='currentColor' viewBox='0 0 16 16'>
          <path d='M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z' />
        </svg>
      </button>

      {showModal && (
        <Modal
          onSubmit={(values) => {
            if (!editor || !values.url || typeof values.url !== 'string') {
              setShowModal(false)
              return
            }

            // Simple preemptive URL validation.
            if (values.url.startsWith('https://www.youtube.com/watch?v=')) {
              editor.commands.setYoutubeVideo({
                src: values.url,
                // height is not set here. Why? Because Tiptap.css is already setting: height: auto; + aspect-ratio: 16 / 9;
                width: values.width || 500,
                // Even with undefined, it will try to set it to height: 480.
                height: undefined,
                textAlign: values.textAlign
              })
            } else {
              // Could to a toast here...
              alert(`Invalid URL. It must begin with:
https://www.youtube.com/watch?v=`)
            }

            setShowModal(false)
          }}
          onCancel={() => {
            setShowModal(false)
          }}
        />
      )}
    </>
  )
}
