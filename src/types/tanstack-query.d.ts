import '@tanstack/react-query'
import type { CustomError } from '@/utils'

// https://tanstack.com/query/v5/docs/framework/react/typescript#registering-a-global-error

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: CustomError
  }
}
