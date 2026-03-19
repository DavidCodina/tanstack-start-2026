import * as React from 'react'

type UseValidationHackParam = {
  forceValidity: boolean | undefined
  internalRef: React.RefObject<HTMLDivElement | null>
  invalid: boolean | undefined
  validating: boolean | undefined
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// See https://github.com/mui/base-ui/issues/3777
// Issues still exists as of v1.3.0
//
// The actual Base UI Field.Root component uses a FieldRootContext to propagate
// awareness of internal states to the composable children. Unfortunately, FieldRootContext
// is not exposed to the consumer. Rather than building out a context on top of that, I've
// just opted for the imperative hack, which seems to work well enough, and currently is
// favorable to building out a complete set of custom form controls.
//
// Be aware that superficially modifying the data-* attributes like this will cause them
// to be out of sync with the internal Field.Validity as well as the state.valid found
// within the render prop's function.
//
// Note: this implemenation can work in one of two ways:
// If you're not using a controlled invalid prop, then use:
//
//   forceValidity: false,
//   validating: submitting
//
// If you are using a controlled invalid prop, then simply pass
//
//   invalid: invalid
//   validating: submitting
//
///////////////////////////////////////////////////////////////////////////

export const useValidationHack = ({
  forceValidity,
  internalRef,
  invalid,
  validating
}: UseValidationHackParam) => {
  React.useEffect(() => {
    const fieldRoot = internalRef.current

    // Note: forceValidity is not intended to be used dynamically.
    // Thus, if you were to change from true to false, nothing would change.
    if (!fieldRoot) return

    const fieldItems = fieldRoot.querySelectorAll("[data-slot='field-item']")

    const fieldLabels = fieldRoot.querySelectorAll("[data-slot='field-label']")

    const fieldControl = fieldRoot.querySelector("[data-slot='field-control']")

    const fieldDescription = fieldRoot.querySelector(
      "[data-slot='field-description']"
    )

    const fieldError = fieldRoot.querySelector("[data-slot='field-error']")

    const checkboxGroup = fieldRoot.querySelector(
      "[data-slot='checkbox-group']"
    )

    const checkboxRoots = fieldRoot.querySelectorAll(
      "[data-slot='checkbox-root']"
    )

    const checkboxIndicators = fieldRoot.querySelectorAll(
      "[data-slot='checkbox-indicator']"
    )

    const radioGroup = fieldRoot.querySelector("[data-slot='radio-group']")

    const radioRoots = fieldRoot.querySelectorAll("[data-slot='radio-root']")

    const radioIndicators = fieldRoot.querySelectorAll(
      "[data-slot='radio-indicator']"
    )

    const selectTrigger = fieldRoot.querySelector(
      "[data-slot='select-trigger']"
    )

    const numberFieldRoot = fieldRoot.querySelector(
      "[data-slot='number-field-root']"
    )

    const numberFieldScrubArea = fieldRoot.querySelector(
      "[data-slot='number-field-scrub-area']"
    )

    const numberFieldScrubAreaCursor = fieldRoot.querySelector(
      "[data-slot='number-field-scrub-area-cursor']"
    )

    const numberFieldGroup = fieldRoot.querySelector(
      "[data-slot='number-field-group']"
    )

    const numberFieldInput = fieldRoot.querySelector(
      "[data-slot='number-field-input']"
    )

    const numberFieldDecrement = fieldRoot.querySelector(
      "[data-slot='number-field-decrement']"
    )

    const numberFieldIncrement = fieldRoot.querySelector(
      "[data-slot='number-field-increment']"
    )

    const autocompleteInput = fieldRoot.querySelector(
      "[data-slot='autocomplete-input']"
    )

    const autocompleteTrigger = fieldRoot.querySelector(
      "[data-slot='autocomplete-trigger']"
    )

    if (validating) {
      fieldRoot.setAttribute('data-validating', '')

      fieldItems.forEach((fieldItem) => {
        fieldItem.setAttribute('data-validating', '')
      })

      fieldLabels.forEach((fieldLabel) => {
        fieldLabel.setAttribute('data-validating', '')
      })

      if (fieldControl) {
        fieldControl.setAttribute('data-validating', '')
      }

      if (fieldDescription) {
        fieldDescription.setAttribute('data-validating', '')
      }

      if (fieldError) {
        fieldError.setAttribute('data-validating', '')
      }

      if (checkboxGroup) {
        checkboxGroup.setAttribute('data-validating', '')
      }

      checkboxRoots.forEach((checkboxRoot) => {
        checkboxRoot.setAttribute('data-validating', '')
      })

      checkboxIndicators.forEach((checkboxIndicator) => {
        checkboxIndicator.setAttribute('data-validating', '')
      })

      if (radioGroup) {
        radioGroup.setAttribute('data-validating', '')
      }

      radioRoots.forEach((radioRoot) => {
        radioRoot.setAttribute('data-validating', '')
      })

      radioIndicators.forEach((radioIndicator) => {
        radioIndicator.setAttribute('data-validating', '')
      })

      if (selectTrigger) {
        selectTrigger.setAttribute('data-validating', '')
      }

      if (numberFieldRoot) {
        numberFieldRoot.setAttribute('data-validating', '')
      }

      if (numberFieldScrubArea) {
        numberFieldScrubArea.setAttribute('data-validating', '')
      }

      if (numberFieldScrubAreaCursor) {
        numberFieldScrubAreaCursor.setAttribute('data-validating', '')
      }

      if (numberFieldGroup) {
        numberFieldGroup.setAttribute('data-validating', '')
      }

      if (numberFieldInput) {
        numberFieldInput.setAttribute('data-validating', '')
      }

      if (numberFieldDecrement) {
        numberFieldDecrement.setAttribute('data-validating', '')
      }

      if (numberFieldIncrement) {
        numberFieldIncrement.setAttribute('data-validating', '')
      }

      if (autocompleteInput) {
        autocompleteInput.setAttribute('data-validating', '')
      }

      if (autocompleteTrigger) {
        autocompleteTrigger.setAttribute('data-validating', '')
      }

      return
    }

    if (!validating) {
      fieldRoot.removeAttribute('data-validating')

      fieldItems.forEach((fieldItem) => {
        fieldItem.removeAttribute('data-validating')
      })

      fieldLabels.forEach((fieldLabel) => {
        fieldLabel.removeAttribute('data-validating')
      })

      if (fieldControl) fieldControl.removeAttribute('data-validating')

      if (fieldDescription) fieldDescription.removeAttribute('data-validating')

      if (fieldError) fieldError.removeAttribute('data-validating')

      if (checkboxGroup) {
        checkboxGroup.removeAttribute('data-validating')
      }

      checkboxRoots.forEach((checkboxRoot) => {
        checkboxRoot.removeAttribute('data-validating')
      })

      checkboxIndicators.forEach((checkboxIndicator) => {
        checkboxIndicator.removeAttribute('data-validating')
      })

      if (radioGroup) {
        radioGroup.removeAttribute('data-validating')
      }

      radioRoots.forEach((radioRoot) => {
        radioRoot.removeAttribute('data-validating')
      })

      radioIndicators.forEach((radioIndicator) => {
        radioIndicator.removeAttribute('data-validating')
      })

      if (selectTrigger) {
        selectTrigger.removeAttribute('data-validating')
      }

      if (numberFieldRoot) {
        numberFieldRoot.removeAttribute('data-validating')
      }

      if (numberFieldScrubArea) {
        numberFieldScrubArea.removeAttribute('data-validating')
      }

      if (numberFieldScrubAreaCursor) {
        numberFieldScrubAreaCursor.removeAttribute('data-validating')
      }

      if (numberFieldGroup) {
        numberFieldGroup.removeAttribute('data-validating')
      }

      if (numberFieldInput) {
        numberFieldInput.removeAttribute('data-validating')
      }

      if (numberFieldDecrement) {
        numberFieldDecrement.removeAttribute('data-validating')
      }

      if (numberFieldIncrement) {
        numberFieldIncrement.removeAttribute('data-validating')
      }

      if (autocompleteInput) {
        autocompleteInput.removeAttribute('data-validating')
      }

      if (autocompleteTrigger) {
        autocompleteTrigger.removeAttribute('data-validating')
      }
    }

    if (forceValidity !== true) return

    // Otherwise, check invalid for true | false | undefined.
    if (invalid === true) {
      fieldRoot.setAttribute('data-invalid', '')
      fieldRoot.removeAttribute('data-valid')

      fieldItems.forEach((fieldItem) => {
        fieldItem.setAttribute('data-invalid', '')
        fieldItem.removeAttribute('data-valid')
      })

      fieldLabels.forEach((fieldLabel) => {
        fieldLabel.setAttribute('data-invalid', '')
        fieldLabel.removeAttribute('data-valid')
      })

      if (fieldControl) {
        fieldControl.setAttribute('data-invalid', '')
        fieldControl.removeAttribute('data-valid')
      }

      if (fieldDescription) {
        fieldDescription.setAttribute('data-invalid', '')
        fieldDescription.removeAttribute('data-valid')
      }

      if (fieldError) {
        fieldError.setAttribute('data-invalid', '')
        fieldError.removeAttribute('data-valid')
      }

      if (checkboxGroup) {
        checkboxGroup.setAttribute('data-invalid', '')
        checkboxGroup.removeAttribute('data-valid')
      }

      checkboxRoots.forEach((checkboxRoot) => {
        checkboxRoot.setAttribute('data-invalid', '')
        checkboxRoot.removeAttribute('data-valid')
      })

      checkboxIndicators.forEach((checkboxIndicator) => {
        checkboxIndicator.setAttribute('data-invalid', '')
        checkboxIndicator.removeAttribute('data-valid')
      })

      if (radioGroup) {
        radioGroup.setAttribute('data-invalid', '')
        radioGroup.removeAttribute('data-valid')
      }

      radioRoots.forEach((radioRoot) => {
        radioRoot.setAttribute('data-invalid', '')
        radioRoot.removeAttribute('data-valid')
      })

      radioIndicators.forEach((radioIndicator) => {
        radioIndicator.setAttribute('data-invalid', '')
        radioIndicator.removeAttribute('data-valid')
      })

      if (selectTrigger) {
        selectTrigger.setAttribute('data-invalid', '')
        selectTrigger.removeAttribute('data-valid')
      }

      if (numberFieldRoot) {
        numberFieldRoot.setAttribute('data-invalid', '')
        numberFieldRoot.removeAttribute('data-valid')
      }

      if (numberFieldScrubArea) {
        numberFieldScrubArea.setAttribute('data-invalid', '')
        numberFieldScrubArea.removeAttribute('data-valid')
      }

      if (numberFieldScrubAreaCursor) {
        numberFieldScrubAreaCursor.setAttribute('data-invalid', '')
        numberFieldScrubAreaCursor.removeAttribute('data-valid')
      }

      if (numberFieldGroup) {
        numberFieldGroup.setAttribute('data-invalid', '')
        numberFieldGroup.removeAttribute('data-valid')
      }

      if (numberFieldInput) {
        numberFieldInput.setAttribute('data-invalid', '')
        numberFieldInput.removeAttribute('data-valid')
      }

      if (numberFieldDecrement) {
        numberFieldDecrement.setAttribute('data-invalid', '')
        numberFieldDecrement.removeAttribute('data-valid')
      }

      if (numberFieldIncrement) {
        numberFieldIncrement.setAttribute('data-invalid', '')
        numberFieldIncrement.removeAttribute('data-valid')
      }

      if (autocompleteInput) {
        autocompleteInput.setAttribute('data-invalid', '')
        autocompleteInput.removeAttribute('data-valid')
      }

      if (autocompleteTrigger) {
        autocompleteTrigger.setAttribute('data-invalid', '')
        autocompleteTrigger.removeAttribute('data-valid')
      }

      return
    }

    if (invalid === false) {
      fieldRoot.setAttribute('data-valid', '')
      fieldRoot.removeAttribute('data-invalid')

      fieldItems.forEach((fieldItem) => {
        fieldItem.setAttribute('data-valid', '')
        fieldItem.removeAttribute('data-invalid')
      })

      fieldLabels.forEach((fieldLabel) => {
        fieldLabel.setAttribute('data-valid', '')
        fieldLabel.removeAttribute('data-invalid')
      })

      if (fieldControl) {
        fieldControl.setAttribute('data-valid', '')
        fieldControl.removeAttribute('data-invalid')
      }

      if (fieldDescription) {
        fieldDescription.setAttribute('data-valid', '')
        fieldDescription.removeAttribute('data-invalid')
      }

      if (fieldError) {
        fieldError.setAttribute('data-valid', '')
        fieldError.removeAttribute('data-invalid')
      }

      if (checkboxGroup) {
        checkboxGroup.setAttribute('data-valid', '')
        checkboxGroup.removeAttribute('data-invalid')
      }

      checkboxRoots.forEach((checkboxRoot) => {
        checkboxRoot.setAttribute('data-valid', '')
        checkboxRoot.removeAttribute('data-invalid')
      })

      checkboxIndicators.forEach((checkboxIndicator) => {
        checkboxIndicator.setAttribute('data-valid', '')
        checkboxIndicator.removeAttribute('data-invalid')
      })

      if (radioGroup) {
        radioGroup.setAttribute('data-valid', '')
        radioGroup.removeAttribute('data-invalid')
      }

      radioRoots.forEach((radioRoot) => {
        radioRoot.setAttribute('data-valid', '')
        radioRoot.removeAttribute('data-invalid')
      })

      radioIndicators.forEach((radioIndicator) => {
        radioIndicator.setAttribute('data-valid', '')
        radioIndicator.removeAttribute('data-invalid')
      })

      if (selectTrigger) {
        selectTrigger.setAttribute('data-valid', '')
        selectTrigger.removeAttribute('data-invalid')
      }

      if (numberFieldRoot) {
        numberFieldRoot.setAttribute('data-valid', '')
        numberFieldRoot.removeAttribute('data-invalid')
      }

      if (numberFieldScrubArea) {
        numberFieldScrubArea.setAttribute('data-valid', '')
        numberFieldScrubArea.removeAttribute('data-invalid')
      }

      if (numberFieldScrubAreaCursor) {
        numberFieldScrubAreaCursor.setAttribute('data-valid', '')
        numberFieldScrubAreaCursor.removeAttribute('data-invalid')
      }

      if (numberFieldGroup) {
        numberFieldGroup.setAttribute('data-valid', '')
        numberFieldGroup.removeAttribute('data-invalid')
      }

      if (numberFieldInput) {
        numberFieldInput.setAttribute('data-valid', '')
        numberFieldInput.removeAttribute('data-invalid')
      }

      if (numberFieldDecrement) {
        numberFieldDecrement.setAttribute('data-valid', '')
        numberFieldDecrement.removeAttribute('data-invalid')
      }

      if (numberFieldIncrement) {
        numberFieldIncrement.setAttribute('data-valid', '')
        numberFieldIncrement.removeAttribute('data-invalid')
      }

      if (autocompleteInput) {
        autocompleteInput.setAttribute('data-valid', '')
        autocompleteInput.removeAttribute('data-invalid')
      }

      if (autocompleteTrigger) {
        autocompleteTrigger.setAttribute('data-valid', '')
        autocompleteTrigger.removeAttribute('data-invalid')
      }

      return
    }

    // Otherwise, invalid is undefined
    fieldRoot.removeAttribute('data-valid')
    fieldRoot.removeAttribute('data-invalid')

    fieldItems.forEach((fieldItem) => {
      fieldItem.removeAttribute('data-valid')
      fieldItem.removeAttribute('data-invalid')
    })

    fieldLabels.forEach((fieldLabel) => {
      fieldLabel.removeAttribute('data-valid')
      fieldLabel.removeAttribute('data-invalid')
    })

    if (fieldControl) {
      fieldControl.removeAttribute('data-valid')
      fieldControl.removeAttribute('data-invalid')
    }

    if (fieldDescription) {
      fieldDescription.removeAttribute('data-valid')
      fieldDescription.removeAttribute('data-invalid')
    }

    if (fieldError) {
      fieldError.removeAttribute('data-valid')
      fieldError.removeAttribute('data-invalid')
    }

    if (checkboxGroup) {
      checkboxGroup.removeAttribute('data-valid')
      checkboxGroup.removeAttribute('data-invalid')
    }

    checkboxRoots.forEach((checkboxRoot) => {
      checkboxRoot.removeAttribute('data-valid')
      checkboxRoot.removeAttribute('data-invalid')
    })

    checkboxIndicators.forEach((checkboxIndicator) => {
      checkboxIndicator.removeAttribute('data-valid')
      checkboxIndicator.removeAttribute('data-invalid')
    })

    if (radioGroup) {
      radioGroup.removeAttribute('data-valid')
      radioGroup.removeAttribute('data-invalid')
    }

    radioRoots.forEach((radioRoot) => {
      radioRoot.removeAttribute('data-valid')
      radioRoot.removeAttribute('data-invalid')
    })

    radioIndicators.forEach((radioIndicator) => {
      radioIndicator.removeAttribute('data-valid')
      radioIndicator.removeAttribute('data-invalid')
    })

    if (selectTrigger) {
      selectTrigger.removeAttribute('data-valid')
      selectTrigger.removeAttribute('data-invalid')
    }

    if (numberFieldRoot) {
      numberFieldRoot.removeAttribute('data-valid')
      numberFieldRoot.removeAttribute('data-invalid')
    }

    if (numberFieldScrubArea) {
      numberFieldScrubArea.removeAttribute('data-valid')
      numberFieldScrubArea.removeAttribute('data-invalid')
    }

    if (numberFieldScrubAreaCursor) {
      numberFieldScrubAreaCursor.removeAttribute('data-valid')
      numberFieldScrubAreaCursor.removeAttribute('data-invalid')
    }

    if (numberFieldGroup) {
      numberFieldGroup.removeAttribute('data-valid')
      numberFieldGroup.removeAttribute('data-invalid')
    }

    if (numberFieldInput) {
      numberFieldInput.removeAttribute('data-valid')
      numberFieldInput.removeAttribute('data-invalid')
    }

    if (numberFieldDecrement) {
      numberFieldDecrement.removeAttribute('data-valid')
      numberFieldDecrement.removeAttribute('data-invalid')
    }

    if (numberFieldIncrement) {
      numberFieldIncrement.removeAttribute('data-valid')
      numberFieldIncrement.removeAttribute('data-invalid')
    }

    if (autocompleteInput) {
      autocompleteInput.removeAttribute('data-valid')
      autocompleteInput.removeAttribute('data-invalid')
    }

    if (autocompleteTrigger) {
      autocompleteTrigger.removeAttribute('data-valid')
      autocompleteTrigger.removeAttribute('data-invalid')
    }
  }, [forceValidity, invalid, validating]) // eslint-disable-line
}

/* If all component validation styles are based off of the following modifiers:

  group-data-valid/root: ...
  group-data-invalid/root: ...

Then we no longer actually need to explicitly set validity
on each and every element. 

export const useValidationHack2 = ({
  forceValidity,
  internalRef,
  invalid,
  validating
}: UseValidationHackParam) => {
  React.useEffect(() => {
    const fieldRoot = internalRef.current
    // Note: forceValidity is not intended to be used dynamically.
    // Thus, if you were to change from true to false, nothing would change.
    if (!fieldRoot) return

    if (validating) {
      fieldRoot.setAttribute('data-validating', '')
      return
    }

    if (!validating) {
      fieldRoot.removeAttribute('data-validating')
    }

    if (forceValidity !== true) return

    // Otherwise, check invalid for true | false | undefined.
    if (invalid === true) {
      fieldRoot.setAttribute('data-invalid', '')
      fieldRoot.removeAttribute('data-valid')
      return
    }

    if (invalid === false) {
      fieldRoot.setAttribute('data-valid', '')
      fieldRoot.removeAttribute('data-invalid')
      return
    }

    // Otherwise, invalid is undefined
    fieldRoot.removeAttribute('data-valid')
    fieldRoot.removeAttribute('data-invalid')
  }, [forceValidity, invalid, validating]) // eslint-disable-line
}


That said, it's still arguably a better practice to be explicit.

*/
