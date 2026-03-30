'use client'

import { InternalDropZone } from './InternalDropZone'
import type { DropZoneProps } from './types'
import { cn } from '@/utils'

export type DropzoneAPI = {
  clear: () => void
}

//# Next Steps:

//# Update <label> and error JSX to match what I'm doing in Base UI.

//# Familiarize yourself with how the previews are implemented.

//# Rewatch following videos + any new ones you can find:
//# Hamed Bahram:  https://www.youtube.com/watch?v=eGVC8UUqCBE
//# James Q Quick: https://www.youtube.com/watch?v=SBL3dhKs21o

//# Test validation styles

//# Test disabled styles.

//# Test all styles against dark theme.

//# Test non-image previews.

//# Test two-way bindings.

//# Test with file-upload-server-2026

//# Bonus: Convert demos to use Tanstack Form instead of RHF.

/* ========================================================================
                                DropZone
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// All of the styles for this component are located within formPlugin.ts
//
// Docs:          https://react-dropzone.js.org/#!/Dropzone
// Hamed Bahram:  https://www.youtube.com/watch?v=eGVC8UUqCBE
// James Q Quick: https://www.youtube.com/watch?v=SBL3dhKs21o
//
///////////////////////////////////////////////////////////////////////////

export const DropZone = ({
  acceptMessage = 'PNG and JPG files are allowed',
  apiRef,
  className = '',
  disabled,
  dropzoneOptions = {},
  error,
  formGroupClassName = '',
  formGroupStyle = {},
  id,
  inputId,
  inputName,
  label = '',
  labelClassName = '',
  labelRequired = false,
  labelStyle = {},
  style = {},
  onBlur,
  onChange,
  ref,
  showPreviews = true,
  touched,
  value = null,
  // otherProps include anything else that can be passed to the <div>.
  ...otherProps
}: DropZoneProps) => {
  /* ======================
          constants 
  ====================== */

  // disabled can be set directly as a prop (which has priority), or it can be set through dropzoneOptions
  disabled =
    typeof disabled === 'boolean'
      ? disabled
      : typeof dropzoneOptions.disabled === 'boolean'
        ? dropzoneOptions.disabled
        : false

  /* ======================
        renderLabel()
  ====================== */
  //# Add valid/invalid styles.

  const renderLabel = () => {
    const labelBaseClasses = `
      group
      flex items-center 
      leading-none select-none
      w-fit cursor-pointer
      mb-1 text-sm font-medium
      `

    if (label) {
      return (
        <label
          htmlFor={id}
          className={cn(
            labelBaseClasses,
            labelClassName,
            disabled && 'text-muted-foreground opacity-65'
          )}
          style={labelStyle}
        >
          {label}
          {labelRequired && (
            <sup
              className={cn(
                'text-destructive relative -top-0.5 text-[1.25em]'
                // 'not-group-data-validating/root:group-data-valid:not-group-data-disabled:text-success',
                // 'group-data-disabled:text-inherit'
              )}
            >
              *
            </sup>
          )}
        </label>
      )
    }
    return null
  }

  /* ======================
        renderError() 
  ====================== */

  const renderError = () => {
    if (error) {
      return <div className='text-destructive block'>{error}</div>
    }
    return null
  }

  /* ======================
          return
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // The styles here are a modified version of what's done in
  // https://horizon-ui.com/docs-tailwind/docs/react/dropzone
  // but without dark mode and responsive classes.
  // Horizon UI does not have open source code for this component.
  //
  // horizon-ui makes the top-level JSX element a button, but because in this implementation
  // there are nested buttons, I've made it a <div> because I was getting console warnings that
  // <button> cannot appear as a descendant of <button>. In any case React Dropzone already
  // bakes in the tabbing and 'Enter' behavior.
  //
  ///////////////////////////////////////////////////////////////////////////

  return (
    <section className={formGroupClassName} style={formGroupStyle}>
      {renderLabel()}

      <InternalDropZone
        acceptMessage={acceptMessage}
        apiRef={apiRef}
        className={className}
        disabled={disabled}
        dropzoneOptions={dropzoneOptions}
        error={error}
        id={id}
        inputId={inputId}
        inputName={inputName}
        style={style}
        onBlur={onBlur}
        onChange={onChange}
        ref={ref}
        showPreviews={showPreviews}
        touched={touched}
        value={value}
        {...otherProps}
      />

      {renderError()}
    </section>
  )
}
