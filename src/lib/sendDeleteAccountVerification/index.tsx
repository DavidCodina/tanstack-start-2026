import { Resend } from 'resend'
import { DeleteAccountVerificationTemplate } from './DeleteAccountVerificationTemplate'

type SendDeleteAccountVerificationInput = {
  email: string
  name: string
  /** The URL the user clicks in order to initiate the account deletion. */
  url: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

/* ========================================================================

======================================================================== */

export const sendDeleteAccountVerification = async ({
  email,
  name,
  url
}: SendDeleteAccountVerificationInput) => {
  try {
    const isDev = process.env.NODE_ENV === 'development'

    await resend.emails.send({
      from: isDev ? 'onboarding@resend.dev' : 'YOUR_PRODUCTION_DOMAIN_EMAIL', // ⚠️ In production use domain email.
      to: isDev ? ['delivered@resend.dev'] : [email], // ⚠️ In production use the actual email.
      subject: 'Delete Account Verification',
      react: <DeleteAccountVerificationTemplate name={name} url={url} />
    })
  } catch (_err) {
    console.log('\n\nError sending delete account verification email.', _err)
  }
}
