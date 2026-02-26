import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '../Button'
import type { FileRouteTypes } from '@/routeTree.gen'
import type { ButtonProps } from '../Button'

type BackButtonProps =
  | (ButtonProps & { nullNoBack?: boolean; defaultBack?: never })
  | (ButtonProps & { defaultBack?: FileRouteTypes['to']; nullNoBack?: never })

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   <BackButton
//     className='mx-auto my-12 flex min-w-[120px] rounded-full'
//     // leftSection={null}
//     nullNoBack
//     // defaultBack='/'
//     onClick={(e) => {
//       const target = e.target as HTMLButtonElement
//       console.log(target.tagName)
//     }}
//     size='sm'
//     variant='success'
//   >Back</BackButton>
//
// This component is used in the NotFoundComponent.
//
///////////////////////////////////////////////////////////////////////////

export const BackButton = ({
  children,
  defaultBack,
  nullNoBack = false,
  onClick,
  ...otherProps
}: BackButtonProps) => {
  const navigate = useNavigate()
  const router = useRouter()
  const canGoBack = router.history.canGoBack()

  /* ======================
        handleClick()
  ====================== */

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()

    if (canGoBack) {
      onClick?.(e as any)
      router.history.back()
    } else if (defaultBack) {
      onClick?.(e as any)
      navigate({ to: defaultBack })
    }
  }

  /* ======================
          return 
  ====================== */

  if (nullNoBack && !canGoBack) {
    return null
  }

  return (
    <Button
      leftSection={<CircleArrowLeft />}
      onClick={handleClick}
      {...otherProps}
    >
      {children}
    </Button>
  )
}
