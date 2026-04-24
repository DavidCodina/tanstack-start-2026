import * as React from 'react'
import DOMPurify from 'dompurify'

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

// ⚠️ Tiptap and/or React seem to protect from script injections like the following.
// That said, it's still generally a good idea to sanitize a value with DOMPurify
// prior to using it in Tiptap. It's even more important to sanitize the value
// prior to using dangerouslySetInnerHTML
// const scriptTest = `<p>Hello. This is a <code>&#60;script&#62;</code> tag test. Check your console logs.<script>console.log("You got hacked!")</script></p>`

const imageDefault =
  '<img src="https://upload.wikimedia.org/wikipedia/en/c/c2/Peter_Griffin.png?_=20110515154115" alt="Family Guy" width="250" data-custom-image="" data-custom-image-align="right"><p></p>'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Todo: The dropdown menu doesn't respond well to viewport width resizing.
// Switch to Floating UI - similar to EmojiSuggestion.tsx. This will correct
// the issue by automatically changing from 'bottom-start' to 'bottom-end'.
//
// ⚠️ Todo Bonus: See here for CustomCodeBlock. This is also a great example to pick apart.
// https://github.com/phyohtetarkar/tiptap-block-editor/blob/main/src/components/editor/default-extensions.ts
//
// ⚠️ Todo Bonus: Add Lowercase, Uppercase, Capitalize. This may be a case for a custom extension.
//
///////////////////////////////////////////////////////////////////////////

export const TiptapDemo = () => {
  const [value, setValue] = React.useState<string>(imageDefault)
  const [disabled, setDisabled] = React.useState(false)

  const [sanitizedValue, setSanitizedValue] = React.useState('')

  /* =====================
        useEffect()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Gotcha: DOMPurify.sanitize is not compatible with SSR, so doing this
  // directly in the component body will trigger an error:
  //
  //   const sanitizedValue = DOMPurify.sanitize(value, {
  //     USE_PROFILES: { html: true },
  //     ADD_TAGS: ['iframe', 'a'],
  //     ADD_ATTR: [
  //       'allow',
  //       'allowfullscreen',
  //       'frameborder',
  //       'scrolling',
  //       'target',
  //       'title'
  //     ],
  //     KEEP_CONTENT: false
  //   })
  //
  //   ❌ Uncaught Error: Switched to client rendering because the server rendering errored:
  //   __vite_ssr_import_2__.default.sanitize is not a functionxw
  //
  // The root cause is that DOMPurify accesses window and document, which don't exist in the
  // SSR environment. The fix is to move sanitization into a useEffect so it only ever runs
  // on the client after mount.
  //
  ///////////////////////////////////////////////////////////////////////////

  React.useEffect(() => {
    setSanitizedValue(() => {
      const sanitizedValue = DOMPurify.sanitize(value, {
        USE_PROFILES: { html: true },
        ADD_TAGS: ['iframe', 'a'],
        ADD_ATTR: [
          'allow',
          'allowfullscreen',
          'frameborder',
          'scrolling',
          'target',
          'title'
        ],
        KEEP_CONTENT: false
      })

      return sanitizedValue
    })
  }, [value])

  /* =====================
          return
  ====================== */
  // Why is the demo wrapper is a form? It tells us
  // when onSubmit callback accidentally triggers.
  // Generally this implies typ="button" was accidentally
  // omitted from some internal <button> element.

  return (
    <>
      <form
        className='mx-auto max-w-[1150px]'
        onSubmit={(e) => {
          e.preventDefault()
          alert('onSubmit() called.')
        }}
      >
        <div className='relative'>
          <Button
            className='absolute top-1 -right-6 min-w-[100px] rotate-45 text-lg uppercase shadow-[0px_2px_4px_rgba(0,0,0,0.5)]'
            onClick={() => {
              setDisabled((prev) => !prev)
            }}
            size='sm'
            variant={disabled ? 'success' : 'destructive'}
          >
            {disabled ? 'Enable' : 'Disable'}
          </Button>
        </div>

        <Tiptap
          className='shadow'
          defaultFontFamily='' // Falls back to 'Poppins'.
          disabled={disabled}
          editorProps={{
            content: imageDefault,
            placeholder: 'Write something...'
          }}
          onChange={(newValue) => {
            setValue(newValue.html)
            // console.log('value from external onChange:', value)
          }}
        />

        {!disabled && (
          <>
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
                __html: sanitizedValue // ❌ value
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
                <em>actual</em> value, and try to then test it as a
                default/initial value in this demo. In practice,{' '}
                <code className='text-pink-500'>value</code> might contain
                something like{' '}
                <code className='text-pink-500'>data-gutter="1\n2\n3"</code>,
                but if you output to the UI as shown above, you'll simply get{' '}
                <code className='text-pink-500'>data-gutter="1 2 3"</code>,
                which is obviously <em>not the same</em>. It ends up stripping
                out the <code className='text-pink-500'>\n</code> parts, which
                are crucial! Solution: do this instead.
              </p>

              <pre className='mb-4 px-4'>
                <code className='text-sm text-pink-500'>
                  {`<pre className='mb-8 overflow-auto rounded-lg border bg-card p-4'>
  {JSON.stringify(value, null, 2)}
</pre>`}
                </code>
              </pre>

              <p>
                Ultimately, this will necessitate a lot more horizontal
                scrolling to see the value, but at least it's the <em>real</em>{' '}
                value.
              </p>
            </article>
          </>
        )}
      </form>
    </>
  )
}
