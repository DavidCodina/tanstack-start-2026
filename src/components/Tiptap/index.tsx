import './Tiptap.css'

import { EditorContent, useEditor } from '@tiptap/react'
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
import { TextStyleKit } from '@tiptap/extension-text-style'

import { MenuBar } from './MenuBar'

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
///////////////////////////////////////////////////////////////////////////
//
// Tiptap Youtube:         https://www.youtube.com/@tiptap-editor/videos
// ✅ Cand Dev:            https://www.youtube.com/watch?v=QVffer2fRfg //# Start at 13:15
//    Cand Dev:            https://www.youtube.com/watch?v=M3BdmN4etYg
//    StackWild:           https://www.youtube.com/watch?v=s1lpwpeSGW4
//    Age Concepts:        https://www.youtube.com/watch?v=zIm1FYi8A7c
//    Code DPS:            https://www.youtube.com/watch?v=hpQmgLPaCcE&list=PL6yN8EtcWUmYfgln8Vxm5sEde8FroZYt0
//    De Mawo:             https://www.youtube.com/watch?v=MEhVUDP3a_k
//    Solve It Out:        https://www.youtube.com/watch?v=LiELuVk12ig
//
// Examples:               https://tiptap.dev/docs/examples
// Tiptap Editor Overview: https://tiptap.dev/docs/editor/getting-started/overview
// Extenstions Overview:   https://tiptap.dev/docs/editor/extensions/overview
// StarterKit:             https://tiptap.dev/docs/editor/extensions/functionality/starterkit
//
//
// Note: There is a @tiptap/cli. However, for TanStack Start, go manual.
//
//   https://tiptap.dev/docs/editor/getting-started/install/react
//   - @tiptap/react: The React bindings for Tiptap including Tiptap's core functionality.
//   - @tiptap/pm: Tiptap's ProseMirror dependencies, which are required for the editor to function.
//   - @tiptap/starter-kit: A collection of commonly used extensions that provide basic functionality
//     like paragraphs, headings, bold, italic, and more.
//
//   npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
//
// See this: https://tiptap.dev/docs/guides/react-composable-api
//
///////////////////////////////////////////////////////////////////////////

//# Add more features to the TextFormatDropdown.

//# Separate the editor from the example.

//# Create an alignment Dropdown/Combobox.

//# Add fallbacks to CSS custom properties in Tiptap.css

//# Add lowercase, uppercase, capitalize

//# Create an Insert Dropdown.

//# Research how to add text colors and background colors.

//# Research how to add font types.

//# Research how to add font sizes.

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

export const Tiptap = () => {
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
        types: ['heading', 'paragraph']
      }),
      Highlight
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
        class: 'outline-none min-h-[150px] p-2'
      }
    }
  })

  if (!editor) {
    return null
  }

  /* =====================
          return
  ====================== */

  return (
    <div className='bg-card focus-within:ring-primary/50 mx-auto max-w-[800px] rounded-lg border shadow focus-within:ring-[3px]'>
      <MenuBar editor={editor} />

      <EditorContent data-slot='editor-content' className='' editor={editor} />
    </div>
  )
}

// //
//   {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu> */}
//   {/* <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>  */}

/* 
Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // disallowed domains
            const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }

            // all checks have passed
            return true
          } catch {
            return false
          }
        },
        shouldAutoLink: url => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch {
            return false
          }
        },
      }),
*/
