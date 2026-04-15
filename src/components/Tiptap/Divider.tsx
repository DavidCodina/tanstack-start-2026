import type { JSX } from 'react'

/* ========================================================================
                                Divider        
======================================================================== */

export const Divider = (): JSX.Element => {
  return (
    <div
      style={{
        alignSelf: 'stretch',
        backgroundColor: 'var(--color-neutral-400)',
        width: 1
      }}
    />
  )
}
