export const stringToNumber = (value: unknown): number | null => {
  // Already a valid number — return it directly.
  if (typeof value === 'number') {
    return isNaN(value) ? null : value
  }

  if (typeof value !== 'string' || !value.trim()) {
    return null
  }

  // parseFloat('$16') => NaN, so santize before passing to parseFloat().
  // Strip everything except digits, sign characters, and decimal points.
  // e.g. '$16.00' → '16.00', '-$1,234.56' → '-1234.56', '+8%' → '+8'
  const sanitized = value.replace(/[^0-9\-+.]/g, '')

  if (!sanitized) {
    return null
  }

  // parseFloat never throws — it returns NaN for unrecognizable input.
  // It also gracefully handles edge cases like '1.2.3' → 1.2 and '-+5' → NaN.
  // '1.2.3' ⚠️ parseFloat stops at 2nd . => 1.2
  // '1-2'   ⚠️ parseFloat stops at -     => 1
  const parsed = parseFloat(value)

  return isNaN(parsed) ? null : parsed
}
