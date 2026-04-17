import '@tiptap/core'

// Overwrite node_modules/@tiptap/extension-youtube/dist/index.d.ts
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtube: {
      setYoutubeVideo: (options: {
        src: string
        width?: number
        height?: number
        start?: number
        textAlign?: 'left' | 'center' | 'right' // Added
      }) => ReturnType
    }
  }
}
