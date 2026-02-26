import './index.css'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ✅ Kevin Powell  :is() :where() :has(): https://www.youtube.com/watch?v=3ncFpP8GP4g&t=1s
// ✅ Kevin Powell                       : https://www.youtube.com/watch?v=OGJvhpoE8b4
// Kevin Powell                       : https://www.youtube.com/watch?v=jJcO-IZJalQ
//
// Tailwind has :has() pseudo selector variant.
// https://github.com/tailwindlabs/tailwindcss/pull/11318
// https://github.com/tailwindlabs/tailwindcss/pull/11318/commits/a116f56b05abf9effd3a276d1d89b42840e8e216
//
///////////////////////////////////////////////////////////////////////////

export const Has_Demo = () => {
  return (
    <>
      {/* =====================
                :is() 
      ===================== */}

      {/* <section className='is-container'>
        <h1>I'm an h1</h1>

        <h2>I'm an h2</h2>

        <h3>I'm an h3</h3>

        <h4>I'm an h4</h4>

        <h5>I'm an h5</h5>

        <h6>I'm an h6</h6>
      </section> */}

      {/* =====================
                :where()
      ===================== */}

      {/* <section className='where-container'>
        <h1>I'm an h1</h1>

        <h2>I'm an h2</h2>

        <h3>I'm an h3</h3>

        <h4>I'm an h4</h4>

        <h5>I'm an h5</h5>

        <h6>I'm an h6</h6>
      </section> */}

      {/* =====================
                :has()
      ===================== */}

      <section className='has-container'>
        <h1>I'm an h1</h1>

        <h2>I'm an h2</h2>
      </section>

      {/* Note: The Tailwind has-[ ... ] also works with combintators. */}
      {/* <section className='mx-auto max-w-[500px] border-2 bg-white p-4 has-[>h1]:border-red-500'>
        <h1>I'm an h1</h1>

        <h2>I'm an h2</h2>
      </section> */}

      <div className='is-[:not(:hover)]:bg-green-500 h-32 w-32 bg-neutral-400' />
    </>
  )
}
