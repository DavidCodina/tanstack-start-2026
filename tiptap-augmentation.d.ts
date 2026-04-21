import '@tiptap/core'

import type { SetImageOptions } from '@tiptap/extension-image'

type CustomSetImageOptions = SetImageOptions & {
  align?: 'left' | 'center' | 'right'
}

type CustomSetYoutubeVideoOptions = {
  src: string
  width?: number
  height?: number
  start?: number
  justifyContent?: string // Added
}

// Because of the way tiptap integrates extensions in conjunction with
// the "Execution Order" of types in TypeScript, it's crucial that this
// file be in the project root, and NOT src/types.
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    'custom-image': {
      setCustomImage: (options: CustomSetImageOptions) => ReturnType
    }

    'custom-youtube': {
      setCustomYoutubeVideo: (
        options: CustomSetYoutubeVideoOptions
      ) => ReturnType
    }
  }
}
