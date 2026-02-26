import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  createMenuHandle
} from '../.'
import { Button } from '@/components'

/* ========================================================================

======================================================================== */

export const MenuDemo1 = () => {
  const [handle] = React.useState(createMenuHandle())

  return (
    <>
      <MenuTrigger
        handle={handle}
        render={
          <Button
            className='mx-auto flex gap-1'
            rightSection={<ChevronDown className='' />}
            size='sm'
            variant='pink'
          >
            Song
          </Button>
        }
      />

      <Menu
        menuRootProps={{
          handle: handle
        }}
        ///////////////////////////////////////////////////////////////////////////
        //
        // Pass in children or render prop and Menu will infer that the consumer
        // intends to use the internal MenuTrigger. Alternatively, use an external
        // MenuTrigger in conjunction with createMenuHandle() and the handle
        // prop on the MenuRoot and MenuTrigger.
        //
        ///////////////////////////////////////////////////////////////////////////

        menuTriggerProps={
          {
            // render: (
            //   <Button
            //     className='mx-auto flex gap-1'
            //     rightSection={<ChevronDown className='' />}
            //     size='sm'
            //     variant='info'
            //   >
            //     Song
            //   </Button>
            // )
          }
        }
        menuPortalProps={{}}
        menuPositionerProps={
          {
            //  side: 'right'
          }
        }
        menuPopupProps={
          {
            // children: (
            //   <>
            //     <MenuItem>Add to Library</MenuItem>
            //     <MenuItem>Add to Playlist</MenuItem>
            //     <MenuSeparator />
            //     <MenuItem>Play Next</MenuItem>
            //     <MenuItem>Play Last</MenuItem>
            //     <MenuSeparator />
            //     <MenuItem>Favorite</MenuItem>
            //     <MenuItem>Share</MenuItem>
            //   </>
            // )
          }
        }
      >
        <MenuItem>
          Add to Library Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Iure sapiente aspernatur quisquam dolore eum fugiat?
        </MenuItem>
        <MenuItem>Add to Playlist</MenuItem>

        <MenuSeparator />

        <MenuItem>Play Next</MenuItem>
        <MenuItem>Play Last</MenuItem>

        <MenuSeparator />

        <MenuItem>Favorite</MenuItem>
        <MenuItem>Share</MenuItem>

        <MenuSeparator />

        <MenuItem>1. Item</MenuItem>
        <MenuItem>2. Item</MenuItem>
        <MenuItem>3. Item</MenuItem>
        <MenuItem>4. Item</MenuItem>
        <MenuItem>5. Item</MenuItem>
        <MenuItem>6. Item</MenuItem>
        <MenuItem>7. Item</MenuItem>
        <MenuItem>8. Item</MenuItem>
        <MenuItem>9. Item</MenuItem>
        <MenuItem>10. Item</MenuItem>
        <MenuItem>11. Item</MenuItem>
        <MenuItem>12. Item</MenuItem>
        <MenuItem>13. Item</MenuItem>
        <MenuItem>14. Item</MenuItem>
        <MenuItem>15. Item</MenuItem>
        <MenuItem>16. Item</MenuItem>
        <MenuItem>17. Item</MenuItem>
        <MenuItem>18. Item</MenuItem>
        <MenuItem>19. Item</MenuItem>
        <MenuItem>20. Item</MenuItem>
      </Menu>

      {/* <article className='space-y-6'>
        <p className='leading-loose'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique
          nihil vitae totam consectetur sit provident ullam soluta eius error!
          Facilis, quae? Amet odio eveniet unde est, quae sint doloribus illum
          consectetur omnis ullam natus animi laborum ex aliquam quidem voluptas
          sunt numquam quaerat mollitia autem nihil quis soluta recusandae!
          Similique minus corporis dolor soluta repellendus provident eligendi
          sequi aspernatur consectetur, quibusdam, quidem nobis maiores
          laboriosam officiis, delectus a tempore in deserunt nemo at. Eius
          quidem, reiciendis rem magni iure explicabo numquam maiores ullam illo
          sapiente dolorum adipisci! Debitis reprehenderit sequi tenetur odit
          accusantium voluptates magni incidunt unde, voluptas rem? Pariatur
          nostrum doloremque, laudantium quo nemo illum consequatur aspernatur
          blanditiis et a ullam asperiores ab laboriosam eaque facere eligendi
          tenetur eius rem nulla est odit voluptas voluptates. Dolores, dolorum
          maxime. Alias tempore ut laborum vero voluptas consequatur excepturi
          voluptatibus, sunt porro rerum quod inventore recusandae perspiciatis
          reprehenderit hic rem iusto amet.
        </p>
        <p className='leading-loose'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique
          nihil vitae totam consectetur sit provident ullam soluta eius error!
          Facilis, quae? Amet odio eveniet unde est, quae sint doloribus illum
          consectetur omnis ullam natus animi laborum ex aliquam quidem voluptas
          sunt numquam quaerat mollitia autem nihil quis soluta recusandae!
          Similique minus corporis dolor soluta repellendus provident eligendi
          sequi aspernatur consectetur, quibusdam, quidem nobis maiores
          laboriosam officiis, delectus a tempore in deserunt nemo at. Eius
          quidem, reiciendis rem magni iure explicabo numquam maiores ullam illo
          sapiente dolorum adipisci! Debitis reprehenderit sequi tenetur odit
          accusantium voluptates magni incidunt unde, voluptas rem? Pariatur
          nostrum doloremque, laudantium quo nemo illum consequatur aspernatur
          blanditiis et a ullam asperiores ab laboriosam eaque facere eligendi
          tenetur eius rem nulla est odit voluptas voluptates. Dolores, dolorum
          maxime. Alias tempore ut laborum vero voluptas consequatur excepturi
          voluptatibus, sunt porro rerum quod inventore recusandae perspiciatis
          reprehenderit hic rem iusto amet.
        </p>

        <p className='leading-loose'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique
          nihil vitae totam consectetur sit provident ullam soluta eius error!
          Facilis, quae? Amet odio eveniet unde est, quae sint doloribus illum
          consectetur omnis ullam natus animi laborum ex aliquam quidem voluptas
          sunt numquam quaerat mollitia autem nihil quis soluta recusandae!
          Similique minus corporis dolor soluta repellendus provident eligendi
          sequi aspernatur consectetur, quibusdam, quidem nobis maiores
          laboriosam officiis, delectus a tempore in deserunt nemo at. Eius
          quidem, reiciendis rem magni iure explicabo numquam maiores ullam illo
          sapiente dolorum adipisci! Debitis reprehenderit sequi tenetur odit
          accusantium voluptates magni incidunt unde, voluptas rem? Pariatur
          nostrum doloremque, laudantium quo nemo illum consequatur aspernatur
          blanditiis et a ullam asperiores ab laboriosam eaque facere eligendi
          tenetur eius rem nulla est odit voluptas voluptates. Dolores, dolorum
          maxime. Alias tempore ut laborum vero voluptas consequatur excepturi
          voluptatibus, sunt porro rerum quod inventore recusandae perspiciatis
          reprehenderit hic rem iusto amet.
        </p>

        <p className='leading-loose'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique
          nihil vitae totam consectetur sit provident ullam soluta eius error!
          Facilis, quae? Amet odio eveniet unde est, quae sint doloribus illum
          consectetur omnis ullam natus animi laborum ex aliquam quidem voluptas
          sunt numquam quaerat mollitia autem nihil quis soluta recusandae!
          Similique minus corporis dolor soluta repellendus provident eligendi
          sequi aspernatur consectetur, quibusdam, quidem nobis maiores
          laboriosam officiis, delectus a tempore in deserunt nemo at. Eius
          quidem, reiciendis rem magni iure explicabo numquam maiores ullam illo
          sapiente dolorum adipisci! Debitis reprehenderit sequi tenetur odit
          accusantium voluptates magni incidunt unde, voluptas rem? Pariatur
          nostrum doloremque, laudantium quo nemo illum consequatur aspernatur
          blanditiis et a ullam asperiores ab laboriosam eaque facere eligendi
          tenetur eius rem nulla est odit voluptas voluptates. Dolores, dolorum
          maxime. Alias tempore ut laborum vero voluptas consequatur excepturi
          voluptatibus, sunt porro rerum quod inventore recusandae perspiciatis
          reprehenderit hic rem iusto amet.
        </p>
      </article> */}
    </>
  )
}
