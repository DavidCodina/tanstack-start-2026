import { Field } from '@base-ui/react/field'
import { cn } from '@/utils'

export type FieldLabelProps = Field.Label.Props & {
  labelRequired?: boolean
}

// ⚠️ Be careful if adding additional styles. This component is used
// by several other Base UI components.
const baseClasses = `
group
flex items-center 
leading-none select-none
w-fit cursor-pointer
`

/* ========================================================================

======================================================================== */
//# Possibly add srOnly prop...

export const FieldLabel = ({
  children,
  className,
  labelRequired = false,
  ...otherProps
}: FieldLabelProps) => {
  /* ======================
          return
  ====================== */

  if (!children) {
    return null
  }

  return (
    <Field.Label
      data-slot='field-label'
      className={(fieldLabelState) => {
        if (typeof className === 'function') {
          className = className(fieldLabelState) || ''
        }

        return cn(
          baseClasses,
          className,
          // Intentionally placed after className to always have precedence.
          'not-group-data-validating/root:data-invalid:not-data-disabled:text-destructive',
          'not-group-data-validating/root:data-valid:not-data-disabled:text-success',
          // data-disabled:pointer-events-none not needed. Base UI seeems to handle this already.
          'data-disabled:text-muted-foreground data-disabled:opacity-65'
        )
      }}
      {...otherProps}
    >
      {/* This span ensures that the <sup> comes at the end of the label text,
      even when in a 'flex flex-wrap' FieldRoot. */}
      <span>
        {children}
        {labelRequired && (
          <sup
            className={cn(
              'text-destructive relative -top-0.5 text-[1.25em]',
              'not-group-data-validating/root:group-data-valid:not-group-data-disabled:text-success',
              'group-data-disabled:text-inherit'
            )}
          >
            *
          </sup>
        )}
      </span>
    </Field.Label>
  )
}
