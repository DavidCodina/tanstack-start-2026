//import React from 'react'
import { Button } from './Button'
/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// CVA                               : https://cva.style/docs
// ✅ Coding In Public               : https://www.youtube.com/watch?v=kHQNK2jU_TQ
// ✅ React Tips with Brooks Lybrand : https://www.youtube.com/watch?v=qGQRdCg6JRQ
// ✅ Frontend FYI                   : https://www.youtube.com/watch?v=B6FrDu2Qbt0
//
// CVA solves having reusable components that you can style and make sure they stay
// consistent across your app.
//
// CVA (Class Variance Authority) is great for managing class names conditionally in Tailwind CSS.
//
///////////////////////////////////////////////////////////////////////////

export const CVA_Demo = () => {
  /* ======================
          return
  ====================== */

  return (
    <>
      <section className='flex items-center justify-center gap-2'>
        <Button
          className='shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]'
          color='success'
          //size='small'
        >
          Click Me
        </Button>
      </section>
    </>
  )
}
