// ⚠️ Gotcha: The CSS here MUST be part of the global CSS. Otherwise, if the
// RTE is not present when you show the dangerouslySetInnerHTML, then there won't
// be fidelity betwee the rich text in the editor and the dangerouslySetInnerHTML.
// This may also be the case for other localized CSS files in the RTE directory.
import '../index.css'
import '../theme/theme.css'

import { /* useEffect, */ useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import { RTE } from '../'

import { Button } from '@/components'

const _defaultValue1 = `<p dir="ltr"><span style="white-space: pre-wrap;">Hello. My name is </span><b><strong class="editor-theme-textBold" style="white-space: pre-wrap;">David.</strong></b></p>`
const _defaultValue2 = `<p dir="ltr">This is the updated 'default' value...</p>`

const _defaultValue3 = `<pre class="editor-theme-code" spellcheck="false" data-language="javascript" data-highlight-language="javascript" data-gutter="1
2
3"><span class="editor-theme-tokenAttr" style="white-space: pre-wrap;">const</span><span style="white-space: pre-wrap;"> </span><span style="white-space: pre-wrap;">logMessage</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">=</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">(</span><span style="white-space: pre-wrap;">message</span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">:</span><span style="white-space: pre-wrap;"> string</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">)</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">=&gt;</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">{</span><br><span style="white-space: pre-wrap;">  console</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">.</span><span class="editor-theme-tokenFunction" style="white-space: pre-wrap;">log</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">(</span><span style="white-space: pre-wrap;">message</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">)</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">;</span><br><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">}</span></pre>`

// This version demonstrates that <code> will still be transformed correctly.
const _defaultValue4 = `<code class="editor-theme-code" spellcheck="false" data-language="javascript" data-highlight-language="javascript" data-gutter="1
2
3"><span class="editor-theme-tokenAttr" style="white-space: pre-wrap;">const</span><span style="white-space: pre-wrap;"> </span><span style="white-space: pre-wrap;">logMessage</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">=</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">(</span><span style="white-space: pre-wrap;">message</span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">:</span><span style="white-space: pre-wrap;"> string</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">)</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">=&gt;</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">{</span><br><span style="white-space: pre-wrap;">  console</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">.</span><span class="editor-theme-tokenFunction" style="white-space: pre-wrap;">log</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">(</span><span style="white-space: pre-wrap;">message</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">)</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">;</span><br><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">}</span></code>`

const _defaultSquare = `<p class="editor-theme-paragraph"><span contenteditable="false" style="display: inline-block; width: 100px; height: 100px; background-color: rgb(132, 204, 22);"></span></p><p class="editor-theme-paragraph"><br></p>`

const _defaultYoutube = `
<div 
  data-lexical-youtube-wrapper="true"
  class="editor-theme-embedBlock"
  style="text-align: center;"
>
  <iframe 
    data-lexical-youtube="u8nuT1rDB7o"
    src="https://www.youtube-nocookie.com/embed/u8nuT1rDB7o" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen="true" title="YouTube video"
    style="aspect-ratio: 16 / 9; width: 800px; max-width: 100%;"
  ></iframe>
</div>
<p class="editor-theme-paragraph"><br></p>
`

const _defaultCode =
  '<code class="editor-theme-code" spellcheck="false" data-language="javascript" data-highlight-language="javascript" data-gutter="1\n2\n3"><span class="editor-theme-tokenAttr" style="white-space: pre-wrap;">const</span><span style="white-space: pre-wrap;"> </span><span style="white-space: pre-wrap;">add</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">=</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">(</span><span style="white-space: pre-wrap;">n1</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">,</span><span style="white-space: pre-wrap;"> n2</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">)</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">=&gt;</span><span style="white-space: pre-wrap;"> </span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">{</span><br><span style="white-space: pre-wrap;">  </span><span class="editor-theme-tokenAttr" style="white-space: pre-wrap;">return</span><span style="white-space: pre-wrap;"> n1 </span><span class="editor-theme-tokenOperator" style="white-space: pre-wrap;">+</span><span style="white-space: pre-wrap;"> n2</span><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">;</span><br><span class="editor-theme-tokenPunctuation" style="white-space: pre-wrap;">}</span></code>'

const _defaultH4Indent = `<h4 class="editor-theme-h4" dir="ltr" style="padding-inline-start: 120px;"><span style="white-space: pre-wrap;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</span></h4>`

// Lexical, by default, does not execute scripts embedded in the content.
// https://github.com/facebook/lexical/discussions/4534
// However, they indicate that it's ultimately the user's responsibility to
// sanitize content.

/* ========================================================================
                         
======================================================================== */

export const Demo = () => {
  const [initialValue, _setInitialValue] = useState<string>('')
  const [value, setValue] = useState<string>(initialValue)

  // There is some concern that DOMPurify.sanitize may not work with Next.js,
  // but I think it's fine in client components.
  // 2026: But actually this will cause an error in Tanstack Start on browser refresh:
  // ❌ react-dom_client.js?v=c42d322c:7708 Uncaught Error: Switched to client rendering because the server rendering errored:
  // __vite_ssr_import_2__.default.sanitize is not a function
  //
  // Note that DOMPurify.sanitize() also exists within the InitialValuePlugin.
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

  const apiRef = useRef<React.Ref<unknown>>(null)

  // useEffect(() => {
  //   setTimeout(() => {
  //     setInitialValue(defaultYoutube)
  //   }, 800)
  // }, [])

  return (
    <section className='mx-auto mb-12 max-w-[800px]'>
      <div className='mb-6 flex justify-center gap-4'>
        <Button
          onClick={() => {
            const api = apiRef.current
            // console.log('api:', api) // => {clear: ƒ, focus: ƒ}
            if (api === null) {
              return
            }

            if (
              typeof api === 'object' &&
              'clear' in api &&
              typeof api.clear === 'function'
            ) {
              api.clear()
            }
          }}
          size='sm'
          variant='destructive'
        >
          Clear Editor
        </Button>

        <Button
          onClick={() => {
            const api = apiRef.current
            if (api === null) {
              return
            }

            if (
              typeof api === 'object' &&
              'focus' in api &&
              typeof api.focus === 'function'
            ) {
              api.focus()
            }
          }}
          size='sm'
          variant='info'
        >
          Focus Editor
        </Button>
      </div>

      <RTE
        apiRef={apiRef}
        initialValue={initialValue}
        namespace='TestEditor'
        onChange={(values) => {
          // console.log('\n\nRTE onchange:', values)
          setValue(values.html)
        }}
        placeholder='Say something genius!'
      />

      <br />
      <br />

      <h3 className='text-primary text-lg font-bold'>
        dangerouslySetInnerHTML:
      </h3>

      <div
        className='mb-8 rounded-lg border border-neutral-400 bg-white p-4'
        dangerouslySetInnerHTML={{
          __html: sanitizedValue
        }}
      />

      <h3 className='text-primary text-lg font-bold'>values.html:</h3>
      <p className='mb-4'>
        ⚠️ Gotcha: previously, I was outputting{' '}
        <code className='text-pink-500'>value</code> by doing this:
      </p>

      <pre className='mb-4 px-4'>
        <code className='text-sm text-pink-500'>
          {`<div className='mb-8 rounded-lg border border-neutral-400 bg-white p-4'>
  {value}
</div>`}
        </code>
      </pre>

      <p className='mb-4'>
        The big problem there occurs when you treat that as the <em>actual</em>{' '}
        value, and try to then test it as a default/initial value in this demo.
        In practice, <code className='text-pink-500'>value</code> might contain
        something like{' '}
        <code className='text-pink-500'>data-gutter="1\n2\n3"</code>, but if you
        output to the UI as shown above, you'll simply get{' '}
        <code className='text-pink-500'>data-gutter="1 2 3"</code>, which is
        obviously <em>not the same</em>. It ends up stripping out the{' '}
        <code className='text-pink-500'>\n</code> parts, which are crucial!
        Solution: do this instea.
      </p>

      <pre className='mb-4 px-4'>
        <code className='text-sm text-pink-500'>
          {`<pre className='mb-8 overflow-auto rounded-lg border border-neutral-400 bg-white p-4'>
  {JSON.stringify(value, null, 2)}
</pre>`}
        </code>
      </pre>

      <pre className='mb-8 overflow-auto rounded-lg border border-neutral-400 bg-white p-4'>
        {JSON.stringify(value, null, 2)}
      </pre>

      <p className='mb-4'>
        Ultimately, this will necessitate a lot more horizontal scrolling to see
        the value, but at least it's the <em>real</em> value.
      </p>
    </section>
  )
}
