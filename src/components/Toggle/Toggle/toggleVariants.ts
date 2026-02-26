import { cva } from 'class-variance-authority'

const SVG_MIXIN = `[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.25em]`
const BUTTON_BORDER_MIXIN = `data-pressed:border-[rgba(0,0,0,0.3)] dark:data-pressed:border-[rgba(255,255,255,0.35)]`
const DISABLED_MIXIN = `data-disabled:pointer-events-none data-disabled:opacity-50`

const baseClasses = `
inline-flex items-center justify-center gap-[0.5em] shrink-0
whitespace-nowrap font-semibold
px-[0.5em] py-[0.25em]
border 
cursor-pointer select-none
focus-visible:ring-[3px]
focus-visible:z-1
outline-none 
${BUTTON_BORDER_MIXIN}
${SVG_MIXIN}
${DISABLED_MIXIN}
`

/* ========================================================================

======================================================================== */

export const toggleVariants = cva(baseClasses, {
  variants: {
    variant: {
      /* ======================
            Custom Colors
      ====================== */

      primary: `
      text-primary
      border-primary
      data-pressed:bg-primary
      data-pressed:text-primary-foreground
      not-data-pressed:hover:text-[oklch(from_var(--color-primary)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-primary)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-primary/10
      focus-visible:ring-primary/50
      `,

      secondary: `
      text-secondary
      border-secondary
      data-pressed:bg-secondary
      data-pressed:text-secondary-foreground
      not-data-pressed:hover:text-[oklch(from_var(--color-secondary)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-secondary)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-secondary/10
      focus-visible:ring-secondary/50
      `,

      success: `
      text-success
      border-success
      data-pressed:bg-success
      data-pressed:text-success-foreground
      not-data-pressed:hover:text-[oklch(from_var(--color-success)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-success)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-success/10
      focus-visible:ring-success/50
      `,

      info: `
      text-info
      border-info
      data-pressed:bg-info
      data-pressed:text-info-foreground
      not-data-pressed:hover:text-[oklch(from_var(--color-info)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-info)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-info/10
      focus-visible:ring-info/50
      `,

      warning: `
      text-warning
      border-warning
      data-pressed:bg-warning
      data-pressed:text-warning-foreground
      not-data-pressed:hover:text-[oklch(from_var(--color-warning)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-warning)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-warning/10
      focus-visible:ring-warning/50
      `,

      destructive: `
      text-destructive
      border-destructive
      data-pressed:bg-destructive
      data-pressed:text-destructive-foreground
      not-data-pressed:hover:text-[oklch(from_var(--color-destructive)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-destructive)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-destructive/10
      focus-visible:ring-destructive/50
      `,

      /* ======================
          Tailwind Colors
      ====================== */

      red: `
      text-red-500
      border-red-500
      data-pressed:bg-red-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-red-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-red-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-red-500/10
      focus-visible:ring-red-500/50
      `,

      orange: `
      text-orange-500
      border-orange-500
      data-pressed:bg-orange-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-orange-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-orange-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-orange-500/10
      focus-visible:ring-orange-500/50
      `,

      amber: `
      text-amber-500
      border-amber-500
      data-pressed:bg-amber-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-amber-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-amber-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-amber-500/10
      focus-visible:ring-amber-500/50
      `,

      yellow: `
      text-yellow-500
      border-yellow-500
      data-pressed:bg-yellow-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-yellow-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-yellow-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-yellow-500/10
      focus-visible:ring-yellow-500/50
      `,

      lime: `
      text-lime-500
      border-lime-500
      data-pressed:bg-lime-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-lime-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-lime-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-lime-500/10
      focus-visible:ring-lime-500/50
      `,

      green: `
      text-green-500
      border-green-500
      data-pressed:bg-green-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-green-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-green-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-green-500/10
      focus-visible:ring-green-500/50
      `,

      emerald: `
      text-emerald-500
      border-emerald-500
      data-pressed:bg-emerald-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-emerald-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-emerald-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-emerald-500/10
      focus-visible:ring-emerald-500/50
      `,

      teal: `
      text-teal-500
      border-teal-500
      data-pressed:bg-teal-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-teal-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-teal-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-teal-500/10
      focus-visible:ring-teal-500/50
      `,

      cyan: `
      text-cyan-500
      border-cyan-500
      data-pressed:bg-cyan-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-cyan-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-cyan-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-cyan-500/10
      focus-visible:ring-cyan-500/50
      `,

      sky: `
      text-sky-500
      border-sky-500
      data-pressed:bg-sky-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-sky-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-sky-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-sky-500/10
      focus-visible:ring-sky-500/50
      `,

      blue: `
      text-blue-500
      border-blue-500
      data-pressed:bg-blue-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-blue-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-blue-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-blue-500/10
      focus-visible:ring-blue-500/50
      `,

      indigo: `
      text-indigo-500
      border-indigo-500
      data-pressed:bg-indigo-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-indigo-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-indigo-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-indigo-500/10
      focus-visible:ring-indigo-500/50
      `,

      violet: `
      text-violet-500
      border-violet-500
      data-pressed:bg-violet-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-violet-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-violet-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-violet-500/10
      focus-visible:ring-violet-500/50
      `,

      purple: `
      text-purple-500
      border-purple-500
      data-pressed:bg-purple-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-purple-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-purple-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-purple-500/10
      focus-visible:ring-purple-500/50
      `,

      fuchsia: `
      text-fuchsia-500
      border-fuchsia-500
      data-pressed:bg-fuchsia-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-fuchsia-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-fuchsia-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-fuchsia-500/10
      focus-visible:ring-fuchsia-500/50
      `,

      pink: `
      text-pink-500
      border-pink-500
      data-pressed:bg-pink-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-pink-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-pink-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-pink-500/10
      focus-visible:ring-pink-500/50
      `,

      rose: `
      text-rose-500
      border-rose-500
      data-pressed:bg-rose-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-rose-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-rose-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-rose-500/10
      focus-visible:ring-rose-500/50
      `,

      slate: `
      text-slate-500
      border-slate-500
      data-pressed:bg-slate-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-slate-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-slate-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-slate-500/10
      focus-visible:ring-slate-500/50
      `,

      gray: `
      text-gray-500
      border-gray-500
      data-pressed:bg-gray-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-gray-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-gray-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-gray-500/10
      focus-visible:ring-gray-500/50
      `,

      zinc: `
      text-zinc-500
      border-zinc-500
      data-pressed:bg-zinc-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-zinc-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-zinc-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-zinc-500/10
      focus-visible:ring-zinc-500/50
      `,

      neutral: `
      text-neutral-500
      border-neutral-500
      data-pressed:bg-neutral-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-neutral-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-neutral-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-neutral-500/10
      focus-visible:ring-neutral-500/50
      `,

      stone: `
      text-stone-500
      border-stone-500
      data-pressed:bg-stone-500
      data-pressed:text-white
      not-data-pressed:hover:text-[oklch(from_var(--color-stone-500)_calc(l_-_0.1)_c_h)]
      not-data-pressed:dark:hover:text-[oklch(from_var(--color-stone-500)_calc(l_+_0.1)_c_h)]
      not-data-pressed:hover:bg-stone-500/10
      focus-visible:ring-stone-500/50
      `
    },

    size: {
      xs: 'text-xs leading-[1.5]',
      sm: 'text-sm leading-[1.5]',
      md: 'text-base leading-[1.5]',
      lg: 'text-lg leading-[1.5]',
      xl: 'text-xl leading-[1.5]'
    }
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
})
