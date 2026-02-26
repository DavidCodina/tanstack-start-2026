import * as React from 'react'
import { Collapsible } from '../.'

/* ========================================================================

======================================================================== */

export const CollapsibleDemo1 = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Collapsible
        // useCollapsibleContent={false}
        collapsibleRootProps={{
          className: `mx-auto w-56`,
          open: open,
          onOpenChange: (open) => {
            setOpen(open)
          }
        }}
        collapsibleTriggerProps={{
          children: 'Games'
        }}
        collapsiblePanelProps={{
          // Use `absolute` to prevent the panel from pushing other content down.
          className: `absolute z-49`
          // children: (
          //   <>
          //     <div>1. Valheim</div>
          //     <div>2. Enshrouded</div>
          //     <div>3. Crimson Desert</div>
          //     <div>4. Arc Raiders</div>
          //     <div>5. Wreckfest</div>
          //   </>
          // )
        }}
        collapsibleContentProps={{
          className: `cursor-pointer`,
          // children: (
          //   <>
          //     <div>1. Valheim</div>
          //     <div>2. Enshrouded</div>
          //     <div>3. Crimson Desert</div>
          //     <div>4. Arc Raiders</div>
          //     <div>5. Wreckfest</div>
          //   </>
          // ),
          onClick: () => {
            setOpen(false)
          }
        }}
      >
        <div>1. Valheim</div>
        <div>2. Enshrouded</div>
        <div>3. Crimson Desert</div>
        <div>4. Arc Raiders</div>
        <div>5. Wreckfest</div>
      </Collapsible>

      <div className='bg-card mx-auto mt-4 max-w-[400px] rounded-lg border p-4'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
        distinctio. Nisi accusantium eius non, hic reprehenderit magni dolore
        natus! Soluta doloribus non ad quam laudantium accusantium excepturi
        totam cupiditate tenetur porro modi sint ullam molestias illum vitae
        ducimus, sit temporibus fuga architecto deserunt earum officiis nobis
        saepe. Rerum, voluptate nostrum!
      </div>
    </>
  )
}
