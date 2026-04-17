type Options = {
  noDecimal?: boolean
  noNegative?: boolean
}

/* ======================

====================== */
//# Possibly go back to FontSize and also use this instead.
//# The benefit is that undefined works better with objects that
//# potentially package up optional properties.

export const stringToNumberOrUndefined = (
  value: unknown,
  options?: Options
): number | undefined => {
  const noDecimal =
    typeof options?.noDecimal === 'boolean' ? options.noDecimal : false

  const noNegative =
    typeof options?.noNegative === 'boolean' ? options.noNegative : false

  // Already a valid number — return it directly.
  if (typeof value === 'number') {
    return isNaN(value) ? undefined : value
  }

  if (typeof value !== 'string' || !value.trim()) {
    return undefined
  }

  // Remove non-numeric characters, allowing for '.' and possibly '-'.
  const regex = noNegative ? /[^0-9.]/g : /[^0-9\-.]/g

  // parseFloat('$16') => NaN, so santize before passing to parseFloat().
  let sanitized = value.replace(regex, '')

  if (!sanitized) {
    return undefined
  }

  // Truncate value if noDecimal is true.
  // ⚠️ No attempt is made to round the potential value.
  // Instead, it's merely truncated. Thus, '.5' will ultimately return null.
  if (noDecimal === true) {
    sanitized = sanitized.split('.')[0]
    if (typeof sanitized !== 'string' || sanitized.trim() == '')
      return undefined
  }

  // parseFloat never throws — it returns NaN for unrecognizable input.
  // It also gracefully handles edge cases like '1.2.3' → 1.2 and '-+5' → NaN.
  // '1.2.3' ⚠️ parseFloat stops at 2nd . => 1.2
  // '1-2'   ⚠️ parseFloat stops at -     => 1
  // parseFloat() will also strip redundant + signs
  const parsed = parseFloat(sanitized)

  return isNaN(parsed) ? undefined : parsed
}

/* ======================

====================== */
//# Add a copy of this to global utilites.
// Usage:
// const acceptableValues = ['left', 'center', 'right'] as const
// if (isOneOf(acceptableValues, value)) { setTextAlign(value) }

export function isOneOf<T extends readonly string[]>(
  arr: T,
  v: string
): v is T[number] {
  return arr.includes(v as any)
}
