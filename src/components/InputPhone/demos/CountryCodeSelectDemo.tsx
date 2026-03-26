import * as React from 'react'

import { CountryCodeSelect } from '../.'
import type { CountryCode } from 'libphonenumber-js'

import type { CountryCodeSelectAPI } from '../CountryCodeSelect'
import { Button } from '@/components'

/* ========================================================================

======================================================================== */

export const CountryCodeSelectDemo = () => {
  const countrySelectApiRef = React.useRef<CountryCodeSelectAPI>(undefined)

  const [countryCode, setCountryCode] = React.useState<CountryCode | ''>('')

  const renderControls = () => {
    return (
      <div className='mb-4 flex justify-center gap-2'>
        <Button
          className='min-w-[100px]'
          onClick={() => {
            ///////////////////////////////////////////////////////////////////////////
            //
            // If you're not using a controlled implementation, reset as follows:
            // if (!inputPhoneApiRef.current || !countrySelectApiRef.current) { return }
            // countrySelectApiRef.current.reset()
            //
            ///////////////////////////////////////////////////////////////////////////
            setCountryCode('')
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

      <div className='mx-auto flex max-w-[600px] gap-2'>
        <CountryCodeSelect
          apiRef={countrySelectApiRef}
          onValueChange={(value) => {
            setCountryCode(value)
          }}
          value={countryCode}
        />
      </div>
    </>
  )
}
