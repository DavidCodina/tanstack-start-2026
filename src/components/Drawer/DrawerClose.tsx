import { DrawerPreview as Drawer } from '@base-ui/react/drawer'
import { PanelRightClose } from 'lucide-react'
import { cn } from '@/utils'

export type DrawerCloseProps = Drawer.Close.Props

// const baseClasses = `
// flex h-10 items-center justify-center
// rounded-md border border-gray-200
// bg-gray-50 px-3.5 text-base font-medium text-gray-900
// select-none hover:bg-gray-100
// focus-visible:outline
// focus-visible:-outline-offset-1
// focus-visible:outline-blue-800
// active:bg-gray-100
// `

//# Review and update styles
// Here, the absolute is in association with the relative on DrawerPopup.
const baseClasses = `
 absolute top-2 right-2 p-1
rounded-md select-none cursor-pointer
hover:bg-accent
focus-visible:outline
focus-visible:outline-2
focus-visible:-outline-offset-1
focus-visible:outline-blue-800
`

/* ========================================================================

======================================================================== */
//
export const DrawerClose = ({
  children = <PanelRightClose />,
  className = '',
  ...otherProps
}: DrawerCloseProps) => {
  return (
    <Drawer.Close
      {...otherProps}
      children={children}
      data-slot='drawer-close'
      className={(drawerCloseState) => {
        if (typeof className === 'function') {
          className = className(drawerCloseState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
