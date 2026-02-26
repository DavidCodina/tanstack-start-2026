'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './'
import { Button } from '@/components'

/* ========================================================================

======================================================================== */

export const SheetDemo = () => {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            className='mx-auto flex min-w-[100px]'
            size='sm'
            variant='success'
          >
            Open Sheet
          </Button>
        }
      />

      <SheetContent showCloseButton={true} side='top'>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>
            Sheet description. Bla, bla, bla...
          </SheetDescription>
        </SheetHeader>

        <article className='px-4 text-sm'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
          maxime labore officia porro nesciunt voluptates at! Nisi, delectus,
          est facilis enim officia id sunt inventore a, beatae harum itaque!
          Optio natus totam dolores ex suscipit, tempore iusto itaque soluta
          recusandae fugiat libero ipsam laboriosam repellendus iste hic ratione
          cupiditate ipsum?
        </article>

        <SheetFooter>
          <SheetClose render={<Button size='sm'>Save changes</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
