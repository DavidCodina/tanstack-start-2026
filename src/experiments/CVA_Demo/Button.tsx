// Eventually the 1.0 version will be out and the package will be 'cva'
import { cva } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/utils'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The cva() function is used to create a variant configuration.
// I can see the usefulness of cva, but for the most part, I've never run into
// issues where my classes were so complext that simply using an if or switch
// was no longer practice. Moreover,for my normal Button component, I prefer
// that it be semi-primitive such that you pass in the 'btn-blue bnt-sm'. That
// pattern works perfectly fine, so that there's really no need to actually
// define all the variants.
//
// I think the argument in favor of cva is to abstract away the limitless flexibility
// of being able to pass in any clasess in favor of predefined variants (i.e., consistency).
// Essentially, this stupid-proofs the ways in which classes can be combined. I get it, but
// I generally don't see the need.
//
// Also if your component variations are extremely complex, then the cva() pattern
// can give you a more structured and readable way to define variants.
//
///////////////////////////////////////////////////////////////////////////

const buttonVariants = cva(
  // The default styles can be a string or an array of strings
  ['px-2', 'py-1', 'font-bold', 'text-white', 'rounded-lg', 'shadow border'],
  {
    variants: {
      color: {
        // Similarly, if you wanted to these values can also be an array of strings.
        primary: 'bg-blue-500 hover:bg-blue-700 border-blue-900',
        secondary: 'bg-gray-500 hover:bg-gray-700 border-gray-900',
        success: 'bg-green-500 hover:bg-green-700 border-green-900',
        danger: 'bg-red-500 hover:bg-red-700 border-red-900'
      },
      size: {
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-lg'
      }
    },

    // Use this to add classes bases on the selection of other variants.
    // Variants that apply when multiple other variant conditions are met.
    compoundVariants: [
      // {
      //   color: 'success',
      //   size: 'small',
      //   class: 'outline outline-dashed outline-red-500'
      // }
    ],
    defaultVariants: {
      color: 'primary',
      size: 'medium'
    }
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

// type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
//   color?: 'primary' | 'secondary' | 'danger' | 'success'
//   size?: 'small' | 'medium' | 'large'
// }

type Props = ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants

/* ========================================================================

======================================================================== */

export const Button = ({
  color = 'primary', // Not necessary because we already set the defaultVariants.
  size = 'medium', // Not necessary because we already set the defaultVariants.
  children,
  className = '',
  style = {},
  ...otherProps
}: Props) => {
  return (
    <button
      // className={buttonVariants({ color, size, className })}
      // Does CVA prevent style conflicts like twMerge? No. For bulletproof
      // components, wrap your cva component with twMerge (or cn()).
      className={cn(buttonVariants({ color, size }), className)}
      style={style}
      {...otherProps}
    >
      {children}
    </button>
  )
}
