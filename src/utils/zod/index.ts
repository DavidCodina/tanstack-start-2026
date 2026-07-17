import { isJSON } from '../isJSON'
import type { z } from 'zod'

/* ======================
      isZodIssues()
====================== */

type ZodIssues = z.ZodError['issues']

///////////////////////////////////////////////////////////////////////////
//
// The three properties that are always present on every ZodIssue are:
//
//   - code    (string)
//   - message (string)
//   - path    ((string | number)[])
//
// Other properties like inclusive, minimum, origin, etc. appear conditionally.
//
///////////////////////////////////////////////////////////////////////////

export const isZodIssues = (value: unknown): value is ZodIssues => {
  // Must be an array
  if (!Array.isArray(value)) {
    return false
  }

  // Empty arrays aren't valid Zod issues arrays
  if (value.length === 0) {
    return false
  }

  // Check if every element looks like a ZodIssue
  return value.every((item) => {
    // Must be an object
    if (typeof item !== 'object' || item === null) {
      return false
    }

    const issue = item as Record<string, unknown>

    // Required properties that every ZodIssue has
    return (
      typeof issue.code === 'string' &&
      Array.isArray(issue.path) &&
      typeof issue.message === 'string'
    )
  })
}

/* ======================
    formatZodIssues()
====================== */

export const formatZodIssues = (issues: ZodIssues) => {
  const errorsMap: Record<string, string[]> = {}

  for (const issue of issues) {
    if (issue?.path?.length) {
      ///////////////////////////////////////////////////////////////////////////
      //
      // In most cases, Zod will short circuit when it encounters an error.
      // For example, z.string().min(5) will not return an two errors if
      // it's not a string.
      //
      // However, there are also cases where Zod will return multiple issues.
      //
      //   const FormSchema = z.object({
      //     firstName: z.string()
      //       .min(5, 'First name must be at least five characters')
      //       .regex(/^[A-Za-z\s'-]+$/, 'First name can only contain letters'), // 👈🏻👈🏻👈🏻 Potential multiple issues.
      //
      //     address: z.object({
      //       city: z.string().min(1, 'A city is required.'),
      //       zip: z.string().min(1, 'A zip is required.')
      //     }),
      //     hobbies: z.array(z.string())
      //   })
      //
      //   const result = FormSchema.safeParse({
      //     firstName: '1',
      //     address: { city: 'Georgetown', zip: null },
      //     hobbies: ['Programming']
      //   })
      //
      //   if (result.success === false) {
      //     const formattedZodErrors = formatZodErrors(result.error)
      //     console.log('Issues:', result.error.issues)
      //     console.log('formattedZodErrors:', formattedZodErrors)
      //   } else {
      //     console.log('Form is valid!')
      //   }
      //
      // An error that occurred in a nested object with be concatenated
      // with dot notation such that [ 'address', 'zip' ] => 'address.zip'.
      // Similarly, if an error occurred in an element index 1 of myArray,
      // ['myArray', 1] => 'myArray.1'.
      //
      ///////////////////////////////////////////////////////////////////////////
      const key = issue.path.join('.')
      if (!errorsMap[key]) {
        errorsMap[key] = []
      }
      errorsMap[key].push(issue.message)
    }
  }

  const errors: Record<string, string> = {}

  // Alternative syntax:
  //for (const [key, messages] of Object.entries(errorsMap)) {  errors[key] = messages.join(', ') }
  for (const key in errorsMap) {
    if (Object.hasOwn(errorsMap, key)) {
      errors[key] = errorsMap[key].join(', ')
    }
  }

  return errors
}

/* ======================
getSerializedZodErrors()
====================== */
// This utility is specifically for checking for Zod issues
// that have been serialized into the error.message by
// Tanstack Start from within a server function .inputValidator().
// Use this utility from within a catch block when consuming a
// server function on the client.

export const getSerializedZodErrors = (err: unknown) => {
  if (!(err instanceof Error)) {
    return null
  }

  // Try to parse the message as JSON (it contains the ZodError issues)
  // If it is a normal string, JSON.parse will throw an error.
  if (!isJSON(err.message)) {
    return null
  }

  try {
    const parsedValue = JSON.parse(err.message)

    if (isZodIssues(parsedValue)) {
      const formattedIssues = formatZodIssues(parsedValue)
      return formattedIssues
    }
    return null
  } catch {
    return null
  }
}

/* ======================
    formatZodErrors()
====================== */
// This function is NOT for deserializating Zod errors.
// This function takes in a ZodError and returns a dictionary
// object of errors.

export const formatZodErrors = (error: z.ZodError) => {
  const issues = error.issues
  const errors = formatZodIssues(issues)
  return errors
}
