import { useState } from 'react'
import { Reorder } from 'framer-motion'

/* ========================================================================
                              DraggableList
======================================================================== */
// https://www.youtube.com/watch?v=XlXT9lhy-4M

export const DraggableList = () => {
  const [items, setItems] = useState([1, 2, 3, 4, 5])

  /* ======================
          return
  ====================== */

  return (
    <>
      <Reorder.Group
        as='ul' // Default
        className='mx-auto mb-6 flex max-w-[600px] flex-col rounded pl-0'
        onReorder={(newOrder) => {
          setItems(newOrder)
        }}
        values={items}
      >
        {items.map((item) => (
          <Reorder.Item
            as='li' // Default
            className={`relative block cursor-pointer border border-neutral-400 bg-white px-2 py-2 text-sm font-semibold shadow-[rgba(0,0,0,0.24)_0px_3px_8px] first:rounded-t-[inherit] last:rounded-b-[inherit] [&:not(:first-child)]:border-t-0`}
            key={item}
            value={item}
          >
            {item}. Bla, bla, bla...
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div
        className={`mx-auto max-w-[600px] rounded-lg border border-neutral-400 bg-white p-4 text-center shadow-[rgba(0,0,0,0.24)_0px_3px_8px]`}
      >
        {JSON.stringify(items, null, 2)}
      </div>
    </>
  )
}
