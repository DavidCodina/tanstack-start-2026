import { Menu } from '@base-ui/react/menu'

export type MenuRootProps = Menu.Root.Props

/* ========================================================================

======================================================================== */
// Groups all parts of the menu. Doesn’t render its own HTML element.

export const MenuRoot = (props: MenuRootProps) => {
  return (
    <Menu.Root
      ///////////////////////////////////////////////////////////////////////////
      //
      // The default Base UI value for the modal prop is true. The problem with
      // that is in the absence of explicitly setting something like this  on MenuPopup:
      //
      //   max-h-(--available-height)
      //
      // the Menu content can potentially extend beyond the bottom of the viewport,
      // but there will be no way to scroll to it. Currently, I'm against setting
      // max-h-(--available-height) on MenuPopup because there's no UI to indicate
      // when then menu itself is scrollable. Instead, I prefer to allow the browser
      // window itself to become scrollable. This is similar to the default behavior
      // of the Popover and Tooltip.
      //
      /////////////////////////////////////////////////////////////////////////////

      modal={false}
      {...props}
    />
  )
}
