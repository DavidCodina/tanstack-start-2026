/* ========================================================================
              
======================================================================== */

///////////////////////////////////////////////////////////////////////////
//
//
// Align Items: https://tailwindcss.com/docs/align-items
// Utilities for controlling how flex and grid items are positioned along a container's cross axis.
// The CSS align-items property sets the align-self value on all direct children as a group.
// In Grid Layout, it controls the alignment of items on the Block Axis within their grid area.
//
//
// items-start    : will place all items at the top and prevent them from stretching
// items-end      : will place all items at the botom and  prevent them from stretching.
// items-center   :  erticaly center the items and prevent them from stretching.
// items-baseline :
// items-stretch  :
//
/////////////////////////
//
// Align Self: https://tailwindcss.com/docs/align-self
// Utilities for controlling how an individual flex or grid item is positioned along its container's cross axis.
// In Grid, it aligns the item inside the grid area. In Flexbox, it aligns the item on the cross axis.
//
// self-auto     :
// self-start    :
// self-en'      :
// self-center   :
// self-stretch  :
// self-baseline :

//
/////////////////////////
//
// Note: The alignment classes (i.e., CSS properties) all override auto-rows-[minmax(100px,auto)].
//
///////////////////////////////////////////////////////////////////////////

export const AlignItemsSelf = () => {
  /* ======================
          return
  ====================== */

  return (
    <section
      className={`mx-auto grid aspect-3/1 w-[50%] auto-rows-[minmax(100px,auto)] grid-cols-3 items-start gap-4 outline-dashed`}
    >
      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        1
      </div>

      <div className='flex items-center justify-center self-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        2
      </div>

      <div className='flex items-center justify-center self-end rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        3
      </div>
    </section>
  )
}
