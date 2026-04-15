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

//# Add font family support (part of TextStyleKit)

//# Add Checkbox supprt:
//# https://tiptap.dev/docs/editor/extensions/nodes/task-list

//# Add emoji support: https://tiptap.dev/docs/editor/extensions/nodes/emoji

//# Add image support: https://tiptap.dev/docs/editor/extensions/nodes/image

//# Add Youtube embed support: https://tiptap.dev/docs/editor/extensions/nodes/youtube

//# Add fallbacks to CSS custom properties in Tiptap.css

//# Add a DragHandle
//# https://tiptap.dev/docs/editor/extensions/functionality/drag-handle-react

//# Tiptap actually has a whole bunch of UI comonents
//# https://tiptap.dev/docs/ui-components/components/overview
//# Some of these are behind a paywall.

//# See here for demo of LinkComponent:
//# https://github.com/thapatechnical/job-portal-nextjs/blob/main/src/components/text-editor.tsx

//# Review Flowbite: https://flowbite.com/docs/plugins/wysiwyg/

//# Review: https://github.com/ueberdosis/awesome-tiptap/

//# Does Tiptap have any kind of built-in sanitization?

//# Fix RTE import issue.

//# See here for CustomCodeBlock. This is also a great example to pick apart.
//# https://github.com/phyohtetarkar/tiptap-block-editor/blob/main/src/components/editor/default-extensions.ts

//# The dropdown menu currently doesn't respond well to viewport width resizing.

export const TiptapDemo = () => {
  /* =====================
          return
  ====================== */

  return (
    <Tiptap
      className='mx-auto max-w-[950px]'
      editorProps={{
        content: defaultValue,
        placeholder: 'Write something...'
      }}
      onChange={(value) => {
        console.log('value from external onChange:', value)
      }}
    />
  )
}
