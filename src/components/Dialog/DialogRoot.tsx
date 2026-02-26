import { Dialog } from '@base-ui/react/dialog'

export type DialogRootProps = Dialog.Root.Props

/* ========================================================================

======================================================================== */
// Groups all parts of the dialog. Doesn’t render its own HTML element.

export const DialogRoot = (props: DialogRootProps) => {
  return <Dialog.Root {...props} />
}
