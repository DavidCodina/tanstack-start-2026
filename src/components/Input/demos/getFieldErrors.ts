/* ========================================================================

======================================================================== */

export const getFieldErrors = (fieldMeta: Record<string, unknown>): any[] => {
  const allFieldErrors: any[] = []

  Object.keys(fieldMeta).forEach((fieldName) => {
    const fieldData = fieldMeta[fieldName]

    if (
      fieldData &&
      typeof fieldData === 'object' &&
      'errors' in fieldData &&
      Array.isArray(fieldData.errors)
    ) {
      allFieldErrors.push(...fieldData.errors)
    }
  })

  return allFieldErrors.map((error) => {
    if (error && typeof error === 'object' && 'message' in error) {
      return error.message
    }
    return error
  })
}
