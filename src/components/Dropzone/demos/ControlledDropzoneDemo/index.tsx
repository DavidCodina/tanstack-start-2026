'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Dropzone } from '../../'
// import { uploadImage } from './uploadImage'
// import type { z } from 'zod'
import { Button } from '@/components'
import { sleep } from '@/utils'

/* ========================================================================
                          ControlledDropzoneDemo
======================================================================== */

export const ControlledDropzoneDemo = () => {
  const dropZoneRef = useRef<HTMLDivElement | null>(null)

  const [files, setFiles] = useState<File[] | null>(null)
  const [filesTouched, setFilesTouched] = useState(false)
  const [filesError, setFilesError] = useState('')

  const [disabled, setDisabled] = useState(false)
  const [showPreviews, setShowPreviews] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derived state
  const isErrors = filesError !== ''
  const allTouched = filesTouched

  /* ======================
      validateFiles()
  ====================== */

  const validateFiles = (value?: File[] | null) => {
    value = typeof value !== 'undefined' ? value : files
    console.log('validateFiles() called:', {
      value,
      isArray: Array.isArray(value)
    }) //! Temporary...
    let error = ''

    const validType = value === null || Array.isArray(value)
    if (!validType) {
      error = 'Invalid type'
      setFilesError(error)
      return error
    }

    if (!value || (Array.isArray(value) && value.length === 0)) {
      error = 'Required'
      setFilesError(error)
      return error
    }

    if (Array.isArray(value) && value.length > 1) {
      error = 'Only one file is allowed'
      setFilesError(error)
      return error
    }

    const isFile = value[0] instanceof File
    if (!isFile) {
      error = 'Not a file'
      setFilesError(error)
      return error
    }

    //# Also validate for file type, size, etc.

    // Otherwise unset the password error in state and return ''
    setFilesError('')
    return ''
  }

  /* ======================
        validate()
  ====================== */

  const validate = () => {
    const errors: string[] = []

    // Set true on all toucher functions.
    const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [
      setFilesTouched
    ]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: (() => string)[] = [validateFiles]

    validators.forEach((validator) => {
      const error = validator()
      if (error) {
        errors.push(error)
      }
    })

    // Return early if errors
    if (errors.length >= 1) {
      toast.error('Form validation errors found.')
      return { isValid: false, errors: errors }
    }

    return { isValid: true, errors: null }
  }

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!validate().isValid) return

    setIsSubmitting(true)

    try {
      await sleep(1000)
      toast.success('Form validation success!')
    } catch (err) {
      toast.error('Unable to submit the form!')
    } finally {
      setIsSubmitting(false)
    }
  }

  // const onSubmit: SubmitHandler<FormValues> = async (data, _e) => {
  //   // toast.success('Form validation success!')
  //   // console.log('onSubmit called.', data)

  //   // Because of the validation on data.files, we know that there will
  //   // be an image. However, Typescript doesn't know this.
  //   const image = data.files?.[0]

  //   if (!(image instanceof File)) {
  //     return
  //   }

  //   const result = await uploadImage(image)

  //   if (result.success === true) {
  //     toast.success('Image uploaded.')
  //   } else {
  //     console.log('uploadImages() response:', result)
  //     toast.error('Unable to upload image.')
  //   }
  // }

  /* ======================
      renderControls()
  ====================== */

  const renderControls = () => {
    return (
      <div className='mb-6 flex justify-center gap-4'>
        <Button
          className='min-w-[150px]'
          onClick={() => {
            setDisabled((v) => !v)
          }}
          size='sm'
        >
          disabled: {disabled ? 'true' : 'false'}
        </Button>

        <Button
          className='min-w-[150px]'
          onClick={() => {
            setShowPreviews((v) => !v)
          }}
          size='sm'
        >
          Previews: {showPreviews ? 'true' : 'false'}
        </Button>

        <Button
          className='min-w-[150px]'
          onClick={() => {
            validateFiles()
            setFiles(null)
            setFilesTouched(true)
          }}
          size='sm'
        >
          Clear Files
        </Button>

        <Button
          className='min-w-[150px]'
          onClick={() => {
            setFilesError('')
            setFiles(null)
            setFilesTouched(false)
          }}
          size='sm'
        >
          Reset Dropzone
        </Button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {renderControls()}

      <form
        className='bg-card mx-auto mb-6 max-w-[800px] rounded-lg border p-6 shadow'
        onSubmit={(e) => {
          e.preventDefault()
        }}
        noValidate
      >
        <Dropzone
          error={filesError}
          touched={filesTouched}
          labelProps={{
            children: 'Drop A File (Controlled)',
            // className: 'font-bold text-blue-500 text-sm',
            labelRequired: true
          }}
          ref={dropZoneRef}
          dropzoneOptions={{
            maxFiles: 1,

            ///////////////////////////////////////////////////////////////////////////
            //
            // While React Dropzone does expose onDropAccepted, we generally want
            // to use the custom onChange because it hooks into ALL changes to files,
            // NOT just when files are dropped. This means we can also know when files
            // has been reset to null, which would otherwise not be impossible here.
            //
            // Note: Dropping an item wil not trigger a focus event on the Dropzone. Thus, it
            // makes sense to call setFilesTouched(true) here as well.
            //
            ///////////////////////////////////////////////////////////////////////////
            onDropAccepted: (_files, _event) => {
              setFilesTouched(true)
              console.log('\nDrop Accepted:', { _files, _event }) //! Temporary...
            },

            ///////////////////////////////////////////////////////////////////////////
            //
            // The goal here is to NOT set an error when at least one file was accepted. Thus:
            //
            //   1. If files is currently null or an empty array and onDropRejected is called, then call
            //     setFilsError, setFilesTouched.
            //   2. If files is an array already, then simply notify the user with a toast that something was rejected.
            //
            ///////////////////////////////////////////////////////////////////////////

            onDropRejected: (fileRejections, _event) => {
              const message =
                fileRejections?.[0]?.errors[0]?.message ||
                'One or more files were rejected.'

              console.log('onDropRejected() called:', { message }) //! Temporary

              // In cases where one file is accepted and one rejected, files may not yet
              // reflect the accepted file. In order to ensure that files shows the
              // accepted file, wrap in setTimeout to push to bottom of stack.
              setTimeout(() => {
                if (!files || (Array.isArray(files) && files.length === 0)) {
                  // Again, wrap in setTimeout. Otherwise the default validation will have precedence.
                  setFilesError(message)
                  setFilesTouched(true)
                } else {
                  // Note: All files will be rejected if the number of files exceeds maxFiles,
                  // if a file is over/under maxSize/minSize, etc.
                  // Here I'm merely showing the first error.
                  validateFiles()
                  setFilesTouched(true)

                  toast.error(message, {
                    autoClose: 5000
                  })
                }
              }, 0)
            },

            ///////////////////////////////////////////////////////////////////////////
            //
            // https://github.com/react-dropzone/react-dropzone?tab=readme-ov-file#file-dialog-cancel-callback
            // Note: The onFileDialogCancel() cb is unstable in most browsers, meaning, there's a good chance
            // of it being triggered even though you have selected files. This can be mitigated by opting into
            // the File System Access API.
            //
            //   useFsAccessApi: true
            //
            // However, legacy browsers may still fall back to the legacy approach,
            // which could potentially lead to unexpected behavior. In practice, this means you may want to
            // completely avoid the use of the onFileDialogCancel() callback.
            //
            ///////////////////////////////////////////////////////////////////////////
            onFileDialogCancel: () => {
              console.log('onFileDialogCancel() called.') //! Temporary
              validateFiles()
              setFilesTouched(true)
            },

            disabled: disabled,

            accept: {
              'image/jpeg': ['.jpeg', '.jpg'],
              'image/png': ['.png']
              // 'image/gif': ['.gif'],
              // 'image/webp': ['.webp'],
              // 'application/json': ['.json']
            }
          }}
          acceptMessage='PNG and JPG files are allowed.'
          className='[--dropzone-preview-size:50px] [--dropzone-theme-color:var(--color-sky-500)]'
          style={{}}
          showPreviews={showPreviews}
          groupClassName='mx-auto mb-4 w-full'
          groupStyle={{}}
          id='my-dropzone'
          inputId='files'
          inputName='files'
          onBlur={(e) => {
            const currentFocusElement = document.activeElement

            if (!e.target.contains(currentFocusElement)) {
              //! Temporary...
              console.log('onBlur() called.')
              validateFiles()
              setFilesTouched(true)
            }
          }}
          onChange={(newValue: File[] | null) => {
            //! Temporary...
            console.log('onChange() called:', {
              newValue,
              type: typeof newValue,
              isArray: Array.isArray(newValue),
              filesTouched
            })

            setFiles(newValue)

            if (filesTouched) {
              validateFiles(newValue)
            }
          }}
          value={files}
        />

        {/* =====================
              Submit Button
        ===================== */}

        {allTouched && isErrors ? (
          <Button
            className='flex w-full'
            disabled={allTouched && isErrors ? true : false}
            size='sm'
            type='button'
            variant='success'
          >
            Please Fix Errors...
          </Button>
        ) : (
          <Button
            className='flex w-full'
            loading={isSubmitting}
            onClick={handleSubmit}
            size='sm'
            type='button'
            variant='success'
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </form>
    </>
  )
}
