import { createContext, use, useEffect } from 'react'

import { useEditor, useEditorState } from '@tiptap/react'

///////////////////////////////////////////////////////////////////////////
//
// https://tiptap.dev/docs/editor/extensions/functionality/starterkit
// The starter kit is a collection of essential editor extensions.
// It’s a good starting point for building your own editor.
// StarterKit is more minimal than many people expect. Here's what it actually includes:
//
//   - Nodes: Blockquote, BulletList, CodeBlock, Document, HardBreak, Heading, HorizontalRule, ListItem, OrderedList, Paragraph, Text
//#    How is Text different from Paragraph?
//#    What is Document?
//
//   - Marks: Bold, Code, Italic, Link (New in v3), Strike, Underline (New in v3)
//
//   - Extensions: Dropcursor, Gapcursor, Undo/Redo, ListKeymap (New in v3), TrailingNode (New in v3)
//#    Review all of these.
//
// So notably absent are TextAlign, Link, Image, Table, TaskList — and many others.
// It's intentionally lean so you only bundle what you need.
//
///////////////////////////////////////////////////////////////////////////

import StarterKit from '@tiptap/starter-kit'

// https://tiptap.dev/docs/editor/extensions/marks/highlight
import Highlight from '@tiptap/extension-highlight'

// https://tiptap.dev/docs/editor/extensions/marks/superscript
import Superscript from '@tiptap/extension-superscript'

// https://tiptap.dev/docs/editor/extensions/marks/subscript
import Subscript from '@tiptap/extension-subscript'

// https://tiptap.dev/docs/editor/extensions/functionality/textalign
import TextAlign from '@tiptap/extension-text-align'

// https://tiptap.dev/docs/editor/extensions/functionality/placeholder
import { Placeholder } from '@tiptap/extensions'

// https://tiptap.dev/docs/editor/extensions/marks/text-style
import { TextStyleKit } from '@tiptap/extension-text-style'

// https://tiptap.dev/docs/editor/extensions/nodes/task-list
import { TaskItem, TaskList } from '@tiptap/extension-list'

import Emoji /* , { emojis } */ from '@tiptap/extension-emoji'

// https://tiptap.dev/docs/editor/extensions/nodes/image
import { CustomImage } from './extensions/CustomImage'

// https://tiptap.dev/docs/editor/extensions/nodes/youtube
import { CustomYoutube } from './extensions/CustomYoutube'

// import CharacterCount from '@tiptap/extension-character-count'
// import Table from '@tiptap/extension-table'
// import TableRow from '@tiptap/extension-table-row'
// import TableHeader from '@tiptap/extension-table-header'
// import TableCell from '@tiptap/extension-table-cell'
// import TaskList from '@tiptap/extension-task-list'
// import TaskItem from '@tiptap/extension-task-item'

import { menuBarSelector } from './menuBarState'
import { Indent } from './extensions/Indent'
import { suggestion } from './suggestion'

import type {
  DocumentType,
  Editor,
  MarkType,
  NodeType,
  TextType
} from '@tiptap/core'
// import type { DocumentType, MarkType, NodeType, TextType } from '@tiptap/react'
// import type { UseEditorOptions } from '@tiptap/react'

import type { MenuBarState } from './menuBarState'

type TiptapContextValue = {
  editor: Editor | null
  editorState: MenuBarState
}

/** A limited number of options passed into the useEditor configuration. */
type EditorProps = {
  content?: string
  placeholder?: string
}

type Value = {
  html: string
  json: DocumentType<
    Record<string, any> | undefined,
    NodeType<
      string,
      Record<string, any> | undefined,
      any,
      (NodeType<any, any, any, any> | TextType<MarkType<any, any>>)[]
    >[]
  >
  text: string
}
type OnChange = (value: Value) => void

export type TiptapProviderProps = {
  editorProps?: EditorProps
  onChange?: OnChange
}

const TiptapContext = createContext<TiptapContextValue | null>(null)

/* ========================================================================
             
======================================================================== */

