'use client'

import { Preview } from './Preview'
import type { PreviewProps } from '../types'

const baseClasses = `flex items-center flex-wrap gap-4 justify-center`

/* ========================================================================

======================================================================== */

export const Previews = ({
  disabled = false,
  previews,
  deleteFileByName
}: PreviewProps) => {
  /* ======================
          return
  ====================== */

  return (
    Array.isArray(previews) &&
    previews.length > 0 && (
      <div className={baseClasses}>
        {previews.map((preview) => (
          <Preview
            key={preview.name}
            deleteFileByName={deleteFileByName}
            disabled={disabled}
            preview={preview}
          />
        ))}
      </div>
    )
  )
}
