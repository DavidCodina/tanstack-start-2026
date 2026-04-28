import {
  createFileRoute
  // getRouteApi,
  // notFound
  // useSearch
} from '@tanstack/react-router'
import { Option } from 'lucide-react'

import { Page, PageContainer } from '@/components'

/* ======================

====================== */

export const Route = createFileRoute('/(demo)/optional/{-$id}')({
  component: PageOptional,
  // validateSearch: (search: Record<string, unknown>) => search,
  loader: async (_ctx) => {
    return {}
  }
})

/* ========================================================================

======================================================================== */

function PageOptional() {
  const { id } = Route.useParams()

  /* ======================
          return
  ====================== */

  return (
    <Page>
      <PageContainer>
        <h1
          className='text-primary mb-12 text-center text-7xl'
          style={{
            fontFamily: 'Chakra Petch',
            fontWeight: 300,
            letterSpacing: '2vw'
          }}
        >
          <Option strokeWidth={1} className='mr-2 inline size-[1em]' />
          _OPTIONAL{' '}
          {id && typeof id === 'string' && (
            <>
              <div className='text-3xl text-pink-500'>{id}</div>
            </>
          )}
        </h1>

        <article className='mb-6 space-y-6 leading-loose'>
          <p>
            This page simply demonstrates the optional{' '}
            <code className='text-pink-500'>{`{-$id}.tsx`}</code> syntax. With
            this routing pattern, the user can navigate to{' '}
            <code className='text-pink-500'>
              http://localhost:3000/optional
            </code>{' '}
            or{' '}
            <code className='text-pink-500'>
              http://localhost:3000/optional/abc123
            </code>
            . In either case, the route will still work. In this way, the path
            parameter behaves kind of like a search paramete to the extent that
            it's just a piece of data tacked onto the end of the path as an
            additional segment.
          </p>

          <p>
            It's somewhat unclear when to use optional path parameters instead
            of a search paramter.
          </p>

          <p className='mx-18 leading-relaxed'>
            <strong className='text-primary'>Short answer:</strong> Use optional
            path parameters when the value is{' '}
            <strong className='text-primary'>
              part of the resource identity
            </strong>{' '}
            or you want a clean, hierarchical, human-readable URL (e.g.,{' '}
            <code className='text-pink-500'>/posts/slug</code> or{' '}
            <code className='text-pink-500'>/reports/2026/03</code>
            ); use query parameters when the value is a filter, modifier, or
            truly optional UI state (sorting, pagination, search). Optional path
            params are best at the end of the path and for UX/permalink reasons;
            query params are better for combinable, multi-value, or non-resource
            data.
          </p>

          <p className='mx-18 leading-relaxed'>
            <strong className='text-primary'>When not to use it:</strong> If the
            value is a filter, sort order, pagination cursor, or any parameter
            that can be combined with others, use query parameters — they're
            designed for optional, composable modifiers
          </p>

          <p>
            In the previous example,{' '}
            <code className='text-pink-500'>/reports/2026/03</code> was used.
            Let's say that both <code className='text-pink-500'>2026</code> and{' '}
            <code className='text-pink-500'>03</code> are optional. Presumably,
            if we went to <code className='text-pink-500'>/reports</code> we'd
            get <strong className='text-primary'>all</strong> reports, but if we
            went to <code className='text-pink-500'>/reports/2026</code> we'd
            get just those reports from 2026. Moreover, if we went to{' '}
            <code className='text-pink-500'>/reports/2026/03</code>, we'd get
            just those reports for March. So{' '}
            <code className='text-pink-500'>2026</code> and{' '}
            <code className='text-pink-500'>03</code> are part of the resource
            identity, but this is also arguably a case of filtering. Here's AI
            again:
          </p>

          <p className='mx-18 leading-relaxed'>
            <strong className='text-primary'>Core Idea:</strong> Resource
            identity vs. representation modifiers is the guiding distinction.
            Path segments are best when the value names a resource or a natural
            sub-resource (e.g., a year archive, a month archive) so the URL
            itself is the canonical locator. Query parameters are best when the
            value modifies how a collection is presented (filters, sorts,
            pagination) and can be combined arbitrarily. Use path params for
            clean, shareable URLs; use query params when you need many optional,
            combinable, or client-driven filters (search params scale better in
            this case).
          </p>

          <p>
            Here's how I would think of it. Let's pretend that the paths are not
            optional, and each additional segment points to a different page. In
            that case, it's easy to understand the conceptual justification for
            each hierarchical path segments. The only difference here is that
            we've decided to condense the logic into a single page because
            ultimately the API request and UI rendering will entail the same
            processes.
          </p>

          <p>
            Is this successive "narrowing-down" a case of filtering? In a
            general sense yes, but so are separate items list and items detail
            pages. However, it's also hierarchical, predictable in nature, and
            part of the core resource identity. Moreover, the so-called
            filtering is not client/user-driven, nor composed of a myriad of
            various permutations (i.e. predictable and limited).
          </p>

          <p>
            Optional path parameters are very practical when you have similar
            logic for handling hierarichally constrained data that you want to
            consolidate into a single page. In such cases, search params could
            also be used, but conceptually, they're the wrong tool for the job.
          </p>

          <p>
            It's also important to note that with query search params, Tanstack
            start requires you to explicitly expose them using{' '}
            <code className='text-pink-500'>loaderDeps</code>. This is necessary
            in order to differentate cache keys. However, when using optional
            path parameters, the loader <em>may</em> already use cache keys
            relative to the path parameters. This would make the overall caching
            process just work implicitly.
          </p>

          <p>
            <strong className='text-primary'>Note:</strong> In the previous
            reports example, it probably makes more sense to use a catch-all
            route. However, in some cases you may have optional and non-optional
            segments intermixed (i.e.,{' '}
            <code className='text-pink-500'>{`{-$locale}/archive/{-$year}/{-$month}/{-$day}`}</code>
            , which is where optional path parameters really shines. )
          </p>
        </article>
      </PageContainer>
    </Page>
  )
}
