import type { JSX } from 'react'

/* ========================================================================
                                Divider        
======================================================================== */

export const Divider = (): JSX.Element => {
  return (
    <div
      style={{
        width: 1,
        backgroundColor: 'var(--color-neutral-400)'
      }}
    />
  )
}
