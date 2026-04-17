import * as React from 'react'
import '@tiptap/core'
import { CornerDownLeft, Plus, Ruler } from 'lucide-react'
import { Dropdown, DropdownItem } from './Dropdown'

import type { JSX } from 'react'
import type { Editor } from '@tiptap/core'
import type { MenuBarState } from './menuBarState'

type InsertDropdownProps = {
  disabled?: boolean
  editor: Editor
  editorState: MenuBarState
}

// const SELECTED_MIXIN = `
// text-white hover:text-white focus-visible:text-white
// bg-blue-500 hover:bg-blue-500 focus-visible:bg-blue-500
// border-blue-700 dark:border-blue-300
// hover:border-blue-700 dark:hover:border-blue-300
// focus-visible:border-blue-700 dark:focus-visible:border-blue-300
// focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-500/50
// shadow-xs
// `

/* ========================================================================
 
======================================================================== */

export const InsertDropdown = ({
  editor,
  // editorState,
  disabled = false
}: InsertDropdownProps): JSX.Element => {
  // For Youtube
  //# Whatever sets width/height needs to have more
  //# stringent checks, similar to FontSize.
  const [width, _setWidth] = React.useState(320)

  /* ======================
          return
  ====================== */

  return (
    <Dropdown
      disabled={disabled}
      // stopCloseOnMenuClick
      triggerProps={{
        'aria-label': 'insert options',
        children: 'Insert',
        className: '',
        icon: <Plus />,
        title: 'insert options'
      }}
    >
      <DropdownItem
        className=''
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title='horizontal rule'
      >
        <Ruler /> Horizontal Rule
      </DropdownItem>

      <DropdownItem
        className=''
        onClick={() => editor.chain().focus().setHardBreak().run()}
        title='hard break'
      >
        <CornerDownLeft /> Hard Break
      </DropdownItem>

      <DropdownItem
        className=''
        onClick={() => {
          const url = prompt('Enter YouTube URL')

          if (url) {
            editor.commands.setYoutubeVideo({
              src: url,
              width: parseInt(width.toString()) || 320,

              ///////////////////////////////////////////////////////////////////////////
              //
              // ⚠️ Gotcha:
              //
              // Object literal may only specify known properties, and 'textAlign'
              // does not exist in type 'SetYoutubeVideoOptions'.
              // Solution: assert options back onto options object:
              //
              //   const setYoutubeVideo = editor.commands.setYoutubeVideo
              //   type Options = Parameters<typeof setYoutubeVideo>[0]
              //   {} as Options
              //
              // Or create a tiptap-augmentation.d.ts file:
              //
              // import '@tiptap/core'
              //
              // declare module '@tiptap/core' {
              //   interface Commands<ReturnType> {
              //     youtube: {
              //       setYoutubeVideo: (options: {
              //         src: string
              //         width?: number
              //         height?: number
              //         start?: number
              //         textAlign?: 'left' | 'center' | 'right' | 'justify' // Added
              //       }) => ReturnType
              //     }
              //   }
              // }
              //
              // But here's the crazy part. While in many cases, it would be fine to place such a file
              // in src/types. But in this case it ONLY works if you place it directly in the project
              // root. This has to do with how the declaration merging order is happening.
              //
              // When a .d.ts is in the root, TypeScript often treats it as a "Global Augmentation" that
              // it loads before it starts resolving the specific imports inside your node_modules.
              // Conversely, when it's in src, it's processed as part of the module graph, and by the time it gets
              // there, it sees the "official" type already locked in, leading to a conflict.
              //
              // Most .d.ts augmentations you write are likely adding new properties to global objects or libraries that
              // don't have those properties yet. Tiptap is "aggressive" because it has already claimed the territory.
              // you are trying to occupy.
              //
              // In TypeScript, Interface Merging is additive.
              //
              //   - Your other files: If you augment an interface to add a property that doesn't exist (e.g., adding userRole to a Request object),
              //     TypeScript simply glues your definition onto the original. It’s a clean "1 + 1 = 2" scenario.
              //
              //   - The Tiptap Case: The @tiptap/extension-youtube package has already told TypeScript: "I am the owner of the youtube
              //     property in the Commands interface, and setYoutubeVideo only accepts these 4 specific arguments."
              //
              // The "Execution Order" of Types
              // The location of your file (root vs. src/types) changes when TypeScript sees your code relative to the library code.
              //
              //   - In the Root: TypeScript treats it like a "Global Override." It often processes these top-level ambient declarations
              //     before it dives deep into the specific import chains inside your src folder. It basically accepts your "truth" before
              //     the library has a chance to complain.
              //
              //   - In src/types: Because this folder is inside your source tree and the file contains an import statement, it is treated
              //     as a Module Augmentation. TypeScript processes it right alongside your actual code. By this point, it has already
              //     resolved import Youtube from '@tiptap/extension-youtube', so the "official" type is already locked in. When it sees
              //     your augmentation, it flags it as a "Subsequent property declaration" conflict.
              //
              // The "Dependency Loop"
              //
              //   - When your augmentation is in src/types, you are technically trying to augment @tiptap/core at the same time the
              //     Extension is trying to augment it. Since the Extension's definition is "baked into" the package you installed,
              //     the compiler gives the package priority to ensure the library's own code remains valid.
              //
              // TL;DR: place the .d.ts file in the project root.
              //
              ///////////////////////////////////////////////////////////////////////////

              textAlign: 'center'
            })
          }
        }}
        title='hard break'
      >
        <svg width='24' height='24' fill='currentColor' viewBox='0 0 16 16'>
          <path d='M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z' />
        </svg>{' '}
        Youtube
      </DropdownItem>
    </Dropdown>
  )
}
