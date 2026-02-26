import { useState } from 'react'

/* ========================================================================
                          
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ✅ Kevin Powell: https://www.youtube.com/watch?v=vmDEHAzj2XE
// ✅ Kevin Powell: https://www.youtube.com/watch?v=4prVdA7_6u0
// ✅ Frontend FYI: https://www.youtube.com/watch?v=jCqtngrL2pA
//
// Animating display:     https://developer.mozilla.org/en-US/docs/Web/CSS/display#animating_display
// Animatable Properties: https://www.w3schools.com/cssref/css_animatable.php
//
// transition-behavior: https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior
// @starting-style:   https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style#examples //❗️ Limited availability (86%).
//
// In order to use @starting-style directly with Tailwind v3, we need to create a variant plugin:
//
//   import plugin from 'tailwindcss/plugin'
//
//   export const startingStylePlugin = plugin(function (pluginApi) {
//     const { addVariant } = pluginApi
//     addVariant('starting', '@starting-style')
//   })
//
// However, in Tailwind v4 this is now baked in:
// https://tailwindcss.com/docs/v4-beta#starting-style-variant
//
///////////////////////////////////////////////////////////////////////////

export const TransitionFromNone = () => {
  const [show, setShow] = useState<boolean>()

  // Notice that in the 4th line we use translate-y-[calc(50vh+100%)] (i.e., no prependend negative).
  // This allows us to actually create a different exit animation.
  const modalClassName = `
    absolute left-1/2 top-1/2 w-[600px] max-w-[calc(100vw-48px)] -translate-x-1/2 rounded-lg border border-black bg-white p-4
    starting:-translate-y-[calc(50vh+100%)] starting:-translate-x-1/2 starting:shadow-none
    [transition-behavior:allow-discrete] transition-[display,transform,box-shadow] duration-300 ease-linear 
    ${show ? 'block -translate-y-1/2 shadow-[rgba(0,_0,_0,_0.2)_0px_60px_40px_-7px]' : 'hidden translate-y-[calc(50vh+100%)] shadow-none'}
  `

  /* ======================

  ====================== */

  const renderModal = () => {
    return (
      <div className={modalClassName}>
        <h3 className='text-center text-2xl font-black text-blue-500 md:text-3xl'>
          DaveTek Industries
        </h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <button
          className='btn-blue btn-sm mx-auto block'
          onClick={() => {
            setShow((v) => !v)
          }}
        >
          Close Modal
        </button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <button
        className='btn-blue btn-sm mx-auto block'
        onClick={() => {
          setShow((v) => !v)
        }}
      >
        {show ? 'Close Modal' : 'Open Modal'}
      </button>

      {renderModal()}
    </>
  )
}
