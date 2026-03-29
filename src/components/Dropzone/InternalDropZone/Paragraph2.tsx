'use client'

import { Fragment } from 'react'
import './Paragraph2.css'

type Paragraph2Props = {
  acceptMessage: string
  deleteFileByName: (fileName: string) => void
  files: File[] | null
  fileNames: string[] | null
}

/* ========================================================================

======================================================================== */
// Paragraph2 will initially render with the acceptMessage prop.
// However, if there are files then for each file a button will
// be created that is used for deleting the file.

export const Paragraph2 = ({
  acceptMessage,
  deleteFileByName,
  files,
  fileNames
}: Paragraph2Props) => {
  /* ======================
          return
  ====================== */

  if (files && Array.isArray(fileNames) && fileNames.length > 0) {
    return (
      <p className='dropzone-p2'>
        {fileNames.map((name, index) => (
          <Fragment key={index}>
            <button
              className='dropzone-p2-btn'
              onClick={(e) => {
                e.stopPropagation()
                deleteFileByName(name)
              }}
              type='button'
              title='Delete Image'
            >
              {name}
            </button>
            {index !== fileNames.length - 1 ? ', ' : ''}
          </Fragment>
        ))}
      </p>
    )
  }

  return <p className='dropzone-p2'>{acceptMessage}</p>
}
