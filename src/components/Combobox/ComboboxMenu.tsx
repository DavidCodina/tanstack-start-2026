import { ComboboxPortal } from './ComboboxPortal'
import { ComboboxPositioner } from './ComboboxPositioner'
import { ComboboxPopup } from './ComboboxPopup'
import { ComboboxEmpty } from './ComboboxEmpty'
import { ComboboxList } from './ComboboxList'

import type { ComboboxPortalProps } from './ComboboxPortal'
import type { ComboboxPositionerProps } from './ComboboxPositioner'
import type { ComboboxPopupProps } from './ComboboxPopup'
import type { ComboboxEmptyProps } from './ComboboxEmpty'
import type { ComboboxListProps } from './ComboboxList'

export type ComboboxMenuProps = {
  comboboxPortalProps?: ComboboxPortalProps
  comboboxPositionerProps?: ComboboxPositionerProps
  comboboxPopupProps?: ComboboxPopupProps
  comboboxEmptyProps?: ComboboxEmptyProps
  comboboxListProps?: ComboboxListProps
}

/* ========================================================================

======================================================================== */

export const ComboboxMenu = ({
  comboboxPortalProps = {},
  comboboxPositionerProps = {},
  comboboxPopupProps = {},
  comboboxEmptyProps = {},
  comboboxListProps = {}
}: ComboboxMenuProps) => {
  /* ======================
          return
  ====================== */

  return (
    <ComboboxPortal {...comboboxPortalProps}>
      <ComboboxPositioner {...comboboxPositionerProps}>
        <ComboboxPopup {...comboboxPopupProps}>
          <ComboboxEmpty {...comboboxEmptyProps} />
          <ComboboxList {...comboboxListProps} />
        </ComboboxPopup>
      </ComboboxPositioner>
    </ComboboxPortal>
  )
}
