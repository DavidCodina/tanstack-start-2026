import { Resend } from 'resend'
import { ChangeEmailConfirmationTemplate } from './ChangeEmailConfirmationTemplate'

type sendChangeEmailConfirmationArg = {
  email: string
  name: string
  // Add newEmail so that the message can indicate what the email is being changed to.
  newEmail: string
  /** The URL the user clicks in order to verify their email. This will also redirect to the application. */
  url: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

/* ========================================================================

======================================================================== */

export const sendChangeEmailConfirmation = async ({
  email,
  name,
  newEmail,
  url
}: sendChangeEmailConfirmationArg) => {
  try {
    const isDev = process.env.NODE_ENV === 'development'

    await resend.emails.send({
      from: isDev ? 'onboarding@resend.dev' : 'YOUR_PRODUCTION_DOMAIN_EMAIL', // ⚠️ In production use domain email.
      to: isDev ? ['delivered@resend.dev'] : [email], // ⚠️ In production use the actual email.
      subject: 'Change Email Confirmation',
      react: (
        <ChangeEmailConfirmationTemplate
          name={name}

          newEmail={newEmail}
          url={url}
        />
      )
    })
  } catch (_err) {
    console.log('\n\nError sending change email confirmation email.', _err)
  }
}
