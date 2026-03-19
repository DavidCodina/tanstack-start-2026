import { Switch } from '../'

/* ========================================================================

======================================================================== */

export const SwitchDemo1 = () => {
  return (
    <Switch
      fieldRootProps={{
        // disabled: true,
        // invalid: true,
        validationMode: 'onChange',
        validate: (value, _formValues) => {
          ///////////////////////////////////////////////////////////////////////////
          //
          // ⚠️ Gotcha: When you actually run validate, it will log 'on' as the value.
          // Then it will log again with true as the value. Why?
          // Base UI's Field validation fires in two separate contexts:
          //
          //   1. Native HTML change event — The Switch renders a hidden
          //   <input type="checkbox">. When toggled, the browser fires a standard change event.
          //   A checkbox's native .value property is always the string 'on' (HTML default for checkboxes),
          //   so your validate function gets called with 'on'.
          //
          //   2. React-controlled value change — Base UI also tracks the component's logical checked state as
          //   a boolean (true/false) and runs validation against that value separately.
          //
          // But in practice this doesn't affect the validation. Just stick with true/false.
          //
          ///////////////////////////////////////////////////////////////////////////
          if (value !== true) {
            return 'Required (must be true)'
          }
          return null
        }
      }}
      fieldLabelProps={{
        children: ' Notifications'
      }}
      switchRootProps={
        {
          // defaultChecked: true
        }
      }
      switchThumbProps={{}}
      fieldErrorProps={{}}
      fieldDescriptionProps={{}}
    />
  )
}
