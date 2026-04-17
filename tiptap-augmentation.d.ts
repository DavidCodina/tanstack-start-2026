import '@tiptap/core'

// Overwrite node_modules/@tiptap/extension-youtube/dist/index.d.ts
// Because of the way tiptap integrates extensions in conjunction with
// the "Execution Order" of types in TypeScript, it's crucial that this
// file be in the project root, and NOT src/types.
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
