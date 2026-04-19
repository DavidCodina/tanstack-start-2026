import { useState } from 'react'

const listItemClass =
  'cursor-pointer p-2 outline-sky-700 hover:bg-white hover:text-sky-500 hover:outline hover:[text-shadow:0px_0.5px_0.5px_rgba(0,0,0,0.75)]'

/* ========================================================================
                          
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ✅ Kevin Powell : https://www.youtube.com/watch?v=JN-nme9oF10
// The cornerstone of this demo is the CSS: interpolate-size: allow-keywords;
//
//   https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size
//   The interpolate-size CSS property allows you to enable animations and transitions
//   between a <length-percentage> value and an intrinsic size value such as auto, fit-content,
//   or max-content.
//
// That said, this is an experimental technology and has limited (48%) browser support.
//
//
//   https://caniuse.com/?search=interpolate-size
//
///////////////////////////////////////////////////////////////////////////

export const TransitionToAuto = () => {
  const [show, setShow] = useState(false)

  /* ======================
          return
  ====================== */

  return (
    <header className='relative mx-auto max-w-[600px] rounded-lg border border-sky-500 bg-white p-2 shadow [interpolate-size:allow-keywords]'>
      <button
        className='btn-sky btn-sm'
        onClick={() => {
          setShow((v) => !v)
        }}
        type='button'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          viewBox='0 0 16 16'
        >
          <path
            fillRule='evenodd'
            d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5'
          />
        </svg>
      </button>

      <nav
        // -left-2 used instead of left-0 in order to offset the px-2 used on the <div> container below.
        // Or overflow-clip
        // ${show ? 'visible' : 'invisible'} is not needed, but used to prevent inadvertantly tabbing to items.
        // However, this necessitates that visibility is also part of the transition.
        className={`absolute top-[calc(100%+16px)] -left-2 overflow-hidden transition-all duration-300 ease-linear ${show ? 'h-auto' : 'h-0'} ${show ? 'visible' : 'invisible'}`}
      >
        {/* <div> container used create padding for the <ul> boxShadow. */}
        <div className='px-2 pb-2'>
          <ul className='min-w-[150px] overflow-hidden rounded-lg border border-sky-700 bg-sky-400 text-center font-bold text-white shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'>
            <li className={listItemClass}>Home</li>
            <li className={listItemClass}>About</li>
            <li className={listItemClass}>Blog</li>
            <li className={listItemClass}>Contact</li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
