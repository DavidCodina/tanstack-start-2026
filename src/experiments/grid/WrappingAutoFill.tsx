/* ========================================================================
              
======================================================================== */
// Brad Traversy demonstratest wrapping at 21:45 of : https://www.youtube.com/watch?v=0xMQfnTU6oo

export const WrappingAutoFill = () => {
  /* ======================
          return
  ====================== */

  return (
    <section
      className={`mx-auto grid max-w-4xl auto-rows-[minmax(100px,auto)] grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 outline-purple-800 outline-dashed`}
    >
      {[...Array(9)].map((_, index) => (
        <div
          key={index}
          className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'
        >
          {index + 1}
        </div>
      ))}
    </section>
  )
}
