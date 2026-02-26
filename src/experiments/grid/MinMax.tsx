/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// minmax() :
//
// In this example we have a grid that is set to a width of w-[50%].
// Then we use 'aspect-square' to set the height of the grid dynamically.
//
// Then we set grid-cols-[repeat(2,minmax(0,25%))]
// This allows the items to be a max of 25%, but also respects gap.
// If we merely did grid-cols-[repeat(2,25%)], it wouldn't actually respect the gap.
// This is not immediately obvious, but would be if you did: grid-cols-[repeat(4,25%)].
//
// The actual height of the items is set using the old school apect ratio CSS hack.
//
// The important part of this demonstration is that the grid items are centered
// horizontally and vetically using:
//
//   content-center
//   justify-center
//
// This kind of implementation is probably not something I'd actually ever do,
// but it's an interesting exercise nonetheless.
//
///////////////////////////////////////////////////////////////////////////

export const MinMax = () => {
  /* ======================
          return
  ====================== */

  return (
    <section
      className={`mx-auto grid aspect-square w-[50%] grid-cols-[repeat(2,minmax(0,25%))] content-center justify-center gap-4 outline-dashed`}
    >
      <div className='relative pt-[100%]'>
        <div className='absolute inset-0 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
          1
        </div>
      </div>

      <div className='relative pt-[100%]'>
        <div className='absolute inset-0 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
          2
        </div>
      </div>

      <div className='relative pt-[100%]'>
        <div className='absolute inset-0 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
          3
        </div>
      </div>

      <div className='relative pt-[100%]'>
        <div className='absolute inset-0 flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
          4
        </div>
      </div>
    </section>
  )
}
