import { Field } from '@base-ui/react/field'
import { cn } from '@/utils'

export type FieldDescriptionProps = Field.Description.Props

// ⚠️ Be careful if adding additional styles. This component is used
// by several other Base UI components (e.g., Checkbox, CheckboxGroup, etc.)
// w-full forces the error onto a new line when inside of a flex flex-wrap container.
const baseClasses = `mt-1 text-sm text-muted-foreground w-full overflow-scroll`

/* ========================================================================

======================================================================== */

export const FieldDescription = ({
  children,
  className,
  ...otherProps
}: FieldDescriptionProps) => {
  /* ======================
          return
  ====================== */

  if (!children) {
    return null
  }

  return (
    <Field.Description
      children={children}
      {...otherProps}
      data-slot='field-description'
      className={(fieldRootState) => {
        if (typeof className === 'function') {
          className = className(fieldRootState) || ''
        }
        return cn(
          baseClasses,
          className,
          // Intentionally placed after className to always have precedence.
          'data-disabled:text-muted-foreground data-disabled:pointer-events-none data-disabled:opacity-65'
        )
      }}
    />
  )
}
