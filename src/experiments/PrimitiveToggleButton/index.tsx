// Note: This image was captured using the VSCode Polacode extension.
// The code-to-image translation somtimes generates  small bugs in the images.

/* ========================================================================
                            PrimitiveToggleButton
======================================================================== */
/* 
className prop as function? Whut!

React Router's <NavLink /> has a className and style prop that can optionally
be passed a function that receives NavLinkRenderProps. 

  type NavLinkRenderProps = {
    isActive: boolean;
    isPending: boolean;
    isTransitioning: boolean;
  }

  interface NavLinkProps extends Omit<LinkProps, "className" | "style" | "children"> {
    children?: React.ReactNode | ((props: NavLinkRenderProps) => React.ReactNode);
    caseSensitive?: boolean;
    className?: string | ((props: NavLinkRenderProps) => string | undefined);
    end?: boolean;
   style?: React.CSSProperties | ((props: NavLinkRenderProps) => React.CSSProperties | undefined);
  }

This is a cool pattern for when you want to expose some state to the consumer and allow them to use
that state to conditionally apply styles. Admittedly, it's not frequently needed, but still useful.
Below is an example of a primitive toggle button that uses this pattern.
*/

import { useState } from 'react'

type Props = {
  activeText?: string
  inactiveText?: string
  className?: string | ((isActive: boolean) => string | undefined)
} & Omit<React.ComponentProps<'button'>, 'className'>

export const PrimitiveToggleButton = ({
  activeText,
  children,
  className,
  inactiveText,
  onClick,
  ...otherProps
}: Props) => {
  const [isActive, setIsActive] = useState(false)
  const text = isActive ? activeText || children : inactiveText || children

  return (
    <button
      className={
        typeof className === 'function' ? className(isActive) : className
      }
      onClick={(e) => {
        onClick?.(e)
        setIsActive((v) => !v)
      }}
      {...otherProps}
    >
      {text}
    </button>
  )
}

/* ========================================================================
                          PrimitiveToggleButtonDemo
======================================================================== */

export const PrimitiveToggleButtonDemo = () => {
  return (
    <div className='mb-6 flex justify-center'>
      <PrimitiveToggleButton
        activeText='ON'
        inactiveText='OFF'
        className={(isActive) => {
          const baseClassName =
            'min-w-[80px] rounded border px-2 py-1 font-bold text-white transition-all'
          if (isActive) {
            return `${baseClassName} border-green-600 bg-green-400`
          }

          return `${baseClassName} border-neutral-600 bg-neutral-400`
        }}
        onClick={() => {
          console.log('Click!')
        }}
      />
    </div>
  )
}
