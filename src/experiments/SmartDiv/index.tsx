import { forwardRef } from 'react'

type Props = React.ComponentProps<'div'>
type Ref = HTMLDivElement

export type SmartDivAPI = {
  getInfo: () => string
}

/* ========================================================================
      
======================================================================== */

export const SmartDiv = forwardRef<Ref, Props>(
  ({ children, ...otherProps }, ref) => {
    return (
      <div
        {...otherProps}
        ref={(node: any) => {
          if (ref && 'current' in ref) {
            if (node) {
              // node is a reference to the actual DOM element, so we're
              // adding data directly on the DOM element (i.e., 'expando properties').
              // This approach goes against React's more declarative philosophy,
              // but it still works fine.

              node.api = {
                getInfo: () => {
                  return "I'm smart!"
                }
              }
            }
            ref.current = node
          }
        }}
      >
        {children}
      </div>
    )
  }
)

SmartDiv.displayName = 'SmartDiv'
