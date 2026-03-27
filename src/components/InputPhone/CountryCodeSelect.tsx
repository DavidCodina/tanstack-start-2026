'use client'

import * as React from 'react'
///////////////////////////////////////////////////////////////////////////
//
// Note: libphonenumber-js uses the term "country code" rather broadly and it includes both the official
// ISO country codes and a few of unofficial "country codes" (i.e., AC, TA, SH, XK).
// For that reason, a developer should use a "country code" returned from this library with caution
// in an application that only expects the official ISO "country codes" to exist.
//
// The country-flag-icons package seems to stay in sync with libphonenumber-js and even includes
// XA, XO, XC, and others which are not implemented in libphonenumber-js.
//
///////////////////////////////////////////////////////////////////////////
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
// A hardcoded dictionary of codes to country names.
import en from 'react-phone-number-input/locale/en'
// import { hasFlag } from 'country-flag-icons'
import * as flags from 'country-flag-icons/react/3x2'
import { Select, SelectItem } from '../Select'
import type { SelectProps } from '../Select'
import type { Select as SelectPrimitive } from '@base-ui/react/select'
// Yes: AC, TA, SH, XK, No: XA, XO, XC
import type { CountryCode } from 'libphonenumber-js'
import { cn } from '@/utils'

export type CountryCodeSelectAPI = {
  reset: () => void
}

export type CountryCodeSelectProps = Omit<
  SelectProps,
  'children' | 'selectRootProps'
> & {
  // export CountrySelectAPI  above for convenience, but DO NOT use it as
  // the apiRef type here. Why? It would make passing a ref to the consumed
  // component's apiRef prop too strict.
  apiRef?: React.RefObject<unknown>
  onValueChange?: (value: CountryCode | '') => void
  value?: CountryCode | ''

  selectRootProps?: Omit<
    React.ComponentProps<typeof SelectPrimitive.Root>,
    'onValueChange' | 'value'
  >
}

/* ======================
        items
====================== */

// All country codes are derived directly from libphonenumber-js and act as the source of truth.
const countryCodes = getCountries() || []

// Unfortunately, libphonenumber-js itself doesn't have a labeling helper, but
// react-phone-number-input does. This should include all country codes since
// both libraries are made by the same person. However, `code` itself is used
// as a fallback value just in case.
const labelsObject = en
const countryNameToCodeCodeDictionary = Object.fromEntries(
  countryCodes.map((code) => [labelsObject[code] || code, code])
)

// An alphabetized list of country names to be used to populate the <select> options.
const countryNames = Object.keys(countryNameToCodeCodeDictionary).sort((a, b) =>
  a.localeCompare(b)
)

// Use countryNames to create items - an array of {label: string; value: CountryCode;}[],
// that is appropriately formatted for the Base UI Select component.
const items = countryNames.map((countryName, _index) => {
  // Each countryName will have a countryCode, since countryNames was originally derived from countryCodes.
  const countryCode = countryNameToCodeCodeDictionary[countryName]

  return {
    label: `${countryName}: +${getCountryCallingCode(countryCode)}`,
    value: countryCode
  }
})

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// CountryCodeSelect is intended to be used in conjunction with InputPhone.
// It passes back a CountryCode when selected (e.g., 'US', 'GB', etc.).
// This is then used by InputPhone to derive the country calling code.
// This is the pattern that react-phone-number-input uses.
// See here: https://gitlab.com/catamphetamine/react-phone-number-input/-/blob/master/source/CountrySelect.js?ref_type=heads
//
// CountryCodeSelect is an abstraction on top of the Base UI Select component.
// It has its own internalValue state. This allows us to clear it when needed.
//
///////////////////////////////////////////////////////////////////////////

