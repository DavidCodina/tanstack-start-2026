import type { CountryCode, PhoneNumber } from 'libphonenumber-js'

type MaybeCountryCode = CountryCode | '' | null | undefined

/** Returned by onValueChange() and within apiRef.current. */
type InputPhoneData = {
  formattedValue: string
  // Note: phoneNumberObject also has the phoneNumberObject.country (i.e., countryCode).
  // However, this only becomes available once  parsePhoneNumber() begins returning a
  // PhoneNumber object instead of undefined. In constrast, this countryCode is simply
  // passed back directly from InputPhone's own countryCode prop. This can be useful
  // when validating.
  countryCode: MaybeCountryCode
  // Note: phoneNumberObject also has isPossible() and isValid() methods.
  // But again, these only becomes available once parsePhoneNumber() begins
  // returning a PhoneNumber object.
  isPossiblePhoneNumber: boolean
  isValidPhoneNumber: boolean
  phoneNumberObject: PhoneNumber | undefined
}

type OnValueChange = (data: InputPhoneData) => void

export type InputPhoneAPI = InputPhoneData & {
  reset: () => void
}

export type InputPhoneProps = {
  // export InputPhoneAPI above for convenience, but DO NOT use it as
  // the apiRef type here. Why? It would make passing a ref to the consumed
  // component's apiRef prop too strict.
  apiRef?: React.RefObject<unknown>

  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ If no countryCode is passed in, then
  //   - new AsYouType(countryCode).input(v) returns an unformatted string of numbers.
  //   - parsePhoneNumber(v, countryCode) returns undefined.
  //   - isPossiblePhoneNumber(formattedValue, countryCode) returns false.
  //
  // Here, we're explicitly requiring the consumer to pass in a countryCode prop.
  // This makes it so the consumer it reminded to pass in a countryCode.
  // Then if the value is '', we change it back to undefined, since '' is not allowed
  // by libphonenumber-js methods below.
  //
  ///////////////////////////////////////////////////////////////////////////
  countryCode: MaybeCountryCode // Required here.
  onValueChange?: OnValueChange
  value?: string
}
