import { Menu } from '@base-ui/react/menu'
import { cn } from '@/utils'

export type MenuPortalProps = Menu.Portal.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */
// A portal element that moves the popup to a different part of the DOM.
// By default, the portal element is appended to <body>. Renders a <div> element.

export const MenuPortal = ({
  className = '',
  ...otherProps
}: MenuPortalProps) => {
  return (
    <Menu.Portal
      {...otherProps}
      data-slot='menu-portal'
      className={(menuPortalState) => {
        if (typeof className === 'function') {
          className = className(menuPortalState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
