import * as React from 'react'
import { TextAlignCenter, TextAlignEnd, TextAlignStart } from 'lucide-react'
import { Toggle } from '../../Toggle'
import { ToggleGroup } from '../ToggleGroup'

const SHADOW_MIXIN = `shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]`

/* ======================

====================== */

const Alignment = () => {
  return (
    <ToggleGroup
      className={`${SHADOW_MIXIN}`}
      multiple

      //defaultValue={['left']}
    >
      <Toggle
        aria-label='Align left'
        size='xl'
        value='left'
        isIcon
        variant='green'
      >
        <TextAlignStart />
      </Toggle>
      <Toggle
        aria-label='Align center'
        size='xl'
        value='center'
        isIcon
        variant='green'
      >
        <TextAlignCenter />
      </Toggle>
      <Toggle
        aria-label='Align right'
        size='xl'
        value='right'
        isIcon
        variant='green'
      >
        <TextAlignEnd />
      </Toggle>
    </ToggleGroup>
  )
}

/* ========================================================================

======================================================================== */
//# Work on integrating with the orientation feature.

export const ToggleGroupDemo1 = () => {
  const [value, setValue] = React.useState(['left'])

  return (
    <div className='flex justify-center gap-4'>
      <ToggleGroup
        // disabled
        multiple
        className={`${SHADOW_MIXIN}`}
        onValueChange={(groupValue, _eventDetails) => {
          console.log('onValueChange:', groupValue)
          setValue(groupValue)
        }}
        value={value}
      >
        <Toggle aria-label='Align left' size='xl' value='left' variant='green'>
          Left
        </Toggle>
        <Toggle
          aria-label='Align center'
          size='xl'
          value='center'
          variant='green'
        >
          Center
        </Toggle>
        <Toggle
          aria-label='Align right'
          size='xl'
          value='right'
          variant='green'
        >
          Right
        </Toggle>
      </ToggleGroup>

      <Alignment />
    </div>
  )
}
