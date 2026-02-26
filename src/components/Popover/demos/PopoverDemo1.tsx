import * as React from 'react'
import { CircleQuestionMark } from 'lucide-react'
import { Popover, PopoverTrigger, createPopoverHandle } from '../.'
import { Button } from '@/components'

/* ========================================================================

======================================================================== */

export const PopoverDemo1 = () => {
  const [handle] = React.useState(createPopoverHandle())

  return (
    <>
      <PopoverTrigger
        handle={handle}
        render={
          <Button className='mx-auto mb-6 flex' isIcon variant='info'>
            <CircleQuestionMark />
          </Button>
        }
      />

      <Popover
        // children={
        //   <div>
        //     <p className='my-6 leading-loose'>
        //       You can also pass content first = useContext(second) here in
        //       addition to doing it through Title/Description. This content will
        //       not overwrite the Title/Description.
        //     </p>

        //     <p className='leading-loose'>
        //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
        //       aliquid sapiente inventore rerum vel modi minus nesciunt eos
        //       consequuntur magni beatae quaerat in unde adipisci nam veritatis,
        //       placeat vitae est eveniet? Unde vitae voluptate quo excepturi,
        //       culpa veritatis! Dolorem quam excepturi ea magni sapiente porro
        //       corrupti soluta veritatis! Corporis aliquam non distinctio quidem
        //       reiciendis nobis, officia deleniti magnam quis facere quia dolorem
        //       voluptates dicta alias laborum vel. Reiciendis voluptas debitis
        //       aut nihil illo quasi, incidunt illum porro dolore suscipit nulla
        //       veritatis itaque reprehenderit aperiam culpa iste amet voluptatem
        //       magnam odit cum est corrupti, numquam dicta! Assumenda cum sunt
        //       velit mollitia.
        //     </p>
        //   </div>
        // }
        popoverRootProps={{
          handle: handle
        }}
        ///////////////////////////////////////////////////////////////////////////
        //
        // Pass in children or render prop and Popover will infer that the consumer
        // intends to use the internal PopoverTrigger. Alternatively, use an external
        // PopoverTrigger in conjunction with createPopoverHandle() and the handle
        // prop on the PopoverRoot and PopoverTrigger.
        //
        ///////////////////////////////////////////////////////////////////////////

        // popoverTriggerProps={{
        //   render: (<Button className='mx-auto mb-6 flex' isIcon variant='pink'><CircleQuestionMark /></Button>)
        // }}

        popoverPortalProps={{}}
        popoverPositionerProps={
          {
            // side: 'right'
          }
        }
        popoverPopupProps={{}}
        popoverTitleProps={{
          children: 'Information'
        }}
        popoverDescriptionProps={{
          children:
            'Bla, bla, bla... Lorem ipsum dolor sit amet consectetur adipisicing elit.'
        }}
      />

      <div className='text-center'>I'm below!</div>
    </>
  )
}
