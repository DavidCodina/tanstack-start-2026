import { AutocompletePortal } from './AutocompletePortal'
import { AutocompletePositioner } from './AutocompletePositioner'
import { AutocompletePopup } from './AutocompletePopup'
import { AutocompleteEmpty } from './AutocompleteEmpty'
import { AutocompleteList } from './AutocompleteList'

import type { AutocompletePortalProps } from './AutocompletePortal'
import type { AutocompletePositionerProps } from './AutocompletePositioner'
import type { AutocompletePopupProps } from './AutocompletePopup'
import type { AutocompleteEmptyProps } from './AutocompleteEmpty'
import type { AutocompleteListProps } from './AutocompleteList'

export type AutocompleteMenuProps = {
  autocompletePortalProps?: AutocompletePortalProps
  autocompletePositionerProps?: AutocompletePositionerProps
  autocompletePopupProps?: AutocompletePopupProps
  autocompleteEmptyProps?: AutocompleteEmptyProps
  autocompleteListProps?: AutocompleteListProps
}

/* ========================================================================

======================================================================== */

export const AutocompleteMenu = ({
  autocompletePortalProps = {},
  autocompletePositionerProps = {},
  autocompletePopupProps = {},
  autocompleteEmptyProps = {},
  autocompleteListProps = {}
}: AutocompleteMenuProps) => {
  return (
    <AutocompletePortal {...autocompletePortalProps}>
      <AutocompletePositioner {...autocompletePositionerProps}>
        <AutocompletePopup {...autocompletePopupProps}>
          <AutocompleteEmpty {...autocompleteEmptyProps} />
          <AutocompleteList {...autocompleteListProps} />
        </AutocompletePopup>
      </AutocompletePositioner>
    </AutocompletePortal>
  )
}
