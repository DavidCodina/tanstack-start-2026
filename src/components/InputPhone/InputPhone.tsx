import * as React from 'react'

// libphonenumber-js is the library that react-phone-number-input is
// built on top of. Here we're using libphonenumber-js directly because
// we want to continue to use the Base UI Input component, rather than
// the PhoneInput from react-phone-number-input.
// https://www.npmjs.com/package/libphonenumber-js
import parsePhoneNumber, {
  AsYouType,
  isPossiblePhoneNumber, // Only validates phone number length
  isValidPhoneNumber // Validates both phone number length and phone number digits (arguablye too strict).
  // parseDigits
  // parsePhoneNumberFromString
  // parsePhoneNumberWithError
} from 'libphonenumber-js'

import type { InputPhoneAPI, InputPhoneProps } from './types'
import { cn } from '@/utils'

const FIELD_BOX_SHADOW_MIXIN = `shadow-xs`

const FIELD_FOCUS_MIXIN = `
focus-visible:shadow-none
focus-visible:border-primary
focus-visible:ring-[3px]
focus-visible:ring-primary/40
`

const FIELD_VALID_MIXIN = `
not-group-data-validating/root:data-valid:not-data-disabled:border-success
not-group-data-validating/root:data-valid:focus-visible:border-success
not-group-data-validating/root:data-valid:focus-visible:ring-success/40
`

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:data-invalid:not-data-disabled:border-destructive
not-group-data-validating/root:data-invalid:focus-visible:border-destructive
not-group-data-validating/root:data-invalid:focus-visible:ring-destructive/40
`

const FIELD_DISABLED_MIXIN = `
data-disabled:cursor-not-allowed 
data-disabled:border-neutral-400
`

const baseClasses = `
flex bg-card
w-full min-w-0
[&:not([type='file'])]:px-[0.5em]
[&:not([type='file'])]:py-[0.25em]
rounded-[0.375em]
border outline-none
placeholder:text-muted-foreground
file:text-primary-foreground
file:bg-primary
file:border-r
file:border-border
file:font-medium
file:px-[0.5em]
file:py-[0.25em]
file:inline-flex
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
`

type InternalValue = { value: string }

/* ========================================================================

======================================================================== */
//# Once the prototype has been built (without Base UI), then integrate Base UI's Input.

///////////////////////////////////////////////////////////////////////////
//
// 'GB' Example:
//
// 011    — US international exit code
// 44     — UK country code
// 1782   — Stoke-on-Trent area code (drop the leading 0 from 01782)
// 849061 — local 6-digit number
//
// Acceptable values:
//
//   "44 1782 849061"
//   "+44 1782 849061"
//
// Note: Even if you included the leading 0 in the area code, the actual
// phoneNumberObject seems smart enough to remove it from: phoneNumberObject.nationalNumber.
//
///////////////////////////////////////////////////////////////////////////

export const InputPhone = ({
  // Useful for validating, without having to import isPossiblePhoneNumber,
  // isValidPhoneNumber directly from libphonenumber-js.
  apiRef,
  countryCode,
  onValueChange,
  // DO NOT set a default value of '' here.
  // It's important to know when externalValue is undefined vs typeof 'string'.
  value: externalValue
}: InputPhoneProps) => {
  // If !countryCode, then set it back to undefined.
  countryCode = countryCode || undefined

  const mountedRef = React.useRef(false)

  // Why is internalValue a { value: string } object? When countryCode changes, we
  // always want to reevaluate the formattedValue and then update the internalValue.
  // Ultimately, we want ANY update to internalValue to trigger the useEffect() that
  // watches internalValue. However, in some edge cases it's conceivable that a change
  // to countryCode will not actually create a different formattedValue. In order to force
  // that useEffect() to always run after calling setInternalValue(), we wrap the actual
  // value primitive in a reference object.
  const [internalValue, setInternalValue] = React.useState<InternalValue>(
    () => {
      const formattedValue = new AsYouType(countryCode).input(
        externalValue || ''
      )
      return { value: formattedValue }
    }
  )

  /* ======================
            API
  ====================== */

  React.useEffect(() => {
    if (apiRef) {
      const API: InputPhoneAPI = {
        formattedValue: new AsYouType(countryCode).input(internalValue.value),
        isPossiblePhoneNumber: isPossiblePhoneNumber(
          internalValue.value,
          countryCode
        ),
        isValidPhoneNumber: isValidPhoneNumber(
          internalValue.value,
          countryCode
        ),
        countryCode,
        phoneNumberObject: parsePhoneNumber(internalValue.value, countryCode),
        reset: () => {
          setInternalValue({ value: '' })
        }
      }

      apiRef.current = API
    }
  }, [internalValue, countryCode]) // eslint-disable-line

  /* ======================
  Two-Way Binding (Part 1)
  ====================== */
  // Any time externalValue changes, update internalValue.value.

  React.useEffect(() => {
    if (!mountedRef.current) {
      return
    }

    // Because internalValue is an object, the two-way binding will necessarily
    // cause a second update when it comes back around as externalValue. In order
    // to prevent this, we can check the internalValue.value property for equality.
    if (externalValue === internalValue.value) {
      return
    }

    const formattedValue = new AsYouType(countryCode).input(externalValue || '')
    setInternalValue({ value: formattedValue })
  }, [externalValue]) // eslint-disable-line

  /* ======================
    Two-Way Binding (Part 2)
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Any time inernalValue changes, call onValueChange() so consumer can update externalValue.
  // Arguably, this could also be done from within the input's onChange prop. However, it's better
  // to separate the concerns of the onChange, which should only be responsible for updating the
  // internalValue.
  //
  // ⚠️ Note: onValueChange() will fire on mount, but this is arguably the right behavior for this
  // component because onValueChange() passes back data that enriches the value: the consumer
  // passes in a raw value string and gets back phoneNumberObject, isPossiblePhoneNumber, etc.
  //
  ///////////////////////////////////////////////////////////////////////////

  React.useEffect(() => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Because the resulting formatted value is somewhat flexible:
    //
    //   "1 (303) 454-1234"
    //   "(303) 454-1234"
    //   "+1 303 454 12345"
    //
    // The isPossiblePhoneNumber() helper occassionally results in a false positive: "1 (303) 454-123"
    // However, it seems less likely to result in a false negative.
    //
    // The docs indicate that isPossiblePhoneNumber() only validates the phone number length.
    // However, a 'US' value of "23034541234" will not actually pass validation. This
    // implies that it also takes the associated countryCallingCode into account.
    //
    ///////////////////////////////////////////////////////////////////////////

    onValueChange?.({
      formattedValue: internalValue.value,
      countryCode,
      isPossiblePhoneNumber: isPossiblePhoneNumber(
        internalValue.value,
        countryCode
      ),
      isValidPhoneNumber: isValidPhoneNumber(internalValue.value, countryCode),
      ///////////////////////////////////////////////////////////////////////////
      //
      // Using parsePhoneNumber(value, code) only returns a PhoneNumber object
      // when `value` has at least two numbers and `countryCode` is defined.
      //
      // Initially, I thought to simply use digits:
      //
      //   const digits = parseDigits(v)
      //
      // However, because a user can include/exclude the countryCallingCode, it's unclear from digits
      // alone what their actual number is. In practice, the only reliable way of getting a consistent
      // result is to:
      //
      //   1. Use the isPossiblePhoneNumber() method to validate.
      //   2. Then use parsePhoneNumber() to tease apart the counryCallingCode and nationalNumber.
      //
      // That said, we have to TRUST that libphonenumber-js will work without really understanding HOW.
      // The issue is that the conceptual logic behind parsing international phone numbers is inherently
      // complex. Using isPossiblePhoneNumber() is sort of a semi-strict trade-off between no
      // validation and isValidPhoneNumber().
      //
      ///////////////////////////////////////////////////////////////////////////
      phoneNumberObject: parsePhoneNumber(internalValue.value, countryCode)
    })
  }, [internalValue]) // eslint-disable-line

  /* ======================
    countryCode update 
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Any time countryCode changes, reevaluate formattedValue and set internalValue.
  // Setting countryCode also potentially changes the result of isPossiblePhoneNumber()
  // and phoneNumberObject. Consequently, it's important to ALSO fire onValueChange().
  // That said, we're calling setInternalValue() here, which will cause the useEffect()
  // that watches internalValue to fire, subsequently calling onValueChange().
  //
  ///////////////////////////////////////////////////////////////////////////

  React.useEffect(() => {
    if (!mountedRef.current) {
      return
    }

    // If externalValue is a string, then we can reasonably assume that this is a controlled
    // implementation. In such cases, use externalValue as the source of truth.
    const internalOrExternalValue =
      typeof externalValue === 'string' ? externalValue : internalValue.value
    const formattedValue = new AsYouType(countryCode).input(
      internalOrExternalValue
    )

    setInternalValue({ value: formattedValue })
  }, [countryCode]) // eslint-disable-line

  /* ======================
      mountedRef update 
  ====================== */

  React.useEffect(() => {
    mountedRef.current = true
  }, [])

  /* ======================
          return
  ====================== */

  return (
    <input
      autoCapitalize='none'
      autoComplete='new-password'
      autoCorrect='off'
      spellCheck={false}
      data-slot='input-phone'
      className={cn(baseClasses, '')}
      value={internalValue.value}
      onChange={(e) => {
        const v = e.target.value
        ///////////////////////////////////////////////////////////////////////////
        //
        // Will parse out non-numeric characters.
        // Valid formatted 'US' values can be:
        //
        //   "1 (303) 454-1234"
        //   "(303) 454-1234"
        //   "+1 303 532 7870"
        //
        // Note: The end user must use < or > to navigate around the parentheses.
        // In other words, the delete button is insufficient.
        //
        ///////////////////////////////////////////////////////////////////////////
        const formattedValue = new AsYouType(countryCode).input(v)

        setInternalValue({ value: formattedValue })
      }}
    />
  )
}
