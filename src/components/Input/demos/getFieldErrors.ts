/* ========================================================================

======================================================================== */

export const getFieldErrors = (fieldMeta: Record<string, unknown>): any[] => {
  const allFieldErrors: any[] = []

  Object.keys(fieldMeta).forEach((fieldName) => {
    const fieldEntry = fieldMeta[fieldName]

    if (
      fieldEntry &&
      typeof fieldEntry === 'object' &&
      'errors' in fieldEntry &&
      Array.isArray(fieldEntry.errors)
    ) {
      allFieldErrors.push(...fieldEntry.errors)
    }
  })

  return allFieldErrors.map((error) => {
    if (error && typeof error === 'object' && 'message' in error) {
      return error.message
    }
    return error
  })
}
