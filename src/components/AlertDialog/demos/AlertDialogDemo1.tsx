import * as React from 'react'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogTrigger,
  createAlertDialogHandle
} from '../.'
import { Button } from '../../Button'

const ACCENT_COLOR_MIXIN = `[--dialog-accent-color:var(--color-lime-500)]`
const VARIANT = 'lime'

const ClickCounter = () => {
  const [count, setCount] = React.useState(0)

  return (
    <Button
      className='mx-auto mb-6 flex'
      onClick={() => {
        setCount((v) => v + 1)
      }}
      size='sm'
      variant='lime'
    >
      Count: {count}
    </Button>
  )
}

/* ========================================================================

======================================================================== */

export const AlertDialogDemo1 = () => {
  const [handle] = React.useState(createAlertDialogHandle())

  return (
    <>
      <AlertDialogTrigger
        handle={handle}
        render={
          <Button className='mx-auto flex' size='sm' variant='pink'>
            Open Alert Dialog
          </Button>
        }
      />

      <AlertDialog
        centered
        // fullscreen
        scrollable
        // closeButton={false}
        alertDialogRootProps={{
          handle: handle
        }}
        alertDialogTriggerProps={
          {
            // render: (
            //   <Button className='mx-auto flex' size='sm'>
            //     Open Alert Dialog
            //   </Button>
            // )
          }
        }
        alertDialogPortalProps={
          {
            // ⚠️ Use this if you want internal state to persist. For example, when true
            // the ClickCounter count will remain between opening and closing.
            // keepMounted: true
          }
        }
        alertDialogBackdropProps={{}}
        alertDialogContainerProps={{
          // centered: false,
          // fullscreen: false
          // scrollable: false
          style: {
            // width: 800,
            // outline: '2px dashed deeppink'
          },
          className: `w-[800px] [--dialog-container-spacing:50px] ${ACCENT_COLOR_MIXIN}`
        }}
        alertDialogPopupProps={
          {
            // className: 'border-pink-500'
          }
        }
        alertDialogHeaderProps={
          {
            // className: 'bg-neutral-200'
            // children: 'This will overwrite the Title and Description components!'
          }
        }
        alertDialogTitleProps={{
          children: 'Alert Dialog Title!'
        }}
        alertDialogDescriptionProps={{
          children: 'Welcome to the best alert dialog ever!'
        }}
        alertDialogBodyProps={{}}
        // ⚠️ When there is scrollable content AND a button, the view ends up at the bottom.
        // This happens by default in the Base UI Dialog.Popup. However, the default has
        // been inverted in the DialogPopup abstraction such that `initialFocus:false`
        alertDialogFooterProps={{
          className: 'justify-end',
          children: (
            <AlertDialogClose
              render={
                <Button className='min-w-[100px]' size='sm' variant={VARIANT}>
                  Got it!
                </Button>
              }
            />
          )
        }}
      >
        <ClickCounter />
        <div className='leading-loose'>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem
            excepturi qui magnam voluptate iure labore! Quo neque ut assumenda
            esse. Consequatur doloribus voluptas, eos harum explicabo ab eaque
            soluta voluptatem incidunt, quas totam tempore exercitationem iure
            repellat molestias cupiditate laudantium nulla veniam qui eius velit
            voluptatibus inventore maiores. Mollitia, nobis aliquam quas
          </p>
          {/* <p className='mb-6'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem
          excepturi qui magnam voluptate iure labore! Quo neque ut assumenda
          esse. Consequatur doloribus voluptas, eos harum explicabo ab eaque
          soluta voluptatem incidunt, quas totam tempore exercitationem iure
          repellat molestias cupiditate laudantium nulla veniam qui eius velit
          voluptatibus inventore maiores. Mollitia, nobis aliquam quas
          aspernatur expedita minus nihil. Minus libero, explicabo sequi quia
          natus alias, hic, odit deserunt ipsum laborum omnis nemo possimus odio
          laudantium minima quibusdam rem iste? Voluptatum quibusdam obcaecati,
          quas minima neque porro unde perferendis? Aspernatur autem alias nobis
          explicabo dignissimos blanditiis eos soluta vel quis minima aperiam
          nisi, quae iure velit! Veritatis aperiam accusantium quod architecto
          dicta. Ab nobis odio repudiandae numquam facilis voluptatum nihil, nam
          quos magnam rerum doloribus tempora odit architecto pariatur sapiente
          quo vel voluptate fuga, culpa, eius modi consectetur cum labore?
          Tenetur nam ducimus sapiente odio itaque quo a inventore error quis
          consequuntur incidunt aspernatur sit delectus dolorum qui nesciunt
          molestias quos, accusamus enim cumque perferendis temporibus fugiat?
          Nulla iusto consectetur, ut velit amet provident officiis quidem
          voluptate, neque explicabo eaque repellendus impedit sapiente
          doloremque ex cum fuga id omnis, temporibus repellat alias at saepe!
          Voluptatibus facilis modi facere quis necessitatibus. Ipsa, nulla
          voluptatum?
        </p>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem
          excepturi qui magnam voluptate iure labore! Quo neque ut assumenda
          esse. Consequatur doloribus voluptas, eos harum explicabo ab eaque
          soluta voluptatem incidunt, quas totam tempore exercitationem iure
          repellat molestias cupiditate laudantium nulla veniam qui eius velit
          voluptatibus inventore maiores. Mollitia, nobis aliquam quas
          aspernatur expedita minus nihil. Minus libero, explicabo sequi quia
          natus alias, hic, odit deserunt ipsum laborum omnis nemo possimus odio
          laudantium minima quibusdam rem iste? Voluptatum quibusdam obcaecati,
          quas minima neque porro unde perferendis? Aspernatur autem alias nobis
          explicabo dignissimos blanditiis eos soluta vel quis minima aperiam
          nisi, quae iure velit! Veritatis aperiam accusantium quod architecto
          dicta. Ab nobis odio repudiandae numquam facilis voluptatum nihil, nam
          quos magnam rerum doloribus tempora odit architecto pariatur sapiente
          quo vel voluptate fuga, culpa, eius modi consectetur cum labore?
          Tenetur nam ducimus sapiente odio itaque quo a inventore error quis
          consequuntur incidunt aspernatur sit delectus dolorum qui nesciunt
          molestias quos, accusamus enim cumque perferendis temporibus fugiat?
          Nulla iusto consectetur, ut velit amet provident officiis quidem
          voluptate, neque explicabo eaque repellendus impedit sapiente
          doloremque ex cum fuga id omnis, temporibus repellat alias at saepe!
          Voluptatibus facilis modi facere quis necessitatibus. Ipsa, nulla
          voluptatum?
        </p> */}
        </div>
      </AlertDialog>
    </>
  )
}
