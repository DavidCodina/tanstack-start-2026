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
    <div className='text-primary text-2xl font-bold'>
      I'm the bonus <code className='text-pink-500'>{`<Outlet/>`}</code>{' '}
      content...
    </div>
  )
}
