import { twMerge } from 'tailwind-merge'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://www.youtube.com/@Simonswissdev/videos
//
// Suppose that we have a custom BTN component which internally uses:
//
//   className='rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-500 active:bg-emerald-600'
//
// However, in one specific instance of BTN, we need it to have .rounded-full (pill) instead
// of .rounded-lg. Essentially, you want to override the default styles.
// One solution would be to use a custom mergeClasses() function.
//
//   const mergeClasses = (...classes: string[]) => {
//     return classes.filter(Boolean).join(' ')
//   }
//
//   const BTN = ({ children, className = '', ...otherProps }: any) => {
//     return (
//       <button
//         className={mergeClasses(
//           'rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-500 active:bg-emerald-600',
//           className
//         )}
//         {...otherProps}
//       >
//         {children}
//       </button>
//     )
//   }
//
// This seems like it works, but there's a hidden gotcha. If we look at the rendered HTML in the DOM,
// we see that it has both .rounded-lg AND .rounded-full. In this case, it worked because .rounded-full
// has precedence over .rounded-lg (i.e., comes later in cascase) . However, if the situation were reversed and we wanted to overwite
// .rounded-full with .rounded-lg it wouldn't work. Basically, the two classes are conflicting and
// our mergeClasses function is not smart enough to replace one with the other.
//
// <button class="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-500 active:bg-emerald-600 rounded-full">
//   Click Me
// </button>
//
// Incidentally, the same thing would happen if we were using clsx. The big difference
// with tailwind-merge is that tailwind-merge will merge the classes without style
// conflicts. In other words it will determine when there are conflicting classes, and
// always favor the one that was passed last, while the other will be removed.
//
// Note: this will not work on non-tailwind classes. However, it DOES support arbitrary values.
// And arbitrary values support CSS Custom Properties, so in theory you could do something like:
//
//   <BTN className='rounded-full bg-[var(--color-red-500)]'>Click Me</BTN>
//
// This is super cool because even though you can't overwrite with non-tailwind classes, you
// can overwrite with your app's CSS :root variables.
//
///////////////////////////////////////////////////////////////////////////

const BTN = ({ children, className = '', ...otherProps }: any) => {
  return (
    <button
      className={twMerge(
        'rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-500 active:bg-emerald-600',
        className // It's important that this is passed last because the latter overwrites conflicts with the former.
      )}
      {...otherProps}
    >
      {children}
    </button>
  )
}
export const TailwindMergeDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <>
      <BTN className='rounded-full bg-red-500'>Click Me</BTN>
    </>
  )
}
