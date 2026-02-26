import { useState } from 'react'
import './index.css'

/* ========================================================================
                          
======================================================================== */
// ✅ Kevin Powell : https://www.youtube.com/watch?v=2rlWBZ17Wes
// At 24:15 he discusses cqi (and cqw and cqb) units. Thus 10cqi is 10%
// of the conatainer size. However, he suggests using cqi in
// conjuction with clamp: font-size: clamp(1rem, 10cqi, 3rem);
//
// ✅ Kevin Powell (older) : https://www.youtube.com/watch?v=3_-Je5XpbqY
//
// Kevin Powell            : https://www.youtube.com/watch?v=DHj7JhH8ins
// Kevin Powell            : https://www.youtube.com/watch?v=Zddz_R1RnfM
// Josh Comeau             : https://www.joshwcomeau.com/css/container-queries-introduction/
export const ContainerQueriesDemo = () => {
  const [maxWidth, setMaxWidth] = useState(600)

  /* ======================
        renderExample1()
  ====================== */

  const renderExample1 = () => {
    return (
      <div className='mx-auto mb-6 flex max-w-[600px] flex-col items-center gap-4 rounded-lg border border-neutral-500 bg-white p-4 text-white'>
        <div className='cq w-[100px]'>
          <div />
        </div>

        <div className='cq w-[200px]'>
          <div />
        </div>

        <div className='cq w-[300px]'>
          <div />
        </div>

        <div className='cq w-[400px]'>
          <div />
        </div>
      </div>
    )
  }

  /* ======================
      renderExample2()
  ====================== */

  const renderExample2 = () => {
    return (
      <section
        className='section-container mx-auto'
        style={{ maxWidth: maxWidth }}
      >
        <button
          className='btn-green btn-sm mx-auto mb-4 block'
          onClick={() => {
            setMaxWidth(() => {
              if (maxWidth === 600) {
                return 800
              } else {
                return 600
              }
            })
          }}
        >
          Max Width: {maxWidth}px
        </button>
        <div>
          <div className='rounded-lg border border-black bg-white p-4'>
            This example demonstrates a card layout where the cards will
            automatically stack when the parent container is less than 800px
            wide. This can occur by reducing the viewport Width, which will
            eventually squish the container. Howevever, to really demonstrate
            that it's a container query, I've also added a button that allows
            the user to manually change the max width of the container.
          </div>

          <div className='rounded-lg border border-black bg-white p-4'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
      </section>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {renderExample1()}
      {renderExample2()}
    </>
  )
}
