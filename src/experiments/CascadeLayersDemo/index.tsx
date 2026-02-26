import type { ComponentProps } from 'react'
import './index.css'

type Props = ComponentProps<'div'>

/* ========================================================================
                          
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ✅ Kevin Powell: https://www.youtube.com/watch?v=NDNRGW-_1EE
//
// https://caniuse.com/css-cascade-layers
// https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
// https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_layers
//
// https://polypane.app/css-specificity-calculator/
//
///////////////////////////////////////////////////////////////////////////

export const CascadeLayersDemo = ({
  className,
  children,
  ...otherProps
}: Props) => {
  /* ======================
          return
  ====================== */

  return (
    <div className={`box${className ? ` ${className}` : ''}`} {...otherProps}>
      {children}
    </div>
  )
}
