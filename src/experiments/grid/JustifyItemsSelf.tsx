/* ========================================================================
              
======================================================================== */

///////////////////////////////////////////////////////////////////////////
//
// Justify Items: https://tailwindcss.com/docs/justify-items
// Utilities for controlling how grid items are aligned along their inline axis.
// The CSS justify-items property defines the default justify-self for all items of the box,
// giving them all a default way of justifying each box along the appropriate axis.
// The basic idea here is that these classes position the content WITHIN the grid item.
//
// justify-items-start:
// justify-items-end:
// justify-items-center:
// justify-items-stretch:
//

/////////////////////////
//
// Justify Self: https://tailwindcss.com/docs/justify-self
// Utilities for controlling how an individual grid item is aligned along its inline axis.
// The CSS justify-self property sets the way a box is justified inside its alignment container
// along the appropriate axis.
//
// justify-self-auto:
// justify-self-start:
// justify-self-end:
// justify-self-center:
// justify-self-stretch:
//
/////////////////////////

export const JustifyItemsSelf = () => {
  /* ======================
          return
  ====================== */

  return (
    <section
      className={`mx-auto grid aspect-3/1 w-[50%] auto-rows-[minmax(100px,auto)] grid-cols-3 justify-items-start gap-4 outline-dashed`}
    >
      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        1
      </div>

      <div className='flex items-center justify-center justify-self-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        2
      </div>

      <div className='flex items-center justify-center justify-self-end rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        3
      </div>
    </section>
  )
}
