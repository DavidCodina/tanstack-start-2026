import { ScrollAreaRoot } from './ScrollAreaRoot'
import { ScrollAreaViewport } from './ScrollAreaViewport'
import { ScrollAreaContent } from './ScrollAreaContent'
import { ScrollAreaScrollbar } from './ScrollAreaScrollbar'
import { ScrollAreaThumb } from './ScrollAreaThumb'
import { ScrollAreaCorner } from './ScrollAreaCorner'

import type { ScrollAreaRootProps } from './ScrollAreaRoot'
import type { ScrollAreaViewportProps } from './ScrollAreaViewport'
import type { ScrollAreaContentProps } from './ScrollAreaContent'
import type { ScrollAreaScrollbarProps } from './ScrollAreaScrollbar'
import type { ScrollAreaThumbProps } from './ScrollAreaThumb'
import type { ScrollAreaCornerProps } from './ScrollAreaCorner'

type ScrollAreaContentChildren = ScrollAreaContentProps['children']

export type ScrollAreaProps = {
  children?: ScrollAreaContentChildren
  showVerticalScrollbar?: boolean
  showHorizontalScrollbar?: boolean
  scrollAreaRootProps?: ScrollAreaRootProps
  scrollAreaViewportProps?: ScrollAreaViewportProps
  scrollAreaContentProps?: ScrollAreaContentProps
  verticalScrollbarProps?: Omit<ScrollAreaScrollbarProps, 'orientation'>
  horizontalScrollbarProps?: Omit<ScrollAreaScrollbarProps, 'orientation'>
  scrollAreaThumbProps?: ScrollAreaThumbProps
  scrollAreaCornerProps?: ScrollAreaCornerProps
}

/* ========================================================================

======================================================================== */

export const ScrollArea = ({
  children,
  showVerticalScrollbar = true,
  showHorizontalScrollbar = true,
  scrollAreaRootProps = {},
  scrollAreaViewportProps = {},
  scrollAreaContentProps = {},
  verticalScrollbarProps = {},
  horizontalScrollbarProps = {},
  scrollAreaThumbProps = {},
  scrollAreaCornerProps = {}
}: ScrollAreaProps) => {
  return (
    <ScrollAreaRoot {...scrollAreaRootProps}>
      <ScrollAreaViewport {...scrollAreaViewportProps}>
        <ScrollAreaContent children={children} {...scrollAreaContentProps} />
      </ScrollAreaViewport>

      {showVerticalScrollbar && (
        <ScrollAreaScrollbar
          {...verticalScrollbarProps}
          orientation='vertical' // Default
          children={<ScrollAreaThumb {...scrollAreaThumbProps} />}
        />
      )}

      {showHorizontalScrollbar && (
        <ScrollAreaScrollbar
          {...horizontalScrollbarProps}
          orientation='horizontal'
          children={<ScrollAreaThumb {...scrollAreaThumbProps} />}
        />
      )}

      <ScrollAreaCorner {...scrollAreaCornerProps} />
    </ScrollAreaRoot>
  )
}
