import type { ComponentPropsWithRef, MutableRefObject } from 'react'
import type { DropzoneOptions } from 'react-dropzone'

export type DropzoneRef = HTMLDivElement

export type PreviewObject = { name: string; readerResult: string }

export type OnDrop = NonNullable<DropzoneOptions['onDrop']>
// type OnDrop2 = Exclude<DropzoneOptions['onDrop'], undefined>
// type OnDrop3 = Exclude<Pick<DropzoneOptions, 'onDrop'>, undefined>

type InternalRef = React.RefObject<HTMLDivElement | null>

export type DropzoneBaseProps = Omit<
  ComponentPropsWithRef<'div'>,
  'onChange'
> & {
  apiRef?: MutableRefObject<unknown>
  acceptMessage?: string
  disabled?: boolean
  dropzoneOptions?: DropzoneOptions
  error?: string
  inputId?: string
  inputName?: string
  internalRef: InternalRef
  onChange?: (newValue: File[] | null) => void
  showPreviews?: boolean
  touched?: boolean
  value?: File[] | null
}

export type DropzoneLabelProps = React.ComponentProps<'label'> & {
  disabled: boolean // Used internally
  internalRef: InternalRef
  error: string // Used internally
  labelRequired?: boolean
  touched: boolean // Used internally
}

export type DropzoneErrorProps = React.ComponentProps<'div'> & {
  disabled: boolean // Used internally
  error: string // Used internally
  touched: boolean // Used internally
}

export type DropzoneProps = Omit<DropzoneBaseProps, 'internalRef'> & {
  groupClassName?: string
  groupStyle?: React.CSSProperties
  labelProps?: Omit<
    DropzoneLabelProps,
    'disabled' | 'internalRef' | 'error' | 'touched'
  >
  errorProps?: Omit<
    DropzoneErrorProps,
    'children' | 'disabled' | 'error' | 'touched'
  >
}

export interface PreviewProps {
  deleteFileByName: (fileName: string) => void
  disabled: boolean
  previews: PreviewObject[] | null
}
