/* ========================================================================
              
======================================================================== */

///////////////////////////////////////////////////////////////////////////
//
// Place Items: https://tailwindcss.com/docs/place-items
// Utilities for controlling how items are justified and aligned at the same time.
// The CSS place-items shorthand property allows you to align items along both the block AND inline
// directions at once (i.e. the align-items and justify-items properties) in a relevant layout system such as Grid or Flexbox.
// If the second value is not set, the first value is also used for it.
//
// place-items-start:    Positions each item's content in the top-left of its grid item container.
// place-items-end:      Positions each item's content in the bottom-right of its grid item container.
// place-items-center:   Positions each item's content in the center of its grid item container.
// place-items-baseline:
// place-items-stretch:
//
/////////////////////////
//
// Place Self: https://tailwindcss.com/docs/place-self
// Utilities for controlling how an individual item is justified and aligned at the same time.
// The place-self CSS shorthand property allows you to align an individual item in both the block
// and inline directions at once (i.e. the align-self and justify-self properties) in a relevant
// layout system such as Grid or Flexbox. If the second value is not present, the first value is
// also used for it.
//
// place-self-auto:
// place-self-start:
// place-self-end:
// place-self-center:
// place-self-stretch:
//
/////////////////////////

export const PlaceItemsSelf = () => {
  /* ======================
          return
  ====================== */

  return (
    <section
      className={`mx-auto grid aspect-3/1 w-[50%] auto-rows-[minmax(100px,auto)] grid-cols-3 place-items-center gap-4 outline-dashed`}
    >
      <div className='flex items-center justify-center place-self-start rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        1
      </div>

      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        2
      </div>

      <div className='flex items-center justify-center place-self-end rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        3
      </div>
    </section>
  )
}
