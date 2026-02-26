/* ========================================================================
              
======================================================================== */
// This demo shows how to create a responsive grid with Tailwind modifiers.
// Also, instead of using something like auto-rows-[minmax(100px,auto)]
// to set height, I used the CSS aspect-ratio hack to create 1:1 boxes.

export const Responsive = () => {
  //
  /* ======================
          return
  ====================== */

  return (
    <section
      className={`mx-auto grid max-w-[50%] gap-4 outline-purple-800 outline-dashed sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6`}
    >
      {[...Array(6)].map((_, index) => (
        <div key={index} style={{ position: 'relative', paddingTop: '100%' }}>
          <div className='absolute inset-0 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
            {index + 1}
          </div>
        </div>
      ))}
    </section>
  )
}

//
