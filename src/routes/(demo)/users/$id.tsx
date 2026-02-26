import { createFileRoute, notFound } from '@tanstack/react-router'
import { TriangleAlert, User } from 'lucide-react'

import { Page, PageContainer } from '@/components'
import { getUser } from '@/server-functions'
import { codes } from '@/utils'

/* ======================

====================== */

export const Route = createFileRoute('/(demo)/users/$id')({
  component: PageUser,
  loader: async (ctx) => {
    const { params } = ctx

    try {
      const getUserResponse = await getUser({
        data: { id: params.id }
      })
      if (
        getUserResponse.code === codes.NOT_FOUND ||
        getUserResponse.code === codes.BAD_REQUEST
      ) {
        // 👎🏻 Tanstack Router seems to be throwing an object literal: { isNotFound: true }
        throw notFound()
      }

      return getUserResponse
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'isNotFound' in err &&
        err.isNotFound === true
      ) {
        // Rethrow if the error is from throwing notFound()
        throw err
      }

      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: 'fail',
        success: false
      }
    }
  },

  head: async (ctx) => {
    const { loaderData /* , params, match, matches */ } = ctx
    const data = loaderData?.data

    if (!data) {
      return {}
    }

    return {
      meta: [
        { title: data.username },
        {
          name: 'description',
          content: `The user page for ${data?.username}`
        },
        // This renders when you copy the URL and paste it into Messages app, etc.
        { name: 'image', content: '/tanstack-circle-logo.png' }
      ]
    }
  },

  notFoundComponent: () => {
    return (
      <Page>
        <PageContainer>
          <h1 className='text-center text-6xl font-thin tracking-tight uppercase'>
            <TriangleAlert className='text-destructive inline size-[1em]' /> Not
            Found!
          </h1>

          <p className='mt-12 text-center text-2xl'>
            Whoops! It looks like that user doesn't exist.
          </p>
        </PageContainer>
      </Page>
    )
  }
})

/* ========================================================================

======================================================================== */

function PageUser() {
  const { id } = Route.useParams()
  const loaderData = Route.useLoaderData()

  /* ======================
          return 
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Gotcha: If you throw notFound() from here, it will not trigger the
  // notFoundComponent defined in createFileRoute options. Instead, it will
  // trigger whatever notFoundComponent is higher up, which in this case is
  // in __root.tsx: notFoundComponent: () =>  <NotFoundComponent />
  //
  // if (loaderData.code === codes.NOT_FOUND) { throw notFound() }
  //
  ///////////////////////////////////////////////////////////////////////////

  return (
    <Page>
      <PageContainer>
        <h1 className='text-center text-6xl font-thin tracking-tight uppercase'>
          <User className='inline size-[1em]' /> User
        </h1>

        <h5 className='mb-6 text-center text-xl font-thin tracking-tight uppercase'>
          {id}
        </h5>

        <pre className='bg-card mx-auto mb-6 max-w-[500px] overflow-scroll rounded-lg border p-4 text-sm shadow'>
          {JSON.stringify(loaderData, null, 2)}
        </pre>
      </PageContainer>
    </Page>
  )
}
