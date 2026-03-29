'use client'

import './Paragraph1.css'

type Paragraph1Props = {
  isDragActive: boolean
  files: File[] | null
}

/* ========================================================================

======================================================================== */
// Paragraph1 is the main paragraph underneath the upload <svg>.
// It will render in one of three ways depending on whether or not
// there are files and/or isDragActive.

export const Paragraph1 = ({ isDragActive, files }: Paragraph1Props) => {
  /* ======================
    renderParagraph1() 
  ====================== */

  const renderParagraph1 = () => {
    if (isDragActive) {
      return <p className='dropzone-p1'>Drop it like it's hot!</p>
    }

    if (files && Array.isArray(files) && files.length > 0) {
      return <p className='dropzone-p1'>Selected files:</p>
    } else {
      return (
        <p className='dropzone-p1'>
          Drop your files here, or{' '}
          <span className='dropzone-p1-span'>browse</span>
        </p>
      )
    }
  }

  /* ======================
          return
  ====================== */

  return renderParagraph1()
}
