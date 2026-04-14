import { Tiptap } from '../'

const defaultValue = `
<h2>
  Whuddup!
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

<blockquote>
  <h5>My Code Quote</h5>
  <p>This is a quote with an <code>h5</code> block, code block, and paragraph</p>
  <pre><code>const x = 2;</code></pre>
  <p>Bla, bla, bla...</p>
</blockquote>
`

/* ========================================================================

======================================================================== */

//# Add Lowercase, Uppercase, Capitalize
//# This may be a situation for a custom extension.

//# Research how to add font family (part of TextStyleKit)

//# Sdd emoji support: https://tiptap.dev/docs/editor/extensions/nodes/emoji

//# Add image support: https://tiptap.dev/docs/editor/extensions/nodes/image

//# Add Youtube embed support: https://tiptap.dev/docs/editor/extensions/nodes/youtube

//# Research how to add font sizes (part of TextStyleKit)

//# Add fallbacks to CSS custom properties in Tiptap.css

//# Add a DragHandle
//# https://tiptap.dev/docs/editor/extensions/functionality/drag-handle-react

//# Tiptap actually has a whole bunch of UI comonents
//# https://tiptap.dev/docs/ui-components/components/overview
//# Some of these are behind a paywall.

//# Add Checkboxes:
//# https://tiptap.dev/docs/editor/extensions/nodes/task-list

//# Review Flowbite: https://flowbite.com/docs/plugins/wysiwyg/

//# Reive: https://github.com/ueberdosis/awesome-tiptap/

//# When are these useful?
// <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
// <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>

//# Does Tiptap have any kind of built-in sanitization?

//# Fix RTE import issue.

//# See here for CustomCodeBlock. This is also a great example to pick apart.
//# https://github.com/phyohtetarkar/tiptap-block-editor/blob/main/src/components/editor/default-extensions.ts

//# The dropdown menu currently doesn't responde well to viewport width resizing.

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

export const TiptapDemo = () => {
  /* =====================
          return
  ====================== */

  return (
    <Tiptap
      className='mx-auto max-w-[850px]'
      editorProps={{
        content: defaultValue,
        placeholder: 'Write something dummy...'
      }}
    />
  )
}
