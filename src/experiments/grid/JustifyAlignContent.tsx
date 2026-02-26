/* ========================================================================
                               JustifyAlignContent
======================================================================== */

///////////////////////////////////////////////////////////////////////////
//
// Justify Content: https://tailwindcss.com/docs/justify-content
// Utilities for controlling how flex and grid items are positioned along a container's main axis.
// The CSS justify-content property defines how the browser distributes space between and around content
// items along the main-axis of a flex container, and the inline axis of a grid container.
//
// justify-normal:  Behaves as stretch, except in the case of multi-column containers with a non-auto column-width,
//                  in which case the columns take their specified column-width rather than stretching to fill the
//                  container. As stretch behaves as start in flex containers, normal also behaves as start.

// justify-start:   TL;DR : Puts content on the left
//                  The items are packed flush to each other toward the edge of the alignment container
//                  depending on the container's main-start side. Generally, this means it's put on the
//                  left, but the main-start side changes when direction: 'rtl'.
//
// justify-end:     TL;DR : Puts content on the right.
//                  The items are packed flush to each other toward the edge of the alignment container
//                  depending on the container's main-end side.
//
// justify-center:  Horizontally centers all content.
//                  The items are packed flush to each other toward the center of the alignment
//                  container along the main axis.
//
// justify-between: Puts content on far left, far right and evenly distributes rest horizontally
//                  The items are evenly distributed within the alignment container along the main axis.
//                  The spacing between each pair of adjacent items is the same. The first item is flush with
//                  the main-start edge, and the last item is flush with the main-end edge.
//
// justify-around:  Puts equal horizontal space between each item and half space between grid container
//                  The items are evenly distributed within the alignment container along the main axis.
//                  The spacing between each pair of adjacent items is the same.
//                  The empty space before the first and after the last item equals half of the
//                  space between each pair of adjacent items.
//
// justify-evenly:  Puts equal horizontal space between each column and grid container
//                  The items are evenly distributed within the alignment container along the main axis.
//                  The spacing between each pair of adjacent items, the main-start edge and the first item,
//                  and the main-end edge and the last item, are all exactly the same.
//
// justify-stretch: If the combined size of the items along the main axis is less than the size of the
//                  alignment container, any auto-sized items have their size increased equally
//                  (not proportionally), while still respecting the constraints imposed by max-height/max-width
//                  (or equivalent functionality), so that the combined size exactly fills the alignment container
//                  along the main axis.
//
// In order to see how 'justify-*' works
// you can't have grid rows that take up the entire space. Thus instead of
// 'grid-cols-3', we'd need to do something like: grid-cols-[repeat(3,minmax(0px,100px))]
//

/////////////////////////
//
// Align Content: https://tailwindcss.com/docs/align-content
// Utilities for controlling how rows are positioned in multi-row flex and grid containers.
// The CSS align-content property sets the distribution of space between and around content items
// along  a grid's block axis.
//
// content-normal: The items are packed in their default position as if no align-content value was set.
//
// content-center: Puts content in vertical center.
//                 The items are packed flush to each other in the center of the alignment container along the cross axis.
//
// content-start:  Puts content at top
//                 The items are packed flush to each other against the edge of the alignment container
//                 depending on the container's cross-start side.
//
// content-end:    Puts content at bottom
//                 The items are packed flush to each other against the edge of the alignment container depending on the container's cross-end side.

//
// content-betwee:  Places items vertically at maximal distance from each other with no space from grid.
//                  The items are evenly distributed within the alignment container along the cross axis.
//                  The spacing between each pair of adjacent items is the same. The first item is flush
//                  with the start edge of the alignment container in the cross axis, and the last item
//                  is flush with the end edge of the alignment container in the cross axis.
//
// content-around: Puts items verically space from other items with half spaces on top and bottom between grid.
//                 The items are evenly distributed within the alignment container along the cross axis. The
//                 spacing between each pair of adjacent items is the same. The empty space before the first
//                 and after the last item equals half of the space between each pair of adjacent items.
//
// content-evenly: Distributes content vertically with equal space between content and grid
//                 The items are evenly distributed within the alignment container along the cross axis.
//                 The spacing between each pair of adjacent items, the start edge and the first item, and
//                 the end edge and the last item, are all exactly the same.
//
// content-baseline:
//
// content-stretch:
//
/////////////////////////
//
// Place Content: https://tailwindcss.com/docs/place-content
// Utilities for controlling how content is justified and aligned at the same time.
// For example, justify-content + content-center is the same as place-content-center.
//
// place-content-center	 :
// place-content-start   :
// place-content-end     :
// place-content-between :
// place-content-around  :
// place-content-evenly  :
// place-content-baseline:
// place-content-stretch :
//
///////////////////////////////////////////////////////////////////////////

export const JustifyAlignContent = () => {
  /* ======================
          return
  ====================== */

  return (
    <section
      className={`mx-auto grid aspect-video w-[90%] auto-rows-[minmax(100px,auto)] grid-cols-[repeat(3,minmax(0px,100px))] content-center justify-center gap-4 outline-dashed`}
      // style={{ direction: 'rtl' }}
    >
      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        1
      </div>

      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        2
      </div>

      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
        3
      </div>

      <div className='flex items-center justify-center rounded border border-[#409] bg-white font-black text-[#409] shadow'>
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
