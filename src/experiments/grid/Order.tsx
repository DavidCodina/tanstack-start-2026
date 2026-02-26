/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Order:
//
// Using order to create items in the order of: 2 1 4 3
//
///////////////////////////////////////////////////////////////////////////

export const Order = () => {
  /* ======================
          return
  ====================== */

  return (
    <section
      className={`mx-auto grid w-[50%] auto-rows-[minmax(100px,auto)] grid-cols-4 gap-4 outline-dashed`}
    >
      <div className='order-2 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        1
      </div>

      <div className='order-1 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        2
      </div>

      <div className='order-4 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        3
      </div>

      <div className='order-3 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        4
      </div>
    </section>
  )
}
