import { /* lighten, */ darken } from 'polished'

/* ========================================================================
      
======================================================================== */

export const LightenDarkenDemo = () => {
  /* ======================
        handleDarken()
  ====================== */

  const handleDarken = (e: any) => {
    const self = e.target
    if (!(self instanceof HTMLElement)) {
      return
    }

    const originalColor = window.getComputedStyle(self).backgroundColor // "rgb(50, 205, 50)"
    const darkenedColor = darken(0.0125, originalColor)
    self.style.backgroundColor = darkenedColor
  }

  /* ======================
      handleUndarken()
  ====================== */

  const handleUndarken = (e: any) => {
    const self = e.target
    if (!(self instanceof HTMLElement)) {
      return
    }
    self.style.backgroundColor = ''
  }

  /* ======================
          return
  ====================== */

  return (
    <div
      // active:bg-green-600 is too dark!!!
      className={`mx-auto mb-6 block h-32 w-32 rounded-lg border border-[rgba(0,0,0,0.25)] bg-green-500 shadow-[rgba(0,0,0,0.24)_0px_3px_8px]`}
      onPointerDown={handleDarken}
      onPointerUp={handleUndarken}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleDarken(e)
        }
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          handleUndarken(e)
        }
      }}
      tabIndex={0}
      role='button'
    />
  )
}
