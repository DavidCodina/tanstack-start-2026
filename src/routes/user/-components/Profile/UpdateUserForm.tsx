import * as React from 'react'
// import { useRouter } from '@tanstack/react-router'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { z } from 'zod'
import { TriangleAlert } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components'
import { Input } from '@/components/Input'
import { cn, formatZodErrors } from '@/utils'

//! This is wrong!
type UpdateUserFormProps = React.ComponentProps<'form'> & {
  currentName: string
}

/* ======================
      Zod Schema
====================== */

const FormSchema = z.object({
  name: z
    .string()
    .min(1, { error: 'A name is required' })
    .max(100, { error: 'Name must be 100 characters or fewer' })
})

type ZodData = z.infer<typeof FormSchema>
type FormErrors = Partial<Record<keyof ZodData, string>>

/* ========================================================================

======================================================================== */
// Coding in Flow at 1:42:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0
// https://github.com/codinginflow/better-auth-tutorial/blob/final-project/src/app/(main)/profile/profile-details-form.tsx
//
// WDS at 2:02:00 : https://www.youtube.com/watch?v=WPiqNDapQrk
export const UpdateUserForm = ({
  className = '',
  currentName = '',
  ...otherProps
}: UpdateUserFormProps) => {
  // const router = useRouter()

  /* ======================
        state & refs
  ====================== */

  const formActionsRef = React.useRef<Form.Actions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  const [name, setName] = React.useState(() => {
    if (currentName && typeof currentName === 'string') {
      return currentName
    }
    return ''
  })
  const [nameTouched, setNameTouched] = React.useState(false)

  const [errors, setErrors] = React.useState<FormErrors>({})
  // const isErrors = Object.keys(errors).length > 0
  const isErrors = Object.values(errors).some((value) => !!value)

  const [formPending, setFormPending] = React.useState(false)
  const [resetKey, setResetKey] = React.useState(0)

  /* ======================
        validateName()
  ====================== */

  const validateName = (value?: string): void => {
    value = typeof value === 'string' ? value : name
    const validationResult = FormSchema.shape.name.safeParse(value)

    if (validationResult.success === false) {
      const error = validationResult.error.issues[0]?.message
      if (typeof error === 'string') {
        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev,
            name: error
          }
          return newErrors
        })
      }
      return
    }

    setErrors((prev) => {
      const newErrors: FormErrors = { ...prev }
      delete newErrors.name
      return newErrors
    })
  }

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = async (zodData: ZodData) => {
    setFormPending(true)

    try {
      ///////////////////////////////////////////////////////////////////////////
      //
      // ⚠️ What we can actually update here seems pretty limited. In theory, we can
      // also update custom fields in the user record here.
      //
      // https://better-auth.com/docs/concepts/users-accounts#update-user-information
      // To update user information, you can use the updateUser function provided by the client.
      // The updateUser function takes an object with the following properties: { name, image }
      //
      // See Coding In Flow at 1:44:30 for image implementation. He implements an image preview.
      // However, all we really need is a string URL. Currently, I haven't focused much on image s.
      //
      ///////////////////////////////////////////////////////////////////////////
      const result = await authClient.updateUser({
        name: zodData.name
        // isCool: true

        //# Programming with Atiq at 1:28:55 uses upload thing:
        //# https://www.youtube.com/watch?v=roHoUhdiae4
        //# image
        // fetchOptions: {}
      })

      const { data, error } = result

      if (error) {
        toast.error('Unable to update user.')
        return
      }

      if (data) {
        // At this point, data will merely be { status: true }
        toast.success('User updated.')

        ///////////////////////////////////////////////////////////////////////////
        //
        // Note: calling authClient.updateUser() will trigger a refresh of session from
        // the authClient.useSession(). However, if the current page is displaying user
        // data derived from a server session, then one must call router.invalidate() to
        // refreh the page and prevent stale data from being displayed.
        //
        // The current implementation originally just left the state as is. However,
        // a better approach implements a useEffect() to watch for changes to user.
        //
        ///////////////////////////////////////////////////////////////////////////
        // router.invalidate()

        return
      }
    } catch (_err) {
      toast.error('Unable to update user.')
    } finally {
      setFormPending(false)
      // Not necessary since we're setting name state again in useEffect on next tick.
      // setName('')
      setNameTouched(false)
      setErrors({})
      setResetKey((v) => v + 1)
    }
  }

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    //! Don't fire on mount!
    if (currentName && typeof currentName === 'string') {
      setName(currentName) // eslint-disable-line
    }
  }, [currentName])

  /* ======================
          return
  ====================== */

  return (
    <>
      <h2 className='text-primary mb-1 text-4xl font-black'>Update User</h2>
      <Form
        {...otherProps}

        actionsRef={formActionsRef}
        className={cn(
          'bg-card space-y-4 rounded-lg border p-4 shadow',
          className
        )}
        errors={errors}
        key={resetKey}
        noValidate

        onFormSubmit={async (_formValues, _eventDetails) => {
          // Set true on all toucher functions.
          // This is important in order to subsequently allow validation onChange.
          const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [
            setNameTouched
          ]
          touchers.forEach((toucher) => {
            toucher(true)
          })

          // Validation...
          const {
            data: zodData,
            error: zodError,
            success: zodSuccess
          } = await FormSchema.safeParseAsync({
            name
          })

          if (!zodSuccess) {
            const formattedZodErrors = formatZodErrors(zodError)
            setErrors(formattedZodErrors)
            return
          }
          // Submission...
          handleSubmit(zodData)
        }}
        // I don't think this is necessary if we're using onFormSubmit.
        onSubmit={(e) => e.preventDefault()}
        ref={formRef}

        validationMode='onBlur'
      >
        <Input
          fieldRootProps={{
            // This is just to explicitly show its not depending on forceValidity.
            forceValidity: false,
            touched: nameTouched
          }}
          fieldLabelProps={{
            children: 'Full Name',
            labelRequired: true
          }}

          inputProps={{
            fieldSize: 'sm',
            name: 'fullName',
            type: 'text',
            onBlur: (e) => {
              const value = e.target.value
              setNameTouched(true)
              validateName(value)
            },
            onValueChange: (newValue) => {
              setName(newValue)
              if (nameTouched) {
                validateName(newValue)
              }
            },
            placeholder: 'Full Name...',
            value: name
          }}
        />

        {/* 
        //# Add image logic here...
       */}

        <Button
          className='flex w-full'
          disabled={isErrors}
          loading={formPending}
          size='sm'
          type='submit'
          variant={isErrors ? 'destructive' : 'primary'}
        >
          {isErrors ? (
            <>
              <TriangleAlert /> Please Correct Errors...
            </>
          ) : formPending ? (
            'Saving...'
          ) : (
            'Save Changes'
          )}
        </Button>
      </Form>
    </>
  )
}
