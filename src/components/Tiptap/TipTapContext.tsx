import { createContext, use } from 'react'
import { useEditor, useEditorState } from '@tiptap/react'

// import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'

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

// import Link from '@tiptap/extension-link'
// import Image from '@tiptap/extension-image'

// import CharacterCount from '@tiptap/extension-character-count'
// import Table from '@tiptap/extension-table'
// import TableRow from '@tiptap/extension-table-row'
// import TableHeader from '@tiptap/extension-table-header'
// import TableCell from '@tiptap/extension-table-cell'
// import TaskList from '@tiptap/extension-task-list'
// import TaskItem from '@tiptap/extension-task-item'

///////////////////////////////////////////////////////////////////////////
//
// https://tiptap.dev/docs/editor/extensions/marks/text-style
// TextStyleKit is essentially a convenience bundle — a "kit" in the same spirit as StarterKit
// — that groups together all the common text styling extensions in one import. Here's what it
// includes on top of what StarterKit already gives you:
//
//   - The TextStyle mark — this is the foundational piece. It renders a <span> tag on selected
//     text and acts as the carrier for all the inline CSS properties below. Without it, none of
//     the following would work:
//
//       Color: sets the text foreground color (e.g. editor.chain().setColor('#ff0000').run()).
//       BackgroundColor: sets the text highlight/background color via the same <span> mechanism.
//       FontFamily: allows changing the typeface of selected text (e.g. setFontFamily('Georgia')).
//       FontSize: allows setting an explicit font size on selected text (e.g. setFontSize('18px')).
//       LineHeight: allows controlling line height / leading on text blocks.
//
// The key conceptual point:
//
//   StarterKit gives you structural formatting
//   — bold, italic, strike, headings, lists, blockquotes, code blocks, etc.
//   TextStyleKit gives you presentational/CSS formatting
//   — the kind of inline styling you'd associate with a "rich text" word processor experience.
//   They complement each other and don't overlap.
//
// One thing worth knowing: none of the TextStyleKit extensions add UI controls automatically.
// They just wire up the underlying commands and schema. You still need to build your MenuBar
// buttons/dropdowns that call things like editor.chain().focus().setColor('#hexcode').run().
//
///////////////////////////////////////////////////////////////////////////
import { Color, TextStyleKit } from '@tiptap/extension-text-style'

import { menuBarStateSelector } from './menuBarState'
import { Indent } from './extensions/Indent'

import type { Editor } from '@tiptap/core'

import type { MenuBarState } from './menuBarState'

type TiptapContextValue = {
  editor: Editor | null
  editorState: MenuBarState
}

type TiptapProviderProps = {
  children: React.ReactNode
}

const TiptapContext = createContext<TiptapContextValue | undefined>(undefined)

const defaultValue = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That's a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
</p>

<blockquote>
  <h5>My Code Quote</h5>
  <p>This is a quote with an <code>h5</code> block, code block, and paragraph</p>
  <pre><code>const x = 2;</code></pre>
  <p>Bla, bla, bla...</p>
</blockquote>

<p>
  <span style="color: #FF0000;">
    <span style="font-family: serif;">
      This is red serif. This would not work without the TextStyleKit extension.
    </span>
  </span>
</p> 
`
/* ========================================================================
             
======================================================================== */

//! installHook.js:1 [tiptap warn]: Duplicate extension names found: ['color']. This can lead to issues.

//# Fix the Dropdown to use triggerProps exclusively.

//# Separate the editor from the example.

//# Add fallbacks to CSS custom properties in Tiptap.css

//# Add lowercase, uppercase, capitalize
//# This may be a situation for a custom extension.

//# Research how to add text colors and background colors.

//# Research how to add font types.

//# Research how to add font sizes.

//# Tiptap actually has a whole bunch of UI comonents
//# https://tiptap.dev/docs/ui-components/components/overview
//# Some of these are behind a paywall.

//# Add Checkboxes:
//# https://tiptap.dev/docs/editor/extensions/nodes/task-list

//# Does Tiptap have any kind of built-in sanitization?

//# Fix RTE import issue.

//# Other things:
//# - Tiptap has a CharacterCount extension that gives you live stats:
//#    editor.storage.characterCount.characters() // e.g. 142
//#    editor.storage.characterCount.words()      // e.g. 27
//#
//# - Slash Commands / Bubble Menu / Floating Menu
//#   Tiptap ships three built-in UI helpers:
//#     BubbleMenu — pops up contextually when text is selected (great for your bold/italic/highlight buttons)
//#     FloatingMenu — appears on empty lines (good for / command palettes)
//#     Slash commands aren't built-in but are a very common community extension

export function TiptapProvider({ children }: TiptapProviderProps) {
  const editor = useEditor({
    editable: true, // ⚠️ false doesn't seem to make a difference.
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

    // Avoid Error: Tiptap Error: SSR has been detected, please set `immediatelyRender`
    // explicitly to `false` to avoid hydration mismatches.
    // Note: This will cause the value of editor to now be Editor | null.
    immediatelyRender: false,
    extensions: [
      //# What is the Document extension? It's already part of StarterKit, but what does it do?
      TextStyleKit, // ???
      Color,

      // ⚠️ Note you can also do this kind of thing.
      // StarterKit.configure({
      //   italic: false,  // Disable an included extension.
      //   heading: { levels: [1, 2] } // Configure an included extension.
      // })
      StarterKit.configure({
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
        placeholder: 'Write something...'
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

      Superscript, //# Expand on configuration.
      Subscript, //# Expand on configuration.
      TextAlign.configure({
        //# Maybe this is where canAlign... logic is false.
        types: ['heading', 'paragraph']
      }),
      Highlight,
      Indent.configure({
        // No need to add bulletList, orderedList since indentation occurs on the listItem.
        // By default, indent.ts only does:  [ 'paragraph', 'listItem'],
        types: ['paragraph', 'listItem', 'heading', 'codeBlock', 'blockquote'], // heading, codeBlock, blockquote
        minLevel: 0,
        maxLevel: 8
      })
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const json = editor.getJSON()
      const text = editor.getText()

      // AI : getJSON() + setContent(json) is the recommended round-trip for persistence (?).
      console.log({ html, json, text })
      // Or lift these into state, a form library, etc.
    },

    // Fires once after the editor is initialized. Useful if you need a reference to the editor instance for something outside React.
    onCreate: (_props) => {},
    onDestroy: (_props) => {},
    onMount: (_props) => {
      // const { editor } = props
    },
    onBlur: (_props) => {},
    onFocus: (_props) => {},

    editorProps: {
      attributes: {
        // This styles the inner <div contenteditable="true"> :
        //
        //   <div data-slot="editor-content">
        //     <div contenteditable="true" translate="no" class="tiptap ProseMirror" tabindex="0"></div>
        //   </div>
        //
        // Setting outline-none will effectively disable the built-in .ProseMirror-focused class.
        class: 'outline-none p-2 h-full',
        style: ''
      }
    }
  })

  /* ======================
          editorState
  ====================== */

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
      return menuBarStateSelector(ctx)
    }
    // selector: menuBarStateSelector
  })

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
