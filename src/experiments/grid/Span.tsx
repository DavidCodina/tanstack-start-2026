/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
//-  *-span-* :
//
// This  example uses the 'span' classes to create a two-dimensional layout
// - i.e., a 'griddy' layout.
//
// Tailwind Grid Column Start/End : https://tailwindcss.com/docs/grid-column
// Tailwind Grid Row Start/End    : https://tailwindcss.com/docs/grid-row
//
//
///////////////////////////////////////////////////////////////////////////

export const Span = () => {
  /* ======================
          return
  ====================== */

  return (
    <section
      className={`mx-auto grid max-w-4xl auto-rows-[minmax(100px,auto)] grid-cols-3 gap-4 outline-purple-800 outline-dashed`}
    >
      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        1
      </div>

      <div className='col-span-2 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        2
      </div>

      <div className='col-span-2 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        3
      </div>

      <div className='row-span-2 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
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
