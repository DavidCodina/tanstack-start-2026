import { Fragment } from 'react'
import Balancer from 'react-wrap-balancer'

/* ========================================================================
                                WrapBalancerDemo
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://www.npmjs.com/package/react-wrap-balancer
// https://react-wrap-balancer.vercel.app/
//
// It uses text-wrap: balance. That property seems to be a Chrome feature only:
// https://developer.chrome.com/blog/css-text-wrap-balance/
// Which is why if you try to apply it to the style prop, TS will complain.
//
// Tailwind is soon to releast the 'text-balance' utility.
// You can also just do this:
//
//   <h2
//     className='text-center text-3xl font-bold'
//     style={{ textWrap: 'balance' } as React.CSSProperties}
//   >
//     Start using our app to build new habits - and change your life
//   </h2>
//
// So, I'm not really sure what benefit using Balancer provides.
// Presumably, it's cross-browser compatible, bu I haven't checked that yet.
//
///////////////////////////////////////////////////////////////////////////

export const WrapBalancerDemo = () => {
  return (
    <Fragment>
      <p>
        This package describes itself as a "simple React Component That Makes
        Titles More Readable." Thus, we can infer from this that it's primarily
        intended to be used in conjunction with titles, and generally titles
        that are centered.
      </p>
      <h1 className='mb-4 rounded-lg border border-blue-500 bg-white text-center font-black text-blue-500'>
        <Balancer>
          The Greatest Title Ever Used in History! Yay Balancer!
        </Balancer>
      </h1>

      <h1 className='mb-12 rounded-lg border border-blue-500 bg-white text-center font-black text-blue-500'>
        The Greatest Title Ever Used in History! Yay Balancer!
      </h1>

      <p>
        If you attempt to use it with regular text blocks, the effect doesn't
        really make sense.
      </p>

      <article className='mb-4 rounded-lg border border-blue-500 bg-white p-3 text-blue-500'>
        <Balancer>
          <strong>I'm balanced!</strong> Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
          sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Balancer>
      </article>

      <article className='mb-12 rounded-lg border border-blue-500 bg-white p-3 text-blue-500'>
        <strong>I'm not balanced!</strong> Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </article>

      <p>
        However, if the text-block is centered,{' '}
        <strong>
          <em>then</em>
        </strong>{' '}
        it may be useful.
      </p>

      <article className='mb-4 rounded-lg border border-blue-500 bg-white p-3 text-center text-blue-500'>
        <Balancer>
          <strong>I'm balanced!</strong> Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
          sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Balancer>
      </article>

      <article className='mb-12 rounded-lg border border-blue-500 bg-white p-3 text-center text-blue-500'>
        <strong>I'm not balanced!</strong> Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </article>
    </Fragment>
  )
}
