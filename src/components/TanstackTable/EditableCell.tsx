import * as React from 'react'
// import { cn } from '@/utils'

const FIELD_BOX_SHADOW_MIXIN = `shadow-xs`

const FIELD_FOCUS_MIXIN = `
focus-visible:shadow-none
focus-visible:border-(--table-border-color)
focus-visible:ring-[3px]
focus-visible:ring-(--table-border-color)/40
`

const FIELD_DISABLED_MIXIN = `
disabled:pointer-events-none
disabled:border-(--table-disabled-color)
disabled:placeholder:text-(--table-disabled-color)
disabled:opacity-65
`

// Use flex-1 and not w-full
const baseClasses = `
flex flex-1 bg-card
min-w-[180px]
px-[0.5em] py-[0.25em]
text-base leading-[1.5] font-normal
rounded-[0.375em]
border border-(--table-border-color) outline-none
placeholder:text-muted-foreground
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_DISABLED_MIXIN}
`

type EditableCellProps = any

/* ========================================================================

======================================================================== */

export const EditableCell = (_props: EditableCellProps) => {
  const [value, setValue] = React.useState('')

  /* ======================
          return
  ====================== */

  return (
    <input
      className={baseClasses}
      onChange={(e) => setValue(e.target.value)}
      value={value}
    />
  )
}
