import { AlertDialog } from '@base-ui/react/alert-dialog'

export type AlertDialogRootProps = AlertDialog.Root.Props

/* ========================================================================

======================================================================== */
// Groups all parts of the alert dialog. Doesn’t render its own HTML element.

export const AlertDialogRoot = (props: AlertDialogRootProps) => {
  return <AlertDialog.Root {...props} />
}
