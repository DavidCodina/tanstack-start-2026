import { Hamburger } from 'lucide-react'
import { Toggle } from '../Toggle'

const SHADOW_MIXIN = `shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]`

/* ========================================================================

======================================================================== */

export const ToggleDemo1 = () => {
  return (
    <div>
      <Toggle
        className={`mx-auto flex ${SHADOW_MIXIN}`}
        size='xl'
        value='center'
        variant='success'
      >
        Toggle Me
      </Toggle>

      <br />

      <Toggle
        className={`mx-auto flex ${SHADOW_MIXIN}`}
        isIcon
        size='xl'
        value='center'
        variant='success'
      >
        <Hamburger />
      </Toggle>
    </div>
  )
}
