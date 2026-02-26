import { CollapsibleRoot } from './CollapsibleRoot'
import { CollapsibleTrigger } from './CollapsibleTrigger'
import { CollapsiblePanel } from './CollapsiblePanel'
import { CollapsibleContent } from './CollapsibleContent'

import type { CollapsibleRootProps } from './CollapsibleRoot'
import type { CollapsibleTriggerProps } from './CollapsibleTrigger'
import type { CollapsiblePanelProps } from './CollapsiblePanel'
import type { CollapsibleContentProps } from './CollapsibleContent'

export type CollapsiblePanelChildren = CollapsiblePanelProps['children']

export type CollapsibleProps = {
  children?: CollapsiblePanelChildren
  useCollapsibleContent?: boolean
  collapsibleRootProps?: CollapsibleRootProps
  collapsibleTriggerProps?: CollapsibleTriggerProps
  collapsiblePanelProps?: CollapsiblePanelProps
  collapsibleContentProps?: CollapsibleContentProps
}

/* ========================================================================

======================================================================== */

export const Collapsible = ({
  children,
  useCollapsibleContent = true,
  collapsibleRootProps = {},
  collapsibleTriggerProps = {},
  collapsiblePanelProps = {},
  collapsibleContentProps = {}
}: CollapsibleProps) => {
  children =
    children ||
    collapsiblePanelProps.children ||
    collapsibleContentProps.children

  /* ======================
  renderCollapsiblePanel()
  ====================== */

  const renderCollapsiblePanel = () => {
    // Rather than returning null, we could fallback to  'No Content' JSX inside of CollapsiblePanel.
    if (!children) return null

    if (!useCollapsibleContent) {
      return <CollapsiblePanel {...collapsiblePanelProps} children={children} />
    }

    return (
      <CollapsiblePanel
        {...collapsiblePanelProps}
        children={
          <CollapsibleContent
            {...collapsibleContentProps}
            children={children}
          />
        }
      />
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <CollapsibleRoot {...collapsibleRootProps}>
      <CollapsibleTrigger {...collapsibleTriggerProps} />
      {renderCollapsiblePanel()}
    </CollapsibleRoot>
  )
}
