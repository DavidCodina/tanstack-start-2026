import * as React from 'react'
//# import DOMPurify from 'dompurify'

import { Tiptap } from '../'
import { Button } from '@/components'

// const defaultValue = `
// <h2>
//   Whuddup!
// </h2>
// <p>
//   this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
// </p>
// <ul>
//   <li>
//     That's a bullet list with one …
//   </li>
//   <li>
//     … or two list items.
//   </li>
// </ul>
// <p>
//   Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
// </p>
// <pre><code class="language-css">body {
//   display: none;
// }</code></pre>

// <blockquote>
//   <h5>My Code Quote</h5>
//   <p>This is a quote with an <code>h5</code> block, code block, and paragraph</p>
//   <pre><code>const x = 2;</code></pre>
//   <p>Bla, bla, bla...</p>
// </blockquote>
// `

// const defaultYoutube =
//   '<p>asdfsad</p><div data-youtube-video="" style="text-align: left;"><iframe width="320" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" rel="1" src="https://www.youtube-nocookie.com/embed/VPBgSxiuBxY?controls=0&amp;rel=1" start="0"></iframe></div><p>asdsadf</p>'

const defaultYoutube =
  '<p>asldfkj</p><div data-custom-youtube-video="" style="display: flex; justify-content: center;"><iframe width="400" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" rel="1" src="https://www.youtube-nocookie.com/embed/rqwhDgikHq8?controls=0&amp;rel=1" start="0"></iframe></div><p>asdflk</p>'

/* ========================================================================

======================================================================== */

//# Add fallbacks to CSS custom properties in Tiptap.css

//# Possibly add checks that remove properties from menu.
//# For example, if isYoutube, then remove alignment.

//# Add Lowercase, Uppercase, Capitalize
//# This may be a situation for a custom extension.

//# Add Checkbox supprt:
//# https://tiptap.dev/docs/editor/extensions/nodes/task-list

//# Add emoji support: https://tiptap.dev/docs/editor/extensions/nodes/emoji

//# Add image support: https://tiptap.dev/docs/editor/extensions/nodes/image

//# Add a DragHandle
//# https://tiptap.dev/docs/editor/extensions/functionality/drag-handle-react

//# Tiptap actually has a whole bunch of UI components
//# https://tiptap.dev/docs/ui-components/components/overview
//# Some of these are behind a paywall.

//# See here for demo of LinkComponent:
//# https://github.com/thapatechnical/job-portal-nextjs/blob/main/src/components/text-editor.tsx
//# But really no need. Just follow the example of the YoutubeModal.

//# Review Flowbite: https://flowbite.com/docs/plugins/wysiwyg/

//# Review: https://github.com/ueberdosis/awesome-tiptap/

//# Does Tiptap have any kind of built-in sanitization?

//# Fix RTE import issue.

//# See here for CustomCodeBlock. This is also a great example to pick apart.
//# https://github.com/phyohtetarkar/tiptap-block-editor/blob/main/src/components/editor/default-extensions.ts

//# The dropdown menu currently doesn't respond well to viewport width resizing.

export const TiptapDemo = () => {
  const [value, setValue] = React.useState<string>(defaultYoutube)
  const [disabled, setDisabled] = React.useState(false)

  ///////////////////////////////////////////////////////////////////////////
  //
  // There is some concern that DOMPurify.sanitize may not work with Next.js,
  // but I think it's fine in client components.
  // 2026: But actually this will cause an error in Tanstack Start on browser refresh:
  // ❌ react-dom_client.js?v=c42d322c:7708 Uncaught Error: Switched to client rendering because the server rendering errored:
  // __vite_ssr_import_2__.default.sanitize is not a function
  //
  // Note that DOMPurify.sanitize() also exists within the InitialValuePlugin.
  //
  ///////////////////////////////////////////////////////////////////////////

  // const sanitizedValue = DOMPurify.sanitize(value, {
  //   USE_PROFILES: { html: true },
  //   ADD_TAGS: ['iframe', 'a'],
  //   ADD_ATTR: [
  //     'allow',
  //     'allowfullscreen',
  //     'frameborder',
  //     'scrolling',
  //     'target',
  //     'title'
  //   ],
  //   KEEP_CONTENT: false
  // })

  /* =====================
          return
  ====================== */

  return (
    <section className='mx-auto max-w-[1150px]'>
      <Button
        className='mb-4'
        onClick={() => {
          setDisabled((prev) => !prev)
        }}
        size='sm'
        variant={disabled ? 'success' : 'destructive'}
      >
        {disabled ? 'Enable' : 'Disable'} Editor
      </Button>
      <Tiptap
        className='shadow'
        defaultFontFamily='' // Falls back to 'Poppins'.
        disabled={disabled}
        editorProps={{
          content: defaultYoutube,
          placeholder: 'Write something...'
        }}
        onChange={(newValue) => {
          setValue(newValue.html)
          // console.log('value from external onChange:', value)
        }}
      />

      <br />
      <br />

      {/* ====================
  
      ===================== */}

      <h3 className='text-primary text-2xl font-bold'>
        dangerouslySetInnerHTML:
      </h3>

      <div
        // ⚠️ In this case, using the tiptap CSS class works because the Tiptap instance
        // is on the same page an imports the Tiptap.css file internally. However, for
        // production, you'll want to @import the CSS file into your global stylesheet instead.
        className='tiptap bg-card mb-8 min-h-[250px] rounded-lg border p-4 shadow'
        dangerouslySetInnerHTML={{
          __html: value //# sanitizedValue
        }}
      />

      <h3 className='text-primary text-2xl font-bold'>values.html:</h3>

      <pre className='bg-card mb-8 overflow-auto rounded-lg border p-4 shadow'>
        {JSON.stringify(value, null, 2)}
      </pre>

      <article className='bg-card mb-8 rounded-lg border p-4 shadow'>
        <h3 className='text-primary text-2xl font-bold'>⚠️ Gotcha: </h3>
        <p className='mb-4'>
          Previously, I was outputting{' '}
          <code className='text-pink-500'>value</code> by doing this:
        </p>

        <pre className='mb-4 px-4'>
          <code className='text-sm text-pink-500'>
            {`<div className='mb-8 rounded-lg border bg-card p-4'>{value}</div>`}
          </code>
        </pre>

        <p className='mb-4'>
          The big problem there occurs when you treat that as the{' '}
          <em>actual</em> value, and try to then test it as a default/initial
          value in this demo. In practice,{' '}
          <code className='text-pink-500'>value</code> might contain something
          like <code className='text-pink-500'>data-gutter="1\n2\n3"</code>, but
          if you output to the UI as shown above, you'll simply get{' '}
          <code className='text-pink-500'>data-gutter="1 2 3"</code>, which is
          obviously <em>not the same</em>. It ends up stripping out the{' '}
          <code className='text-pink-500'>\n</code> parts, which are crucial!
          Solution: do this instead.
        </p>

        <pre className='mb-4 px-4'>
          <code className='text-sm text-pink-500'>
            {`<pre className='mb-8 overflow-auto rounded-lg border bg-card p-4'>
  {JSON.stringify(value, null, 2)}
</pre>`}
          </code>
        </pre>

        <p>
          Ultimately, this will necessitate a lot more horizontal scrolling to
          see the value, but at least it's the <em>real</em> value.
        </p>
      </article>
    </section>
  )
}
