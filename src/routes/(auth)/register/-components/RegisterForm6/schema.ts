import * as z from 'zod'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Note: As a general rule, using abort:true is often a bad idea.
// The goal here is to not inundate the user with too many validation
// errors for password. However, when used inside a z.object(), it ends
// up short-circuitng any outer .refine()/.superRefine() calls. Normally,
// an outer .refine() might be used for confirmPassword validation. However,
// in this case we're using TanStack Form's `onBlurListenTo` feature, so we
// can get away with this kind of Zod schema configuration.
//
// A similar argument can be made for RegisterForm3 where we're abstracting
// FormSchema -> getFormSchema() and ConfirmPasswordSchema -> getConfirmPasswordSchema().
// While that approach is somewhat verbose, it also avoids the need for an outer
// .refine(), which then permits the developer to implement abort:true as desired.
//
///////////////////////////////////////////////////////////////////////////

export const PasswordSchema = z
  .string()
  .min(1, {
    abort: true,
    error: 'Password is required'
  })
  .min(8, {
    abort: true,
    error: 'Password must be at least 8 characters long'
  })
  .max(50, {
    abort: true,
    error: 'Password must be 50 characters or fewer'
  })
  // Matches "anything that isn't a letter or digit"
  .regex(/[a-zA-Z]/, {
    error: 'Password must contain at least one letter'
  })
  .regex(/[0-9]/, { error: 'Password must contain at least one number' })
  // Matches "anything that isn't a letter or digit"
  .regex(/[^a-zA-Z0-9]/, {
    error: 'Password must contain at least one special character.'
  })

export const FormSchema = z.object({
  name: z
    .string()
    .min(1, { error: 'A name is required' })
    .max(100, { error: 'Name must be 100 characters or fewer' }),
  email: z.email(),
  password: PasswordSchema,
  confirmPassword: z.string().min(8, {
    error: 'Must be at least 8 characters long'
  })
})

export type ZodData = z.infer<typeof FormSchema>
