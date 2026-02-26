import * as React from 'react'
import { createFormHookContexts, useStore } from '@tanstack/react-form-start'
import { Input } from '../.'
import type { InputProps } from '../.'
import type { FieldRootActions } from '@base-ui/react'
import type { ButtonProps } from '@/components'
import { Button } from '@/components'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

/* ========================================================================

======================================================================== */
//# Review Dev Leonardo here:
//# https://www.youtube.com/watch?v=YJ3rW85fnKo&list=PLOQjd5dsGSxInTKUWTxyqSKwZCjDIUs0Y&index=8

type LimitedButtonProps = Omit<ButtonProps, 'loading' | 'type'>

export const SubmitButton = ({
  children,
  ...otherProps
}: LimitedButtonProps) => {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button loading={isSubmitting} {...otherProps} type='submit'>
          {children}
        </Button>
      )}
    </form.Subscribe>
  )
}

/* ========================================================================

======================================================================== */

type LimitedFieldRootProps = Omit<
  NonNullable<InputProps['fieldRootProps']>,
  'dirty' | 'invalid' | 'name' | 'touched' | 'validate' | 'validationMode'
>

type LimitedInputProps = Omit<NonNullable<InputProps['inputProps']>, 'value'>

export type TanstackInputProps = Omit<
  InputProps,
  'fieldRootProps' | 'inputProps'
> & {
  fieldRootProps?: LimitedFieldRootProps
  inputProps?: LimitedInputProps
}

export function TanStackInput({
  fieldRootProps = {},
  inputProps = {},
  fieldLabelProps = {},
  fieldErrorProps = {},
  fieldDescriptionProps = {}
}: TanstackInputProps) {
  const actionsRef = React.useRef<FieldRootActions>(null)
  const field = useFieldContext<string>()

  // const isPristine = field.form.state.isPristine
  const isSubmitting = field.form.state.isSubmitting
  //! Why are we doing this:
  //! Why not just do:
  //! const errors = field.state.meta.errors
  const errors = useStore(field.store, (state) => state.meta.errors)
  const isErrors = errors.length > 0
  // const _isValid = field.state.meta.isValid
  // const _isTouched = field.state.meta.isTouched
  // const _isValidating = field.form.state.isValidating
  // const _isSubmitted = field.form.state.isSubmitted

  const isBlurred = field.state.meta.isBlurred
  const isDirty = field.state.meta.isDirty
  const submissionAttempts = field.form.state.submissionAttempts
  const hasSubmitted = submissionAttempts > 0
  const isInvalid =
    isBlurred || hasSubmitted ? (isErrors ? true : false) : undefined

  /* ======================
        useEffect()
  ====================== */
  // ⚠️ Gotcha: To actually get valid styles on first blur, we need to make sure that
  // fieldRootProps.validationMode: 'onBlur' to match the validators: { onBlur: schema }.
  // In order to get green validation styles on submit, you need to use <Form />.
  // Alternatively, you can hack the field by calling actionsRef.current.validate().

  React.useEffect(() => {
    const actions = actionsRef.current
    if (!isSubmitting || !actions) return
    actions.validate()
  }, [isSubmitting])

  const { onBlur, onChange, ...otherInputProps } = inputProps

  /* ======================
          return
  ====================== */

  return (
    <Input
      fieldRootProps={{
        ...fieldRootProps,
        actionsRef: actionsRef,
        name: field.name,
        // The annoying thing about Base UI is that it doesn't expose
        // a way to clear the field of it's data-attributes. Currently,
        // you MUST implement key={resetKey} on <form>.
        invalid: isInvalid,
        validationMode: 'onBlur',
        // Syncing dirty and touched becomes very important
        // when calling Tanstack Form's form.reset()
        dirty: isDirty,
        // touched in Tanstack Form is as soon as you type a single character,
        // but what we want is when the input blurs.
        touched: isBlurred
      }}
      inputProps={{
        ...otherInputProps,
        value: field.state.value,

        onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
          onChange?.(e as any)
          field.handleChange(e.target.value)

          ///////////////////////////////////////////////////////////////////////////
          //
          // Add onChange validation manually, rather than in form validators
          // validators: {onChange: schema }
          // Why? Because adding two validators creates duplicate errors
          //
          // Here we specify 'blur' because in the validators we use onBlur: schema
          // TheV alidationCause must match a key in the validators object.
          //
          ///////////////////////////////////////////////////////////////////////////

          if (isBlurred) {
            await field.validate('blur')
          }
        },
        onBlur: async (e) => {
          onBlur?.(e as any)
          field.handleBlur()
        }
      }}
      fieldLabelProps={fieldLabelProps}
      fieldDescriptionProps={fieldDescriptionProps}
      fieldErrorProps={{
        ...fieldErrorProps,
        children: isInvalid
          ? errors
              .filter(Boolean)
              .map((error) =>
                typeof error === 'string' ? error : error.message
              )
              .join(', ')
          : undefined
      }}
    />
  )
}
