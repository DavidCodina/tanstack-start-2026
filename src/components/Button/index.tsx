import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { buttonVariants } from './buttonVariants'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    leftSection?: React.ReactNode
    rightSection?: React.ReactNode
    loading?: boolean
    loadingStyle?: React.CSSProperties
    loadingClassName?: string
    loader?: React.ReactNode
    isIcon?: boolean
  }

// The ButtonOnClickEvent is essentiallly this, but it's better to derive it dynamically.
// type ButtonOnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent> & {
//   preventBaseUIHandler: () => void
//   readonly baseUIHandlerPrevented?: boolean
// }

type OnClick = ButtonPrimitive.Props['onClick']
export type ButtonOnClickEvent = Parameters<NonNullable<OnClick>>[0]

/* ========================================================================
                                    Button
======================================================================== */

function Button({
  children,
  className = '',
  disabled,
  focusableWhenDisabled,
  isIcon = false,
  leftSection = null,
  loader = null,
  loading = false,
  loadingClassName = '',
  loadingStyle = {},
  nativeButton,
  render,
  rightSection = null,
  size,
  style = {},
  variant,
  ...otherProps
}: ButtonProps) {
  // Quality of life: Assume nativeButton = false when
  // render is passed, but nativeButton is omitted.
  if (render && typeof nativeButton !== 'boolean') {
    nativeButton = false
  }

  /* ======================
      renderLoader()
  ====================== */

  const renderLoader = () => {
    if (!loading) {
      return null
    }

    if (loader) {
      return loader
    }

    // <Loader2 className='animate-spin' />
    return (
      <svg
        // Adjust color and size here as needed.
        className={cn('block animate-spin', loadingClassName)}
        fill='none'
        viewBox='0 0 24 24'
        style={loadingStyle}
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        ></circle>

        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        ></path>
      </svg>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <ButtonPrimitive
      data-slot='button'
      {...otherProps}
      ///////////////////////////////////////////////////////////////////////////
      //
      // Can also be a function:
      //
      // In Base UI, className can be a function. However, if you pass the function
      // directly to cn(), it won't work. This will be a common theme with Base UI
      // components.
      //
      ///////////////////////////////////////////////////////////////////////////
      className={(buttonState) => {
        if (typeof className === 'function') {
          className = className(buttonState) || ''
        }

        return cn(
          ///////////////////////////////////////////////////////////////////////////
          //
          //
          // The issue with icon only implementations is that normally,
          // the button's line-height of 1.5 would intrinsically add to
          // the overall height of the button. However, when the button
          // is ONLY an icon, this doesn't happen. Assuming, the icon is
          // 1em in height and font-size is 16px, then the button would lose
          // 4px top and bottom height. However, the <svg> icon is actually
          // given 1.25em in height, which means it's losing only 2px top
          // and bottom height. The button's normal vertical padding is 0.25em.
          // To correct for the loss in line-height, we need to add 2px top and bottom
          // to the padding (i.e., 0.25em + 0.125em = 0.375em).
          //
          // ⚠️ Note: The precise sizes of the buttons that use the same size prop value
          // will have slightly different heights when text vs SVG. This is a browser subpixel
          // rendering quirk, not a calculation error!
          //
          // Button heights by size with text: <Button>Click Me</Button>
          //   xs: 25.0955px
          //   sm: 29.1059px
          //   md: 33.0903px
          //   lg: 37.1094px
          //   xl: 41.1111px
          //
          // Button heeights by size with SVG: <Button isIcon><TextAlignStart /></Button>
          //   xs: 25.0955px
          //   sm: 29.0885px // ❌ 29.1059px
          //   md: 33.1076px // ❌ 33.0903px
          //   lg: 37.092px  // ❌ 37.1094px
          //   xl: 41.1111px
          //
          //
          ///////////////////////////////////////////////////////////////////////////
          buttonVariants({ variant, size }),
          {
            'p-[0.375em]': isIcon
          },
          className
        )
      }}
      // When disabled, all functionality is removed, even when rendering as a
      // different element.
      disabled={disabled || loading}
      focusableWhenDisabled={focusableWhenDisabled}
      // When nativeButton={false}
      // - type="button" goes away and is replaced by role="button"
      // - Base UI adds keyboard event handlers to make Space and Enter trigger clicks.
      // - It ensures proper focus management
      nativeButton={nativeButton}
      ///////////////////////////////////////////////////////////////////////////
      //
      // render seems to have two variants:
      //
      //  1. An implementation reminiscent of Radix asChild:
      //     Presumably, the closing tag triggers Base UI to
      //     completely ignore children.
      //
      //   <Button
      //     render={<Link to='/test'>Test Page</Link>}
      //     nativeButton={false}
      //   />
      //
      // 2. A more conventional polymorphic implementation:
      //
      //   <Button render={<div />} nativeButton={false}>Click Me</Button>
      //
      ///////////////////////////////////////////////////////////////////////////
      render={render}
      ///////////////////////////////////////////////////////////////////////////
      //
      // Can also be a function:
      //
      //   style={(buttonState) => {
      //     return buttonState.disabled ? { outline: '2px dashed deeppink' } : {}
      //   }}
      /////////////////////////////////////////////////////////////////////////////
      style={style}
    >
      {loading && !isIcon ? renderLoader() : leftSection}

      {loading && isIcon ? renderLoader() : children}

      {rightSection}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants, type ButtonProps }
