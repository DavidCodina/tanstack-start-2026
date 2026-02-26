import { Separator } from '../'

/* ========================================================================

======================================================================== */

export const SeparatorDemo1 = () => {
  return (
    <section>
      <div className='bg-card text-primary border-primary mx-auto mb-6 flex w-fit gap-4 rounded border px-2 py-1 text-sm text-nowrap shadow'>
        <div>Home</div>
        <div>Pricing</div>
        <div>Blog</div>
        <div>Support</div>

        <Separator orientation='vertical' className='bg-primary' />

        <div>Log in</div>
        <div>Sign up</div>
      </div>

      <div className='bg-card text-primary border-primary mx-auto mb-6 flex w-fit flex-col items-center justify-center gap-4 rounded border px-2 py-2 text-sm text-nowrap shadow'>
        <div>Home</div>
        <div>Pricing</div>
        <div>Blog</div>
        <div>Support</div>

        <Separator
          // orientation='horizontal' // Default.
          className='bg-primary'
        />

        <div>Log in</div>
        <div>Sign up</div>
      </div>
    </section>
  )
}
