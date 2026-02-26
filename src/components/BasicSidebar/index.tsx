import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Home,
  Info,
  Menu,
  Network,
  SquareFunction,
  StickyNote,
  X
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

import { cn } from '@/utils'

/* ========================================================================

======================================================================== */

export const BasicSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

  /* ======================
    renderSideMenuHeader()
  ====================== */

  const renderSideMenuHeader = () => {
    return (
      <div className='flex items-center justify-between border-b px-4 py-2'>
        <Link to='/'>
          <h2 className='font-[Chakra_Petch] text-2xl leading-none'>_DEMO</h2>
        </Link>

        <div className='flex gap-0'>
          <ThemeToggle className='hover:bg-accent rounded-lg px-2 py-1 hover:cursor-pointer' />

          <button
            onClick={() => setIsOpen(false)}
            className='hover:bg-accent rounded-lg p-1 hover:cursor-pointer'
            aria-label='Close menu'
          >
            <X size={32} />
          </button>
        </div>
      </div>
    )
  }

  /* ======================
        renderNav()
  ====================== */

  const renderNav = () => {
    const linkClassName =
      'mb-2 flex items-center gap-3 rounded-lg p-3 hover:bg-accent'
    const activeClassName =
      'flex items-center gap-3 p-3 rounded-lg bg-primary/50 hover:bg-primary/50 mb-2 text-white'

    return (
      <nav className='flex-1 overflow-y-auto p-4'>
        <Link
          to='/'
          onClick={() => setIsOpen(false)}
          className={linkClassName}
          activeProps={{
            className: activeClassName
          }}
        >
          <Home size={20} />
          <span className='font-medium'>Home</span>
        </Link>

        <Link
          to='/test'
          // hash='testimonials'
          search={{
            name: 'Punkin Pie',
            isCool: 'maybe' as any
            // pageIndex: 3,
            // pagination: {
            //   page: 1,
            //   limit: 10
            // },
            // categories: ['electronics', 'gifts'],
            // sortBy: 'price',
            // desc: true
          }}
          activeOptions={{
            ///////////////////////////////////////////////////////////////////////////
            //
            // ⚠️ Gotcha: When we add a search param, then activeProps will NOT trigger for
            //
            //   - http://localhost:3000/test?name=David+Codina
            //   - http://localhost:3000/test
            //   - http://localhost:3000/test/1
            //
            // Otherwise, it would normally trigger for all of those URLs, which is kind of
            // what I'd expect in either case. In order to get that behavior back, do this:
            //
            ///////////////////////////////////////////////////////////////////////////
            includeSearch: false,

            // Conversely, if you ONLY want it to trigger activeProps for
            // http://localhost:3000/test then do this:
            // exact: true
            exact: false, // Default is exact:false
            includeHash: false // Default is includeHash:false
          }}
          onClick={() => setIsOpen(false)}
          className={linkClassName}
          activeProps={{
            className: activeClassName
          }}

          // https://tanstack.com/router/v1/docs/framework/react/api/router/ActiveLinkOptionsType#inactiveprops
          // inactiveProps={{}}
        >
          <FlaskConical size={20} />
          <span className='font-medium'>Test</span>
        </Link>

        {/* Demo Links Start */}

        {/* Demo Links Start */}

        <Link
          to='/todos'
          onClick={() => setIsOpen(false)}
          className={linkClassName}
          activeProps={{
            className: activeClassName
          }}
        >
          <SquareFunction size={20} />
          <span className='font-medium'>Todos</span>
        </Link>

        <Link
          to='/todos2'
          onClick={() => setIsOpen(false)}
          className={linkClassName}
          activeProps={{
            className: activeClassName
          }}
        >
          <SquareFunction size={20} />
          <span className='font-medium'>Todos 2</span>
        </Link>

        <Link
          to='/tanstack-query'
          onClick={() => setIsOpen(false)}
          className={linkClassName}
          activeProps={{
            className: activeClassName
          }}
        >
          <Network size={20} />
          <span className='font-medium'>TanStack Query</span>
        </Link>

        <Link
          to='/about'
          onClick={() => setIsOpen(false)}
          className={linkClassName}
          activeProps={{
            className: activeClassName
          }}
        >
          <Info size={20} />
          <span className='font-medium'>About</span>
        </Link>

        <Link
          to='/start/api-request'
          onClick={() => setIsOpen(false)}
          className={linkClassName}
          activeProps={{
            className: activeClassName
          }}
        >
          <Network size={20} />
          <span className='font-medium'>Start - API Request</span>
        </Link>

        <div className='flex flex-row justify-between'>
          <Link
            to='/start/ssr'
            onClick={() => setIsOpen(false)}
            className={cn(linkClassName, 'flex-1')}
            activeProps={{
              className: activeClassName
            }}
          >
            <StickyNote size={20} />
            <span className='font-medium'>Start - SSR Demos</span>
          </Link>
          <button
            className={linkClassName}
            onClick={() =>
              setGroupedExpanded((prev) => ({
                ...prev,
                StartSSRDemo: !prev.StartSSRDemo
              }))
            }
          >
            {groupedExpanded.StartSSRDemo ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>
        {groupedExpanded.StartSSRDemo && (
          <div className='ml-4 flex flex-col'>
            <Link
              to='/start/ssr/spa-mode'
              onClick={() => setIsOpen(false)}
              className={linkClassName}
              activeProps={{
                className: activeClassName
              }}
            >
              <StickyNote size={20} />
              <span className='font-medium'>SPA Mode</span>
            </Link>

            <Link
              to='/start/ssr/full-ssr'
              onClick={() => setIsOpen(false)}
              className={linkClassName}
              activeProps={{
                className: activeClassName
              }}
            >
              <StickyNote size={20} />
              <span className='font-medium'>Full SSR</span>
            </Link>

            <Link
              to='/start/ssr/data-only'
              onClick={() => setIsOpen(false)}
              className={linkClassName}
              activeProps={{
                className: activeClassName
              }}
            >
              <StickyNote size={20} />
              <span className='font-medium'>Data Only</span>
            </Link>
          </div>
        )}

        {/* Demo Links End */}
      </nav>
    )
  }

  /* ======================
      renderSideMenu()
  ====================== */

  const renderSideMenu = () => {
    return (
      <aside
        className={cn(
          'bg-card border-primary fixed top-0 left-0 z-50 flex h-full w-80 transform flex-col border-r transition-transform duration-300 ease-in-out',
          isOpen &&
            'shadow-[inset_2px_0px_8px_rgba(0,0,0,0.15)] dark:shadow-[inset_2px_0px_8px_rgba(0,0,0,0.85)]',

          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        // style={{ zIndex: 9999 }}
      >
        {renderSideMenuHeader()}

        {renderNav()}
      </aside>
    )
  }

  /* ======================
          return 
  ====================== */

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='hover:bg-accent absolute top-3 left-3 z-49 w-fit rounded-lg p-2 hover:cursor-pointer'
        aria-label='Open menu'
      >
        <Menu size={24} />
      </button>

      {renderSideMenu()}
    </>
  )
}
