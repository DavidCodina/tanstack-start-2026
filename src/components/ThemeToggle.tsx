import { Computer, Moon, Sun } from 'lucide-react'
import type { UserTheme } from '@/contexts'
import { useTheme } from '@/contexts'

import { cn } from '@/utils'

type ThemeToggleProps = Omit<React.ComponentProps<'button'>, 'children'>

const themeConfig: Record<UserTheme, { icon: React.ReactNode; label: string }> =
  {
    light: { icon: <Sun />, label: 'Light Theme' },
    dark: { icon: <Moon />, label: 'Dark Theme' },
    system: { icon: <Computer />, label: 'System Theme' }
  }

const baseClasses = `cursor-pointer`

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// See Dev Leonardo at 6:25 : https://www.youtube.com/watch?v=NoxvbjkyLAg
//
// Why not just do this?
//
// return (
//   <Button
//     {...otherProps}
//     className={cn(className)}
//     onClick={() => setTheme(getNextTheme())}
//   >
//     {userTheme === 'light' ? (
//       <span>
//         <span className='mr-2'>{themeConfig.light.icon}</span>
//         {themeConfig.light.label}
//       </span>
//     ) : userTheme === 'dark' ? (
//       <span>
//         <span className='mr-2'>{themeConfig.dark.icon}</span>
//         {themeConfig.dark.label}
//       </span>
//     ) : (
//       <span>
//         <span className='mr-2'>{themeConfig.system.icon}</span>
//         {themeConfig.system.label}
//       </span>
//     )}
//   </Button>
// )
//
// The problem is that if you refresh the page, you'll get FOUC.
// system -> light or system -> dark (assuming you're not on system).
// That's why you have to do the CSS/Tailwind approach.
//
///////////////////////////////////////////////////////////////////////////

export const ThemeToggle = ({ className, ...otherProps }: ThemeToggleProps) => {
  const { userTheme, setTheme } = useTheme()

  /* ======================
        getNextTheme()
  ====================== */

  const getNextTheme = () => {
    const themes = Object.keys(themeConfig) as UserTheme[]
    const currentIndex = themes.indexOf(userTheme)
    const nextIndex = (currentIndex + 1) % themes.length // Cycle through themes.
    const nextTheme = themes[nextIndex]

    return nextTheme
  }

  /* ======================
          return
  ====================== */
  // Note: light and system variants are defined in the mains .css file.
  // See here: https://github.com/Balastrong/start-theme-demo/blob/main/src/styles/app.css
  // @custom-variant light (&:is(.light *));
  // @custom-variant system (&:is(.system *));

  return (
    <button
      {...otherProps}
      className={cn(baseClasses, className)}
      onClick={() => setTheme(getNextTheme())}
    >
      <span className='not-system:light:inline hidden'>
        {themeConfig.light.icon}
        <span className='sr-only'>{themeConfig.light.label}</span>
      </span>

      <span className='not-system:dark:inline hidden'>
        {themeConfig.dark.icon}

        <span className='sr-only'>{themeConfig.dark.label}</span>
      </span>

      <span className='system:inline hidden'>
        {themeConfig.system.icon}
        <span className='sr-only'>{themeConfig.system.label}</span>
      </span>
    </button>
  )
}
