import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Home,
  Info,
  LogIn,
  LogOut,
  Menu,
  Network,
  SquareFunction,
  StickyNote,
  UserCog,
  UserIcon,
  X
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/utils'

/* ========================================================================

======================================================================== */

export const BasicSidebar = () => {
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)

  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

  /* ======================
    handleServerLogout()
  ====================== */
  //* New.............................................

  // const _handleServerLogout = async () => {
  //   try {
  //     const { /* code, */ data, message, success } = await logout()

  //     if (success !== true) {
  //       const errorMessage = typeof message === 'string' ? message : 'Unable to log out.'
  //       toast.error(errorMessage, {
  //         // duration: Infinity
  //       })
  //       console.log('\nError from logout() server action')
  //       console.log(message)
  //       return
  //     }
  //     toast.success('Log out success.')
  //     console.log('\ndata from logout() server action')
  //     console.log(data)
  //   } catch (_err) {
  //     toast.error('Unable to log out.')
  //   }
  // }

  /* ======================
    handleClientLogout()
  ====================== */
  //* New.............................................

  const handleClientLogout = async () => {
    //^ const searchParams = new URLSearchParams(window.location.search)
    // Used to condiationally opt-out of callbackUrl in middleware.
    //^ searchParams.set('logout', 'true')
    // Use replaceState to update the URL without adding to the history stack
    //^ window.history.replaceState(null, '', `?${searchParams.toString()}`)

    try {
      const { /* data, */ error } = await authClient.signOut({
        //# Test that fetchOptions actually imply that signOut
        //# was good/bad and not just the fetch.
        //# On the other hand, the successContext/errorContext are not typed well.
        fetchOptions: {
          onSuccess: (_successContext) => {
            navigate({
              to: '/login'
            })
          },
          onError: (_errorContext) => {
            // ...
          }
        }
      })

      //# Switch to using the onSuccess and onError callbacks.
      // data and error are a discriminated union.
      if (error) {
        const errorMessage =
          typeof error.message === 'string'
            ? error.message
            : 'Unable to log out.'
        toast.error(errorMessage, {
          // duration: Infinity
        })
        // console.log('\nError from authClient.signOut()')
        // console.log(error)
        return
      }

      // Otherwise... (i.e., if data)
      toast.success('Log out success.')

      // console.log('\ndata from authClient.signOut()')
      // console.log(data)
    } catch (_err) {
      // console.log('\nError from authClient.signOut()')
      // console.log(err)
      toast.error('Unable to log out.')
    }
  }

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
            aria-label='Close menu'
            onClick={() => setIsOpen(false)}
            className='hover:bg-accent rounded-lg p-1 hover:cursor-pointer'
            type='button'
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
      'flex items-center gap-3 p-3 rounded-lg bg-primary/50 hover:bg-primary/50 mb-2 text-white '

    return (
      <nav className='flex-1 overflow-y-auto p-4'>
        {/*  See Navigation Guide for comprehensive overview of Link props, etc.
        https://tanstack.com/router/v1/docs/guide/navigation */}
        <Link
          to='/'
          onClick={() => setIsOpen(false)}
          // ⚠️ Gotcha: While this may work in some cases, it's always better to use inactiveProps
          // in conjunction with activeProps. Otherwise, you can run into Tailwind conflicts.
          // ❌ className={linkClassName}
          inactiveProps={{
            className: linkClassName
          }}
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
            type='button'
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

        {/* 
        //# This is temporary... Eventually, they will be wrapped in SignedOut/SignedIn
        */}

        <Link
          to='/user'
          onClick={() => setIsOpen(false)}
          className={linkClassName}
          activeProps={{
            className: activeClassName
          }}
        >
          <UserIcon size={20} />
          <span className='font-medium'>User</span>
        </Link>

        <Link
          to='/admin'
          onClick={() => setIsOpen(false)}
          className={linkClassName}
          activeProps={{
            className: activeClassName
          }}
        >
          <UserCog size={20} />
          <span className='font-medium'>Admin</span>
        </Link>

        <Link
          to='/login'
          onClick={() => setIsOpen(false)}
          className={linkClassName}
          activeProps={{
            className: activeClassName
          }}
        >
          <LogIn size={20} />
          <span className='font-medium'>Sign In</span>
        </Link>

        <button
          onClick={() => {
            handleClientLogout()
            setIsOpen(false)
          }}
          className={linkClassName}
          style={{ width: '100%' }}
          type='button'
        >
          <LogOut />
          <span className='font-medium'>Sign Out</span>
        </button>
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
        type='button'
      >
        <Menu size={24} />
      </button>

      {renderSideMenu()}
    </>
  )
}
