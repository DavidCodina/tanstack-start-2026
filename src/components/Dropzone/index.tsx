'use client'

import { useId } from 'react'

import { DropzoneBase } from './DropzoneBase'
import { DropzoneError } from './DropzoneError'
import { DropzoneLabel } from './DropzoneLabel'

import type { DropzoneProps } from './types'

export type DropzoneAPI = {
  clear: () => void
}

//# Next Steps:

//# Familiarize yourself with how the previews are implemented.

//# Rewatch following videos + any new ones you can find:
//# Hamed Bahram:  https://www.youtube.com/watch?v=eGVC8UUqCBE
//# James Q Quick: https://www.youtube.com/watch?v=SBL3dhKs21o

//# Test validation styles

//# Test disabled styles.

//# Test all styles against dark theme.

//# Test non-image previews.

//# Test two-way bindings.

//# Controlled Demo seems broken when you click submit with nothing.

//# Test with file-upload-server-2026

//# Update to v15

//# Bonus: Convert demos to use Tanstack Form instead of RHF.

//# Bonus: If you wanted to go all in on Base UI, you could
//# integrate with Field.Root, Field.Label, Field.Error, and Field.Description.

/* ========================================================================
                                Dropzone
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

export const Dropzone = ({
  acceptMessage = 'PNG and JPG files are allowed',
  apiRef,
  className = '',
  disabled,
  dropzoneOptions = {},
  error = '',
  groupClassName = '',
  groupStyle = {},
  id,
  inputId,
  inputName,
  style = {},
  onBlur,
  onChange,
  ref,
  showPreviews = true,
  touched = false,
  value = null,
  labelProps = {},
  errorProps = {},
  // otherProps include anything else that can be passed to the <div>.
  ...otherProps
}: DropzoneProps) => {
  /* ======================
          constants 
  ====================== */

  // Done here, rather than in DropzoneBase, so it can be passed to DropzoneLabel.
  const fileInputId = useId()
  inputId = inputId || fileInputId

  // disabled can be set directly as a prop (which has priority), or it can be set through dropzoneOptions
  disabled =
    typeof disabled === 'boolean'
      ? disabled
      : typeof dropzoneOptions.disabled === 'boolean'
        ? dropzoneOptions.disabled
        : false

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
    <section className={groupClassName} style={groupStyle}>
      <DropzoneLabel
        htmlFor={inputId}
        {...labelProps}
        disabled={disabled}
        error={error}
        touched={touched}
      />

      <DropzoneBase
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

      <DropzoneError
        {...errorProps}
        children={error}
        disabled={disabled}
        error={error}
        touched={touched}
      />
    </section>
  )
}
