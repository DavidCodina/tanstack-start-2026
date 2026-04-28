import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test/$id/bonus')({
  component: PageTestDynamic
})

/* ========================================================================

======================================================================== */

function PageTestDynamic() {
  /* ======================
          return
  ====================== */
  return (
    <div>
      <article className='mx-auto max-w-[600px]'>
        <h2 className='text-primary mb-4 border-b-2 text-xl font-bold'>
          Bonus Content!
        </h2>
        <p className='leading-loose'>
          I'm the bonus <code className='text-pink-500'>{`<Outlet/>`}</code>{' '}
          content! Generally, I wouldn't recommend using Tanstack Router for
          conditional content like this. Conceptually, it usually makes more
          sense to opt for a <code className='text-pink-500'>{`<Tabs/>`}</code>{' '}
          implementation, or some other similar UI feature. However, it's nice
          to know that conditional subviews are also possible with TanStack
          Router.
        </p>
      </article>
    </div>
  )
}
