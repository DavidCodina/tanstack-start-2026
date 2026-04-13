import * as React from 'react'

export type DropdownContextType = {
  items: React.RefObject<HTMLButtonElement>[] | undefined
  registerItem: (ref: React.RefObject<HTMLButtonElement>) => void
}

export const DropdownContext = React.createContext<DropdownContextType | null>(
  null
)

/* ========================================================================

======================================================================== */

export type ItemRefType = React.RefObject<HTMLButtonElement>

type DropdownProviderProps = {
  children: React.ReactNode
}

export const DropdownProvider = ({ children }: DropdownProviderProps) => {
  const [items, setItems] = React.useState<ItemRefType[]>()

  /* ======================
       registerItem()
  ====================== */

  const registerItem = React.useCallback(
    (itemRef: React.RefObject<HTMLButtonElement>) => {
      setItems((prev) => (prev ? [...prev, itemRef] : [itemRef]))
    },
    [setItems]
  )

  /* ======================
        contextValue
  ====================== */

  const contextValue = React.useMemo(
    () => ({
      items,
      registerItem
    }),
    [items, registerItem]
  )

  /* ======================
          return
  ====================== */

  return (
    <DropdownContext.Provider value={contextValue}>
      {children}
    </DropdownContext.Provider>
  )
}

/* ========================================================================

======================================================================== */

export const useDropdownContext = () => {
  const context = React.use(DropdownContext)
  if (!context) {
    throw new Error('useDropdownContext must be used within a DropdownProvider')
  }
  return context
}
