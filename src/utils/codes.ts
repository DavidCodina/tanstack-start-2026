/** Custom error codes */
export const codes = {
  OK: 'OK',

  CREATED: 'CREATED',

  UPDATED: 'UPDATED',

  DELETED: 'DELETED',

  BAD_REQUEST: 'BAD_REQUEST',

  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',

  NOT_FOUND: 'NOT_FOUND',

  CONFLICT: 'CONFLICT',

  FORM_ERRORS: 'FORM_ERRORS',

  LOGIN_FAILED: 'LOGIN_FAILED', // Previously: INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  REGISTRATION_FAILED: 'REGISTRATION_FAILED',

  VALIDATION_ERROR: 'VALIDATION_ERROR',

  /** Use this when authentication fails. */
  UNAUTHORIZED: 'UNAUTHORIZED',

  /** Use this when authorization fails. This may be used for RBAC or when a
   * reources associated user id does not match the current user's id.
   */
  FORBIDDEN: 'FORBIDDEN',

  /** Use this when the user is ALREADY archived, not on succesfful update to arching the user. */
  USER_ARCHIVED: 'USER_ARCHIVED',

  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',

  EMAIL_UNVERIFIED: 'EMAIL_UNVERIFIED',

  EMAIL_BLACKLISTED: 'EMAIL_BLACKLISTED',

  PASSWORD_INVALID: 'PASSWORD_INVALID'
} as const
