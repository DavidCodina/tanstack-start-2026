import { Field } from '@base-ui/react/field'
import { cn } from '@/utils'

export type FieldItemProps = Field.Item.Props

const baseClasses = `flex flex-wrap gap-x-[0.5em]`

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
// In this example FieldLabel is not wrapping RadioRoot like in many of the documentation examples.
// However, as long as you have FieldItem, the assoication will be handled internally by Base UI.
//
// {radios.map((item) => {
//   return (
//     <FieldItem key={item.id}>
//       <RadioRoot
//         // ❌ id={item.id}
//         value={item.value}
//       >
//         <RadioIndicator />
//       </RadioRoot>
//       <FieldLabel
//         className='text-[0.875em] leading-none'
//         // ❌ htmlFor={item.id}
//       >
//         {item.label}
//       </FieldLabel>
//     </FieldItem>
//   )
// })}
//
///////////////////////////////////////////////////////////////////////////

export const FieldItem = ({
  disabled,
  className = '',
  style,
  render,

  ...otherProps
}: FieldItemProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Field.Item
      {...otherProps}
      data-slot='field-item'
      className={cn(baseClasses, className)}
      disabled={disabled}
      style={style}
      render={render}
    />
  )
}