export const CountryCodeSelect = ({
  apiRef,
  onValueChange,
  value: externalValue = '',
  fieldRootProps = {},
  fieldLabelProps = {},
  selectRootProps = {},
  selectTriggerProps = {},
  selectValueProps = {},
  selectPortalProps = {},
  selectPositionerProps = {},
  selectPopupProps = {},
  selectListProps = {},
  fieldDescriptionProps = {},
  fieldErrorProps = {}
}: CountryCodeSelectProps) => {
  const [internalValue, setInternalValue] = React.useState<CountryCode | ''>(
    () => {
      return externalValue || ''
    }
  )

  /* ======================
      Initialize apiRef
  ====================== */

  React.useEffect(() => {
    if (apiRef) {
      apiRef.current = {
        reset: () => {
          setInternalValue('')
        }
      }
    }
  }, [apiRef])

  /* ======================
  Two-Way Binding (Part 1)
  ====================== */
  // Any time externalValue changes, update internalValue.

  React.useEffect(() => {
    setInternalValue(externalValue)
  }, [externalValue])

  /* ======================
    Two-Way Binding (Part 2)
  ====================== */
  // Any time inernalValue changes, call onValueChange() so consumer can update externalValue.
  // Arguably, this could also be done from within the select's onChange prop. However, it's better
  // to separate the concerns of the onChange prop, which should only be responsible for updating the
  // internalValue.

  React.useEffect(() => {
    onValueChange?.(internalValue)
  }, [internalValue]) // eslint-disable-line

  /* ======================
        renderFlag()
  ====================== */

  const renderFlag = () => {
    if (!internalValue) return null

    const FlagComponent = flags[internalValue as keyof typeof flags]

    if (FlagComponent) {
      return <FlagComponent className='h-[1.25em]' />
    }

    // Fallback SVG (Taken from react-phone-number-input).
    if (!FlagComponent && internalValue) {
      return (
        <svg
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 75 50'
          className='h-[1.25em]'
        >
          <path
            stroke='none'
            fill='currentColor'
            d='M12.4,17.9c2.9-2.9,5.4-4.8,0.3-11.2S4.1,5.2,1.3,8.1C-2,11.4,1.1,23.5,13.1,35.6s24.3,15.2,27.5,11.9c2.8-2.8,7.8-6.3,1.4-11.5s-8.3-2.6-11.2,0.3c-2,2-7.2-2.2-11.7-6.7S10.4,19.9,12.4,17.9z'
          />
          <g
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeMiterlimit='10'
          >
            <path
              strokeLinecap='round'
              d='M47.2,36.1C48.1,36,49,36,50,36c7.4,0,14,1.7,18.5,4.3'
            />
            <path d='M68.6,9.6C64.2,12.3,57.5,14,50,14c-7.4,0-14-1.7-18.5-4.3' />
            <line x1='26' y1='25' x2='74' y2='25' />
            <line x1='50' y1='1' x2='50' y2='49' />
            <path
              strokeLinecap='round'
              d='M46.3,48.7c1.2,0.2,2.5,0.3,3.7,0.3c13.3,0,24-10.7,24-24S63.3,1,50,1S26,11.7,26,25c0,2,0.3,3.9,0.7,5.8'
            />
            <path
              strokeLinecap='round'
              d='M46.8,48.2c1,0.6,2.1,0.8,3.2,0.8c6.6,0,12-10.7,12-24S56.6,1,50,1S38,11.7,38,25c0,1.4,0.1,2.7,0.2,4c0,0.1,0,0.2,0,0.2'
            />
          </g>
        </svg>
      )
    }

    return null
  }

  /* ======================
  renderCountryCallingCode()
  ====================== */

  const renderCountryCallingCode = () => {
    if (!internalValue) return null

    try {
      // ⚠️ Will throw an error if country doesn't exist or isn't supported by this libphonenumber-js.
      const countryCallingCode = getCountryCallingCode(internalValue)
      if (countryCallingCode) {
        return <div className='leading-none'>+{countryCallingCode}</div>
      }
    } catch (err) {
      if (err instanceof Error) {
        // Example: {name: 'Error', message: 'Unknown country: XX'}
        // console.log({ name: err.name, message: err.message })
        return <div className='ml-1 text-[0.8em] leading-none'>❌ Error</div>
      }
    }

    return null
  }

  /* ======================
        renderItems()
  ====================== */

  const renderItems = () => {
    return items.map(({ label, value }, _index) => (
      <SelectItem
        // Can use `label` as long as the labels are strings and not JSX.
        // Here it makes more sense than using `value`, just in case two
        // countries share the same countryCode value (?).
        key={label}
        children={label}
        selectItemTextProps={{
          children: label
        }}
        selectItemIndicatorProps={{}}
        value={value}
      />
    ))
  }

  /* ======================
          return
  ====================== */

  return (
    <Select
      fieldRootProps={{
        name: 'country_code',
        // validate: (value, _formValues) => {
        //   if (!value) return 'Required'
        //   return null
        // },
        ...fieldRootProps
      }}
      fieldLabelProps={{
        ...fieldLabelProps
        // children: 'Country',
        // labelRequired: true
      }}
      selectRootProps={{
        items: items,
        onValueChange: (value, _eventDetails) => {
          setInternalValue(value as CountryCode | '')
        },
        value: internalValue,
        ...selectRootProps
      }}
      selectTriggerProps={{
        placeholder: 'Country',
        ...selectTriggerProps,
        className: (selectTriggerState) => {
          if (typeof selectTriggerProps.className === 'function') {
            selectTriggerProps.className =
              selectTriggerProps.className(selectTriggerState) || ''
          }
          return cn('w-[7.25em]', selectTriggerProps.className)
        }
      }}
      selectValueProps={{
        ...selectValueProps,
        // ⚠️ Using `className` here doesn't work well when the render prop is also
        // being implemented. It's better to instead put classed directly on the
        // JSX from within the render prop.

        // Rather than returning the same item.label as in
        // the menu, we can hack the Select.Value as follows:
        render: (props, state) => {
          const value = state.value
          if (!value)
            return (
              <span
                {...props}
                className={cn(
                  'text-muted-foreground -mr-1 flex items-center gap-[0.25em]',
                  props.className
                )}
              />
            )
          return (
            <span
              {...props}
              className={cn(
                '-mr-1 flex items-center gap-[0.25em]',
                props.className
              )}
            >
              <div>{renderFlag()}</div>
              <div>{renderCountryCallingCode()}</div>
            </span>
          )
        }
      }}
      selectPortalProps={selectPortalProps}
      selectPositionerProps={selectPositionerProps}
      selectPopupProps={selectPopupProps}
      selectListProps={selectListProps}
      fieldDescriptionProps={fieldDescriptionProps}
      fieldErrorProps={fieldErrorProps}
    >
      {renderItems()}
    </Select>
  )
}
