'use client'

import './DeleteButton.css'
import type { PreviewObject } from '../types'

type DeleteButtonProps = {
  disabled: boolean
  files: File[] | null
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>
  setPreviews: React.Dispatch<React.SetStateAction<PreviewObject[] | null>>
}

/* ========================================================================

======================================================================== */
// This is the trash icon in the upper right cornder.
// It allows the user to delete the selected files.

//# Possibly switch to using a lucide icon.

export const DeleteButton = ({
  disabled,
  files,
  setFiles,
  setPreviews
}: DeleteButtonProps) => {
  /* ======================
          return
  ====================== */

  if (files && Array.isArray(files) && files.length > 0)
    return (
      <button
        className='dropzone-btn-delete'
        disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            return
          }
          e.stopPropagation()
          setFiles(null)
          setPreviews(null)
        }}
        title='Clear Files'
        type='button'
      >
        <svg width='24' height='24' fill='currentColor' viewBox='0 0 16 16'>
          <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z' />
          <path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z' />
        </svg>
      </button>
    )

  return null
}
