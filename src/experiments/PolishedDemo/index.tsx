// import { parseToRgb, rgb, stripUnit } from 'polished'

// Radical Red: #FD5B78 / rgb(253, 91, 120)
// console.log('parsed to RGB:', parseToRgb('rgba(253, 91, 120, 0.5)')) // => {red: 253, green: 91, blue: 120}

/* ========================================================================
                              rgbToHex()
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// We could use polished as follows:
//
//   const rgbToHex = (rgbString: string): string | undefined => {
//     try {
//       const rgbObject = parseToRgb(rgbString)
//       const hex = rgb(rgbObject)
//       return hex
//     } catch (err) {
//       console.error('Unable to convert rgb string to hext string:', err)
//       return undefined
//     }
//   }
//
//
// However, we can just build our own.
//
///////////////////////////////////////////////////////////////////////////

const isValidRGBMatch = (
  arr: RegExpMatchArray | null
): arr is [string, string, string, string] => {
  return (
    Array.isArray(arr) &&
    arr.length === 4 &&
    arr.every(
      (item, index) =>
        index === 0 || (typeof item === 'string' && /^\d+$/.test(item))
    )
  )
}

const isRgbObject = (
  obj: unknown
): obj is { r: number; g: number; b: number } => {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  const { r, g, b } = obj as { r: unknown; g: unknown; b: unknown }

  const isValid =
    typeof r === 'number' &&
    typeof g === 'number' &&
    typeof b === 'number' &&
    !isNaN(r) &&
    !isNaN(g) &&
    !isNaN(b)

  return isValid
}

export const rgbToHex = (rgbString: string): string | undefined => {
  // Extract RGB values using regex
  const rgbMatch = rgbString.match(
    /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i
  )

  if (!rgbMatch) {
    return
  }

  if (!isValidRGBMatch(rgbMatch)) {
    return
  }

  // Parse RGB values to numbers
  const rgbObject = {
    r: parseInt(rgbMatch[1], 10),
    g: parseInt(rgbMatch[2], 10),
    b: parseInt(rgbMatch[3], 10)
  }

  if (!isRgbObject(rgbObject)) {
    return
  }

  // Convert to hex
  const toHex = (value: number): string => {
    const hex = value.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(rgbObject.r)}${toHex(rgbObject.g)}${toHex(rgbObject.b)}`
}

// console.log(rgbToHex('rgb(253,91,       120)')) // => #fd5b78

/* ========================================================================
      
======================================================================== */
//^ Gotcha: I've noticed that the utilities will throw an error when they
//^ don't work. For example, trying to parse 'rgb(253,91,120' will throw.
//^ That's a little aggressive, but it also means that we need to have
//^ try/catch blocks around these utilities whenever we use them.

// Useful utilities:

// darken()
// lighten()
//
// parseToRgb() can also parse hex values to rgb: #FD5B78.
// So, it's not just picking the parts out of a string.
// It's actually doing some conversion.
// You can also pass this in 'rgba(253, 91, 120, 0.5)', and it will give you back
// an object with an alpha property.
// parseToRgb('#FD5B78') // => {red: 253, green: 91, blue: 120}
//
// rgb() takes in an rgb object like: {red: 253, green: 91, blue: 120}
// and returns a hex string '#fd5b78'.
// This means we can now create an rgbToHex function as above.
// rgb()
//
// math()

// Returns a given CSS value minus its unit of measure.
// const strippedUnit = stripUnit('10px')
// console.log({ strippedUnit, type: typeof strippedUnit }) // {strippedUnit: 10, type: 'number'}
// It's unclear under what circumstances it will return a number or a string.
// stripUnit()

export const PolishedDemo = () => {
  /* ======================
          return
  ====================== */

  return null
}
