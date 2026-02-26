/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Grid Column Start/End: https://tailwindcss.com/docs/grid-column
// Grid Row Start/End: https://tailwindcss.com/docs/grid-row
//
// This example uses the col-start-*, col-end-*, row-start-*, and row-end-*
// classes to explicitly position each item such that the content is centered
// within a larger grid. By 'larger', I don't mean in terms of pixels,
// but rather more grid items.
//
///////////////////////////////////////////////////////////////////////////

export const ColRowStartEnd = () => {
  /* ======================
          return
  ====================== */

  return (
    <section
      className={`mx-auto grid aspect-square w-[90%] grid-cols-4 grid-rows-4 gap-4 outline-dashed`}
    >
      <div className='col-start-2 col-end-3 row-start-2 row-end-3 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        1
      </div>

      <div className='col-start-3 col-end-4 row-start-2 row-end-4 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        2
      </div>

      <div className='col-start-2 col-end-3 row-start-3 row-end-4 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        3
      </div>
    </section>
  )
}
