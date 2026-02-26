import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field'
import { InputPrimitive } from '../Input/InputPrimitive'

import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps
} from '../Field'
import type { InputPrimitiveProps } from '../Input/InputPrimitive'

import { cn } from '@/utils'

export type InputProps = {
  fieldRootProps?: FieldRootProps
  fieldLabelProps?: FieldLabelProps
  inputProps?: InputPrimitiveProps
  fieldErrorProps?: FieldErrorProps
  fieldDescriptionProps?: FieldDescriptionProps
}

/* ========================================================================

======================================================================== */

export const InputPassword = ({
  fieldRootProps = {},
  inputProps = {},
  fieldLabelProps = {},
  fieldErrorProps = {},
  fieldDescriptionProps = {}
}: InputProps) => {
  const [inputType, setInputType] = React.useState<'password' | 'text'>(
    'password'
  )

  /* ======================
  renderInputWithPasswordToggle()
  ====================== */

  const renderInputWithPasswordToggle = () => {
    return (
      <div className='relative'>
        <InputPrimitive
          ///////////////////////////////////////////////////////////////////////////
          //
          // In practce, this should tell browsers:
          //
          //   - Don't store this value in autocomplete history
          //   - Don't suggest previously entered values
          //   - Treat this as sensitive password data (even when type="text")
          //
          ///////////////////////////////////////////////////////////////////////////
          autoComplete='new-password'
          {...inputProps}
          type={inputType}
        />

        <button
          className={cn(
            'text-muted-foreground absolute top-1/2 right-px flex aspect-square h-[calc(100%-2px)] -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-[0.375em] p-[0.25em]',
            'not-group-data-validating/root:not-group-data-disabled/root:group-data-valid/root:text-success',
            'not-group-data-validating/root:not-group-data-disabled/root:group-data-invalid/root:text-destructive',
            'group-data-disabled/root:text-neutral-400'
          )}
          onClick={() => {
            setInputType((previousValue) => {
              if (previousValue === 'password') {
                return 'text'
              }
              return 'password'
            })
          }}
          title='Toggle Password'
          type='button'
        >
          {inputType === 'password' ? (
            <Eye />
          ) : (
            <EyeOff className='h-full w-full' />
          )}
          <span className='sr-only'>
            {inputType === 'password' ? 'Show' : 'Hide'}
          </span>
        </button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <FieldRoot {...fieldRootProps}>
      <FieldLabel
        {...fieldLabelProps}
        className={(fieldLabelState) => {
          if (typeof fieldLabelProps.className === 'function') {
            fieldLabelProps.className =
              fieldLabelProps.className(fieldLabelState) || ''
          }
          return cn(
            'mb-1 text-sm leading-none font-medium',
            fieldLabelProps.className
          )
        }}
      />

      {renderInputWithPasswordToggle()}

      <FieldDescription {...fieldDescriptionProps} />
      <FieldError {...fieldErrorProps} />
    </FieldRoot>
  )
}
