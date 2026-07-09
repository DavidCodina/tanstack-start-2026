import { Resend } from 'resend'
import { ResetPasswordTemplate } from './ResetPasswordTemplate'

type SendResetPasswordEmailArg = {
  email: string
  name: string
  url: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Documenation                 : https://better-auth.com/docs/authentication/email-password#request-password-reset
// ✅ Coding In Flow at 1:08:00 : https://www.youtube.com/watch?v=w5Emwt3nuV0
// ✅ WDS at 1:28:50            : https://www.youtube.com/watch?v=WPiqNDapQrk
// ✅ OrcDev                    : https://www.youtube.com/watch?v=dZpHdVkKYcs
// Cand Dev at 36:00            : https://www.youtube.com/watch?v=829nKH5FmCs
//
///////////////////////////////////////////////////////////////////////////

export const sendResetPasswordEmail = async ({
  email,
  name,
  url
}: SendResetPasswordEmailArg) => {
  try {
    const isDev = process.env.NODE_ENV === 'development'

    await resend.emails.send({
      from: isDev ? 'onboarding@resend.dev' : 'YOUR_PRODUCTION_DOMAIN_EMAIL', // ⚠️ In production use domain email.
      to: isDev ? ['delivered@resend.dev'] : [email], // ⚠️ In production use the actual email.
      subject: 'Password Reset',
      react: <ResetPasswordTemplate name={name} url={url} />
    })
  } catch (_err) {
    // console.log('\n\nError sending password reset email.', _err)
  }
}