export function TiptapProvider({
  children,
  editorProps = {},
  disabled = false,
  onChange
}: TiptapProviderProps & { children: React.ReactNode; disabled?: boolean }) {
  const editor = useEditor({
    // Avoid Error: Tiptap Error: SSR has been detected, please set `immediatelyRender`
    // explicitly to `false` to avoid hydration mismatches.
    // Note: This will cause the value of editor to now be Editor | null.
    immediatelyRender: false,
    // shouldRerenderOnTransaction: false,
    content: editorProps?.content,
    // ⚠️ false doesn't seem to make a difference.
    //# What is the way to programmatically change this later?
    //# What exactly does it do?
    editable: true, // On mount only.
    ///////////////////////////////////////////////////////////////////////////
    //
    //! I'm not sure if this is actually true, or at least it doesn't seem to
    //! opt out of the styles at node_modules/@tiptap/core/src/style.ts
    //
    // AI: As of Tiptap v3, injectCSS: true no longer injects ProseMirror
    // base styles automatically GitHub, so if you're on v3 you'll also need
    // to manually import ProseMirror's own base CSS (from the prosemirror-view package) separately.
    //
    ///////////////////////////////////////////////////////////////////////////
    // injectCSS: false,

    extensions: [
      //# What is the Document extension? It's already part of StarterKit, but what does it do?
      TextStyleKit, // This already includes Color, BackgroundColor, FontSize, LineHeight, etc.

      // ⚠️ Note you can also do this kind of thing.
      // StarterKit.configure({
      //   italic: false,  // Disable an included extension.
      //   heading: { levels: [1, 2] } // Configure an included extension.
      // })

      // See here for an example of configuring StarterKit:
      // https://github.com/phyohtetarkar/tiptap-block-editor/blob/main/src/components/editor/default-extensions.ts
      StarterKit.configure({
        // ⚠️ Rather than using Tiptap.css to style the elements, one cal also hardcode them directy into the HTML.
        // paragraph: {
        //   HTMLAttributes: {
        //     class: 'outline-2 outline-dashed outline-pink-500'
        //   }
        // },
        link: {
          // By default, clicking a link in the editor navigates to it. Since this is a rich text editor,
          // you almost certainly want this off — otherwise you can't click a link to edit it without
          // using keyboard navigation.
          //# But how does it disable the link in practice and will it work outside of the editor?
          openOnClick: false,

          // ⚠️ autolink: false only disables the as-you-type detection.
          // However, one needs press ENTER or Space immediately after the link.
          autolink: true, // 'google.com' => <a href="https://google.com">google.com</a>

          // ⚠️ https://github.com/ueberdosis/tiptap/issues/4414
          // Setting it to false doesn't really work.
          linkOnPaste: true, // Default: true

          // If enabled, clicking on a link will select the link.
          enableClickSelection: false, // Default: false

          // ⚠️ defaultProtocol not being respected is a known bug.
          defaultProtocol: 'https', // Default: 'http'
          protocols: ['http', 'https'],

          HTMLAttributes: {
            // class: 'my-custom-class',
          }

          //# Review
          // isAllowedUri: (url, ctx) => {
          //   try {
          //     const parsedUrl = url.includes(':')
          //       ? new URL(url)
          //       : new URL(`${ctx.defaultProtocol}://${url}`)

          //     // Run built-in validation first
          //     if (!ctx.defaultValidate(parsedUrl.href)) return false

          //     // Block unwanted protocols
          //     const disallowedProtocols = ['ftp', 'file', 'mailto']
          //     const protocol = parsedUrl.protocol.replace(':', '')
          //     if (disallowedProtocols.includes(protocol)) return false

          //     // Only allow protocols in ctx.protocols
          //     const allowedProtocols = ctx.protocols.map((p) =>
          //       typeof p === 'string' ? p : p.scheme
          //     )
          //     if (!allowedProtocols.includes(protocol)) return false

          //     return true
          //   } catch {
          //     return false
          //   }
          // },

          //# Review
          // shouldAutoLink: (url) => {
          //   try {
          //     const parsedUrl = url.includes(':')
          //       ? new URL(url)
          //       : new URL(`https://${url}`)

          //     const disallowedDomains = ['example-no-autolink.com']
          //     return !disallowedDomains.includes(parsedUrl.hostname)
          //   } catch {
          //     return false
          //   }
          // }
        }
      }),

      Placeholder.configure({
        placeholder: editorProps?.placeholder
        // emptyEditorClass: 'is-editor-empty', // default
        // emptyNodeClass: 'is-empty' // default
        // dataAttribute: 'placeholder' // default => data-placeholder="Write something..."

        // showOnlyWhenEditable: true, // default
        // Use different placeholders depending on the node type:
        // placeholder: ({ node }) => {
        //   if (node.type.name === 'heading') {
        //     return 'What’s the title?'
        //   }

        //   return 'Can you add some further context?'
        // },
      }),

      Superscript,
      Subscript,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Highlight,
      Indent.configure({
        // No need to add bulletList, orderedList since indentation occurs on the listItem.
        // By default, indent.ts only does:  [ 'paragraph', 'listItem'],
        types: ['paragraph', 'listItem', 'heading', 'codeBlock', 'blockquote'], // heading, codeBlock, blockquote
        minLevel: 0,
        maxLevel: 8
      }),

      TaskList,
      TaskItem.configure({
        nested: true
      }),
      Emoji.configure({
        enableEmoticons: true,
        // ⚠️ There seems to be a TanStack Start-specific issue with how the suggestion plugin detects
        // query changes. The suggestion is being triggered and immediately dismissed. The issue is
        // that the suggestion is exiting immediately. This happens in Tanstack Start because of how
        // it handles DOM updates.
        suggestion: suggestion
      }),

      ///////////////////////////////////////////////////////////////////////////
      //
      // ⚠️ Gotcha:
      // If we enable resizing:
      //
      //   resize: {
      //     enabled: true,
      //     directions: ['top', 'bottom', 'left', 'right'],
      //     // minWidth: 50,
      //     // minHeight: 50,
      //     alwaysPreserveAspectRatio: true
      //   }
      //
      //  It creates two wrapper divs in the editor:
      //
      //   <div data-resize-container>
      //     <div data-resize-wrapper>
      //       <img />
      //     </div>
      //   </div>
      //
      // However, in the HTML output those divs are omitted and only the <img /> exists.
      // This creates a unique challenge when it comes to implementing a CustomImage
      // extension that uses its own alignment logic. Consequently, this version should
      // NOT use resizing.
      //
      ///////////////////////////////////////////////////////////////////////////
      CustomImage,

      CustomYoutube.configure({
        controls: false,
        nocookie: true
      })
    ],

    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const json = editor.getJSON()
      const text = editor.getText()
      const value = { html, json, text }
      // AI : getJSON() + setContent(json) is the recommended round-trip for persistence (?).
      // Or lift these into state, a form library, etc.
      onChange?.(value)
    },

    // Fires once after the editor is initialized. Useful if you need a reference to the editor instance for something outside React.
    onCreate: (_props) => {},
    onDestroy: (_props) => {},
    onMount: (_props) => {},
    onBlur: (_props) => {},
    onFocus: (_props) => {},

    editorProps: {
      attributes: {
        ///////////////////////////////////////////////////////////////////////////
        //
        // This styles the inner <div contenteditable="true"> :
        //
        //   <div data-slot="tiptap-editor-content">
        //     <div contenteditable="true" translate="no" class="tiptap ProseMirror" tabindex="0"></div>
        //   </div>
        //
        // Setting outline-none will effectively disable the built-in .ProseMirror-focused class.
        //
        ///////////////////////////////////////////////////////////////////////////
        // Or do:  class: disabled ? 'hidden' : 'outline-none py-2 pr-2 pl-6 h-full',
        class: 'outline-none py-2 pr-2 pl-6 h-full', // pl-6 is to accomodate the drag handle.
        style: ''
      }
    }
  })

  /* ======================
        editorState
  ====================== */
  // Currently, I prefer having editorState in the TiptapContext.
  // However, this may be shooting myself in the foot in regards to optimization.
  // It may actually be more appropriate to localize it within MenuBar.tsx.
  // That said, it also makes sense to have it here in order to allow the
  // FormatBubbleMenu to access it.

  const editorState = useEditorState({
    // Technically if there's no editor, useEditorState will be fine.
    // However, ctx.editor in menuBarState will end up being undefined.
    // Consequently, one must ensure that all values in menuBarState use
    // optional chaining: ctx.editor?. ...
    editor: editor, // as Editor
    // But actually, there's another way. We can instead return null from selector.
    // If you go this route, make sure to then use optional chaining in the after
    // editorState in this file.
    selector: (ctx) => {
      if (!editor || !ctx.editor) return null
      return menuBarSelector(ctx)
    }
  })

  /* ======================
         useEffect()
  ====================== */
  // Keeps editable in sync whenever `disabled` changes after mount

  useEffect(() => {
    if (!editor) return

    // Only locks the contenteditable div. You still must guard your
    // functionality by checking if disabled and/or editor.isEditable.
    editor.setEditable(!disabled)
  }, [editor, disabled])

  /* ======================
          return
  ====================== */

  return (
    <TiptapContext value={{ editor, editorState }}>{children}</TiptapContext>
  )
}

/* ========================================================================
             
======================================================================== */

export const useTiptapContext = () => {
  const context = use(TiptapContext)
  if (!context) {
    throw new Error('useTiptapContext must be used within a TiptapProvider')
  }
  return context
}
