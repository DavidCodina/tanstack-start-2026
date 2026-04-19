import { useState } from 'react'

/* ========================================================================

======================================================================== */
// https://github.com/jamiebuilds/tailwindcss-animate/tree/main/docs

export const TailwindAnimateDemo = () => {
  const [open, setOpen] = useState<boolean>()

  /* ======================
        renderOverlay()
  ====================== */

  const renderOverlay = () => {
    const overlayClasses =
      open === true
        ? ' animate-in fade-in duration-150'
        : open === false
          ? ' animate-out fade-out duration-150 fill-mode-forwards'
          : ''

    return (
      <div
        className={`fixed inset-0 bg-black/50${overlayClasses}`}
        style={{
          zIndex: 9998,
          visibility: 'hidden'
        }}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            setOpen(false)
          }
        }}
        onAnimationStart={(e) => {
          if (open === true) {
            e.currentTarget.style.visibility = ''
            e.currentTarget.style.zIndex = '9998'
          }
        }}
        onAnimationEnd={(e) => {
          if (open === false) {
            e.currentTarget.style.visibility = 'hidden'
            e.currentTarget.style.zIndex = '-1'
          }
        }}
      />
    )
  }

  /* ======================

  ====================== */

  const renderCloseButton = () => {
    return (
      <button
        className='absolute top-4 right-4'
        onClick={() => setOpen(false)}
        type='button'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinejoin='round'
          strokeLinecap='round'
          className='h-4 w-4'
        >
          <path d='M18 6 6 18'></path>
          <path d='m6 6 12 12'></path>
        </svg>

        <span className='sr-only'>Close</span>
      </button>
    )
  }
  /* ======================

  ====================== */

  const renderModal = () => {
    return (
      <>
        {renderOverlay()}
        <div
          className='relative mx-auto max-w-[600px]'
          style={{ zIndex: 9999 }}
        >
          <div
            className={`absolute rounded-lg border border-neutral-400 bg-white p-4 shadow ${
              open === true
                ? 'animate-in zoom-in duration-150'
                : open === false
                  ? 'animate-out zoom-out fill-mode-forwards duration-150'
                  : 'animate-out zoom-out fill-mode-forwards duration-0'
            } `}
          >
            <p>
              {/* Gotcha: inline elements won't always animage, but if you change them 
              to inline-flex it seems to work. */}
              <code className='inline-flex cursor-pointer duration-1000 hover:animate-bounce'>
                tailwindcss-animate
              </code>{' '}
              seems like a cute package, but it can be powerful when used in the{' '}
              <em>right</em> way.
            </p>

            <p className='m-0'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            {renderCloseButton()}
          </div>
        </div>
      </>
    )
  }

  /* ======================
          return
  ====================== */

  const _base = `block mx-auto mb-8 h-16 w-16 rounded-lg border border-blue-900 bg-blue-500 shadow`

  return (
    <>
      <button
        className='btn-sky btn-sm mx-auto mb-4 block'
        onClick={() => setOpen((v) => !v)}
        type='button'
      >
        {open ? 'Hide Content' : 'Show Content'}
      </button>

      {renderModal()}

      <section className='mx-auto mb-6 max-w-[600px] rounded-lg border border-neutral-400 bg-white p-4'>
        <p>
          <code>tailwindcss-animate</code> provides the following animations:
        </p>

        <ul className='mb-6 list-inside list-disc text-sm'>
          <li>fade-in</li>

          <li>fade-out</li>

          <li>slide-in-from-top</li>

          <li>slide-in-from-bottom</li>

          <li>slide-in-from-left</li>

          <li>slide-in-from-right</li>

          <li>zoom-in</li>

          <li>zoom-out</li>

          <li>rotate-in</li>

          <li>rotate-out</li>

          <li>flip-in-x</li>

          <li>flip-out-x</li>

          <li>flip-in-y</li>

          <li>flip-out-y</li>

          <li>bounce-in</li>

          <li>bounce-out</li>

          <li>pulse</li>

          <li>spin</li>
        </ul>

        <p>
          See the{' '}
          <a
            className='text-blue-500 hover:underline'
            href='https://github.com/jamiebuilds/tailwindcss-animate/tree/main/docs'
            rel='noopener noreferrer'
            target='_blank'
          >
            docs
          </a>{' '}
          for more info.
        </p>

        <div
          // Gotcha: the docs indicate that you can change an animation duration
          // by doing this: duration-[2s]. However, in Tailwind that usually targets
          // the transition duration, not the animation duration. Using an arbitrary
          // property was the only thing that worked for me
          //

          className={`hover:animate-out hover:spin-out-[-90deg] hover:fill-mode-forwards mx-auto mb-8 flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border border-blue-900 bg-blue-500 text-sm font-bold text-white shadow [animation-duration:500ms] hover:[animation-duration:500ms]`}
          onPointerOut={(e) => {
            if (e.currentTarget.classList.contains('hover:animate-out')) {
              // Remove
              e.currentTarget.classList.remove('hover:animate-out')
              e.currentTarget.classList.remove('hover:spin-out-[-90deg]')
              e.currentTarget.classList.remove('hover:fill-mode-forwards')

              // Add
              e.currentTarget.classList.add('animate-in')
              e.currentTarget.classList.add('spin-in-[-90deg]')
            }
          }}
          onPointerEnter={(e) => {
            if (e.currentTarget.classList.contains('animate-in')) {
              // Remove
              e.currentTarget.classList.remove('animate-in')
              e.currentTarget.classList.remove('spin-in-[-90deg]')

              // Add
              e.currentTarget.classList.add('hover:animate-out')
              e.currentTarget.classList.add('hover:spin-out-[-90deg]')
              e.currentTarget.classList.add('hover:fill-mode-forwards')
            }
          }}
        >
          Hello
        </div>
      </section>

      {/* Fade In */}
      {/* <div className={`${base} animate-in fade-in delay-500 duration-1000`} /> */}

      {/* Zoom In */}
      {/* <button
        className={`${base} animate-in zoom-in delay-1000 duration-150`}
        onClick={(e) => {
          e.currentTarget.classList.remove('animate-in')
          e.currentTarget.classList.remove('zoom-in')
          e.currentTarget.classList.remove('delay-1000')
          e.currentTarget.classList.add('animate-out')
          e.currentTarget.classList.add('zoom-out')
          e.currentTarget.classList.add('fill-mode-forwards')
        }}
        style={{ transform: 'scale(0)' }}
        onAnimationStart={(e) => (e.currentTarget.style.transform = '')}
        onAnimationEnd={(_e) => {}}
      /> */}

      {/* Spin In */}
      {/* <div className={`${base} animate-in spin-in duration-1000`} /> */}

      {/* Slide In From Top*/}
      {/* <div className={`${base} animate-in slide-in-from-top duration-1000`} /> */}

      {/* Slide In From Left */}
      {/* <div className={`${base} animate-in slide-in-from-left duration-1000`} /> */}

      {/* Fade Out */}
      {/* <div className={`${base} animate-out fade-out fill-mode-forwards duration-1000`} /> */}
    </>
  )
}
