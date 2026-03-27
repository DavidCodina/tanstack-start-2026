import * as React from 'react'

///////////////////////////////////////////////////////////////////////////
//
// libphonenumber-js is the library that react-phone-number-input is
// built on top of. Here we're using libphonenumber-js directly because
// we want to continue to use the Base UI Input component, rather than
// the PhoneInput from react-phone-number-input.
// https://www.npmjs.com/package/libphonenumber-js
//
///////////////////////////////////////////////////////////////////////////

import parsePhoneNumber, {
  AsYouType,
  isPossiblePhoneNumber, // Only validates phone number length
  isValidPhoneNumber // Validates both phone number length and phone number digits (arguablye too strict).
  // parseDigits
  // parsePhoneNumberFromString
  // parsePhoneNumberWithError
} from 'libphonenumber-js'
import { Input } from '../Input'
import type { InputPhoneAPI, InputPhoneProps } from './types'
import { cn } from '@/utils'

type InternalValue = { value: string }

/* ========================================================================

======================================================================== */
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
  value: externalValue,

  fieldRootProps = {},
  inputProps = {},
  fieldLabelProps = {},
  fieldErrorProps = {},
  fieldDescriptionProps = {}
}: InputPhoneProps) => {
  // If !countryCode, then set it back to undefined.
  countryCode = countryCode || undefined

  const mountedRef = React.useRef(false)

  ///////////////////////////////////////////////////////////////////////////
  //
  // Why is internalValue a { value: string } object? When countryCode changes, we
  // always want to reevaluate the formattedValue and then update the internalValue.
  // Ultimately, we want ANY update to internalValue to trigger the useEffect() that
  // watches internalValue. However, in some edge cases it's conceivable that a change
  // to countryCode will not actually create a different formattedValue. In order to force
  // that useEffect() to always run after calling setInternalValue(), we wrap the actual
  // value primitive in a reference object.
  //
  ///////////////////////////////////////////////////////////////////////////

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
    <Input
      fieldRootProps={{
        name: 'input_phone',
        ...fieldRootProps,
        className: (fieldRootState) => {
          if (typeof fieldRootProps.className === 'function') {
            fieldRootProps.className =
              fieldRootProps.className(fieldRootState) || ''
          }
          return cn('flex-1', fieldRootProps.className)
        }
      }}
      fieldLabelProps={fieldLabelProps}
      inputProps={{
        placeholder: 'Phone Number...',
        ...inputProps,
        value: internalValue.value,
        onValueChange: (val, _eventDetails) => {
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

          const formattedValue = new AsYouType(countryCode).input(val)

          ///////////////////////////////////////////////////////////////////////////
          //
          // See here around line 45 for dealing with backspace/delete:
          // https://gitlab.com/catamphetamine/react-phone-number-input/-/blob/master/source/InputBasic.js?ref_type=heads
          // This solution is similar to the one used by react-phone-number-input, and is intended to fix the following issue:
          //
          //   The user removed characters from the right side of the displayed value,
          //   but after re-formatting, we end up with the same string — meaning they
          //   only deleted formatting/punctuation characters, not any actual digits."
          //
          // AsYouType seems to handle "-" and spaces and "+" fine. Strangely, it's only "("" and ")" that it fails at.
          //
          ///////////////////////////////////////////////////////////////////////////
          if (
            formattedValue === internalValue.value &&
            internalValue.value.startsWith(val)
          ) {
            const digits = val.replace(/\D/g, '')
            const reFormatted = new AsYouType(countryCode).input(
              digits.slice(0, -1)
            )
            setInternalValue({ value: reFormatted })
            return
          }

          setInternalValue({ value: formattedValue })
        }
      }}
      fieldErrorProps={fieldErrorProps}
      fieldDescriptionProps={fieldDescriptionProps}
    />
  )
}
