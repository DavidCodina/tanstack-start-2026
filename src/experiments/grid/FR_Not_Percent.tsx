/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Use fr units not %:
//
// Suppose we wanted to create a grid with two columns.
//
// You could use percentages - grid-cols-[50%_50%], but this is actually
//  not great because it ignores the gap. Instead, use fr units:
//
//   grid-cols-[1fr_1fr]
//
// or
//
//  grid-cols-[repeat(2,1fr)]
//
// And just like that, we have a grid with two columns.
// That said, using minmax() would respect the gap:
//
//   ❌ grid-cols-[repeat(2,50%)]
//   ✅ grid-cols-[repeat(2,minmax(0px,50%))]
//
// The difference is that when we use minmax() we're not saying,
// "set the width to 50%". Rather, we're saying, "set the width to
// as much as 50%, but respect the gaps."
//
// Note: Tailwind provides grid-cols-1, grid-cols-2, etc. for just
// this use case.
//
/////////////////////////
//
// Grid Inspector:
//
// If you wantt to see the grid, open you dev tools by inspecting the element.
// Then within Chrome you'll see a little grid button next to the Element. If you click
// it a grid outline will show up in the browser.
//
///////////////////////////////////////////////////////////////////////////

export const FR_Not_Percent = () => {
  //
  /* ======================
          return
  ====================== */

  return (
    <section
      className={`mx-auto grid max-w-4xl auto-rows-[minmax(100px,auto)] grid-cols-[repeat(2,minmax(0px,1fr))] gap-4 outline-purple-800 outline-dashed`}
    >
      {[...Array(6)].map((_, index) => (
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

//
