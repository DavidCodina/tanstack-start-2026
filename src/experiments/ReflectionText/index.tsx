/* ========================================================================

======================================================================== */
// https://www.codesdope.com/blog/article/add-impressive-reflection-effects-using-only-css/
// https://css-tricks.com/creating-realistic-reflections-with-css/
// This is cool and all, but it's very difficult to get the values to line up as you
// resize the text.

export const ReflectionText = () => {
  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='relative mt-[50px] flex justify-center'>
        <h1 className='text-5xl leading-none font-black text-[#409]'>Hello!</h1>
        <h1
          className='text-5xl leading-none font-black text-[#409]'
          style={{
            position: 'absolute',
            top: '48%',
            transform: 'scaleY(-0.5) translateX(16%) skew(-55deg)',

            WebkitMaskImage:
              'linear-gradient(transparent 15%, rgba(0,0,0,0.9) 100%)'
          }}
        >
          Hello!
        </h1>
      </div>
    </>
  )
}
