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
            ///////////////////////////////////////////////////////////////////////////
            //
            // ⚠️ Gotcha: if the setFiles() logic in onDrop() is cumulative, then it's possible
            // to have to duplicate files, which results in two children with the same key:
            //
            //   setFiles((prevFiles) => {
            //     prevFiles = prevFiles || []
            //     return [...prevFiles, ...acceptedFiles]
            //   })
            //
            // This issue has been mitigated by deduplicating files within onDrop() as follows:
            //
            //   setFiles((prevFiles) => {
            //     prevFiles = prevFiles || []
            //     const existingKeys   = new Set(prevFiles.map((f) => `${f.name}`))
            //     const uniqueNewFiles = acceptedFiles.filter((f) => !existingKeys.has(`${f.name}`))
            //     return [...prevFiles, ...uniqueNewFiles]
            //   })
            //
            ///////////////////////////////////////////////////////////////////////////
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
