// import * as React from 'react'

import {
  Body,
  // Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  // Tailwind, // 👈🏻👈🏻👈🏻
  Text
} from '@react-email/components'

type DeleteAccountVerificationTemplateProps = {
  name: string
  url: string
}

/* ======================

====================== */

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px'
}

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0'
}

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149'
}

const buttonContainer = {
  padding: '27px 0 27px'
}

const reportLink = {
  fontSize: '14px',
  color: '#b4becc'
}

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px'
}

/* ========================================================================

======================================================================== */

export const DeleteAccountVerificationTemplate = ({
  name,
  url
}: DeleteAccountVerificationTemplateProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Verify Account Deletion</Preview>
        <Container style={container}>
          <Heading style={heading}>Hi {name}!</Heading>
          <Section style={buttonContainer}></Section>
          <Text style={paragraph}>
            Please click the button below to verify you want to delete your
            account.
          </Text>
          <Hr style={hr} />

          <Link href={url} style={reportLink}>
            Click Here To Confirm Account Deletion
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
