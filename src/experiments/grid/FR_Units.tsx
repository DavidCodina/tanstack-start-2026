/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The fr unit represents one fraction of the available space in the grid container
// to flexibly size grid rows and columns.
//
// Here's a simple two-column grid that sets the first column to take up 1/3 the space,
// and the second column to take up 2/3 the space. Note: Once you do this kind of thing
// it seems that it's no longer possible to override it at the item level.
//
///////////////////////////////////////////////////////////////////////////

export const FR_Units = () => {
  /* ======================
          return
  ====================== */

  return (
    <section
      className={`mx-auto grid w-[90%] auto-rows-[minmax(100px,auto)] grid-cols-[1fr_2fr] gap-4 outline-dashed`}
    >
      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        1
      </div>

      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        2
      </div>

      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        3
      </div>

      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        4
      </div>

      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        5
      </div>

      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        6
      </div>
    </section>
  )
}
