import { Drawer } from '../.'

/* ========================================================================

======================================================================== */

export const DrawerDemo1 = () => {
  return (
    <Drawer
      drawerRootProps={{
        swipeDirection: 'right'
      }}
      drawerTriggerProps={{
        className: 'text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
      }}
      drawerPortalProps={{}}
      drawerBackdropProps={{
        show: false
      }}
      drawerViewportProps={{}}
      drawerPopupProps={{}}
      drawerCloseProps={{
        className: 'text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
      }}
      drawerContentProps={
        {
          // children: (
          //   <DrawerPreview.Description className='font-[Chakra_Petch] font-light'>
          //     This is a drawer that slides in from the side. You can swipe to
          //     dismiss it.
          //   </DrawerPreview.Description>
          // )
        }
      }
      drawerTitleProps={{
        className: 'font-[Chakra_Petch] font-light tracking-wide',
        children: '_DRAWER DEMO'
      }}
      drawerDescriptionProps={{
        children:
          'This is a drawer that slides in from the side. You can swipe to dismiss it.',
        className: 'font-[Chakra_Petch] font-light'
      }}
    >
      <div className='border-primary my-4 border-t' />

      <div className='font-[Chakra_Petch] font-light'>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque nobis
        facere ex. Obcaecati, odit doloremque rem voluptatibus, quisquam eum
        error neque ducimus perspiciatis eveniet temporibus aut? Deserunt
        molestias quaerat dolorem modi ea neque velit vero ex possimus
        dignissimos assumenda facilis tempore facere, dolore explicabo expedita
        quia! Fuga laboriosam dolores velit?
      </div>
    </Drawer>
  )
}
