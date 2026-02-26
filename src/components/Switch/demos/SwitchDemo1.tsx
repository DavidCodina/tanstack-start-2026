import { Switch } from '../'

/* ========================================================================

======================================================================== */

export const SwitchDemo1 = () => {
  return (
    <Switch
      switchRootProps={{
        defaultChecked: true
      }}
      fieldLabelProps={{
        children: ' Notifications'
      }}
    />
  )
}
