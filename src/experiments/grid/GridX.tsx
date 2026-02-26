/* ========================================================================
              
======================================================================== */

export const GridX = () => {
  /* ======================
          return
  ====================== */

  return (
    <section className='mx-auto grid w-[50%] auto-rows-[minmax(100px,auto)] grid-cols-1 gap-4 outline-dashed lg:grid-cols-3'>
      {/* {[...Array(3)].map(() => (
        <div className='border bg-white shadow'>
          <div className='px-4 py-5'>...</div>
        </div>
      ))} */}

      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        1
      </div>

      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        2
      </div>

      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        3
      </div>
    </section>
  )
}
