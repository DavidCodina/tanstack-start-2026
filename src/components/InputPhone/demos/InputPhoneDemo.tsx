import * as React from 'react'
import { CountryCodeSelect, InputPhone } from '../.'
import type { CountryCode } from 'libphonenumber-js'
import type { InputPhoneAPI } from '../types'
import type { CountryCodeSelectAPI } from '../CountryCodeSelect'
import { Button } from '@/components'

/* ========================================================================

======================================================================== */
//Todo: Add validation to example.

export const InputPhoneDemo = () => {
  const inputPhoneApiRef = React.useRef<InputPhoneAPI>(undefined)
  const countrySelectApiRef = React.useRef<CountryCodeSelectAPI>(undefined)
  const [countryCode, setCountryCode] = React.useState<CountryCode | ''>('')
  const [inputPhoneValue, setInputPhoneValue] = React.useState('')

  const renderControls = () => {
    return (
      <div className='mb-4 flex justify-center gap-2'>
        <Button
          className='min-w-[100px]'
          onClick={() => {
            if (!inputPhoneApiRef.current) {
              return
            }
            console.log(inputPhoneApiRef.current)
          }}
          size='sm'
        >
          Log API
        </Button>

        <Button
          className='min-w-[100px]'
          onClick={() => {
            ///////////////////////////////////////////////////////////////////////////
            //
            // If you're not using a controlled implementation, reset as follows:
            // if (!inputPhoneApiRef.current || !countrySelectApiRef.current) { return }
            // countrySelectApiRef.current.reset()
            // inputPhoneApiRef.current.reset()
            //
            ///////////////////////////////////////////////////////////////////////////
            setCountryCode('')
            setInputPhoneValue('')
          }}
          size='sm'
        >
          Reset
        </Button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {renderControls()}

      {/* ⚠️ It's tempting to make an InputPhoneInternational component. However, leaving CountrySelect and 
      InputPhone as two distinct components allows for maximimum flexibility and composability. The trade-off,
      of course, is that the developer must compose them as needed for every instance. */}
      <div
        className='mx-auto flex max-w-[600px] gap-2'
        style={
          {
            //! outline: '2px dashed var(--color-pink-500)'
          }
        }
      >
        <CountryCodeSelect
          apiRef={countrySelectApiRef}
          onValueChange={(value) => {
            setCountryCode(value)
          }}
          value={countryCode}
          fieldRootProps={{}}
          fieldLabelProps={{
            children: 'Country'
          }}
          selectRootProps={{}}
          selectTriggerProps={{}}
          selectValueProps={{}}
          selectPortalProps={{}}
          selectPositionerProps={{}}
          selectPopupProps={{}}
          selectListProps={{}}
          fieldDescriptionProps={{}}
          fieldErrorProps={{}}
        />

        <InputPhone
          apiRef={inputPhoneApiRef}
          countryCode={countryCode}
          onValueChange={(data) => {
            // console.log('value changed:', data)
            setInputPhoneValue(data.formattedValue)
          }}
          value={inputPhoneValue}
          fieldRootProps={{
            className: '',
            style: {}
          }}
          inputProps={{}}
          fieldLabelProps={{
            children: 'Phone Number'
          }}
          fieldErrorProps={{}}
          fieldDescriptionProps={{}}
        />
      </div>
    </>
  )
}
