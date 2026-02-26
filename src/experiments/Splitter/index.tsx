import { useEffect, useRef, useState } from 'react'
import { useExtractValidChildren } from './useExtractValidChildren'
import type { ComponentProps } from 'react'

type SplitterProps = ComponentProps<'div'>
type SplitterPanelProps = ComponentProps<'div'>

/* ========================================================================
    
======================================================================== */

export const Splitter = ({
  children,
  className = '',
  style = {},
  ...otherProps
}: SplitterProps) => {
  const [sizes, setSizes] = useState<[number, number]>([50, 50])
  const splitterRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const validChildren = useExtractValidChildren({ children })

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    const handleDrag = (clientX: number) => {
      if (!splitterRef.current) return

      const containerRect = splitterRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      const newLeftSize = Math.max(
        0,
        Math.min(((clientX - containerRect.left) / containerWidth) * 100, 100)
      )

      setSizes([newLeftSize, 100 - newLeftSize])
    }

    const handleMouseUp = () => {
      setIsMouseDown(false)
      isDraggingRef.current = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      handleDrag(e.clientX)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  /* ======================
        renderPanel()
  ====================== */

  const renderPanel = (index: number) => {
    return (
      <div
        style={{
          width: `${sizes[index]}%`,
          minWidth: 0,
          flexShrink: 0,
          overflow: 'hidden'
        }}
      >
        {validChildren[index]}
      </div>
    )
  }

  /* ======================
      renderDragHandle()
  ====================== */

  const renderDragHandle = () => {
    const xMixinCondition = sizes[1] <= 3
    const xMixin =
      sizes[1] <= 3 ? '-translate-x-full transition-transform duration-200' : ''
    return (
      <div
        {...otherProps}
        onMouseDown={() => {
          setIsMouseDown(true)
          isDraggingRef.current = true
        }}
        className={`relative my-6 flex w-1 cursor-col-resize`}
        role='button'
        style={{ flexShrink: 0 }}
        tabIndex={0}
      >
        <div
          className={`h-full w-full rounded-full ${isMouseDown ? 'bg-blue-400' : 'bg-neutral-300'} transition-transform duration-200${xMixinCondition ? ` ${xMixin}` : ''}`}
        />
      </div>
    )
  }

  /* ======================
      renderDevtools()
  ====================== */

  const renderDevtools = (shouldRender = true) => {
    if (!shouldRender) {
      return null
    }
    return (
      <div
        className={`mx-auto max-w-[600px] rounded-lg border border-neutral-400 bg-white p-4 text-center shadow-[rgba(0,0,0,0.24)_0px_3px_8px]`}
      >
        {JSON.stringify(
          sizes.map((size) => Math.round(size)),
          null,
          2
        )}
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <div
        ref={splitterRef}
        className={className}
        style={{ display: 'flex', overflow: 'hidden', ...style }}
      >
        {renderPanel(0)}
        {renderDragHandle()}
        {renderPanel(1)}
      </div>

      {renderDevtools(false)}
    </>
  )
}

/* ========================================================================
    
======================================================================== */

export const SplitterPanel = ({
  children,
  style,
  ...otherProps
}: SplitterPanelProps) => {
  return (
    <div
      {...otherProps}
      style={{
        height: '100%',
        overflow: 'auto',
        ...style
      }}
    >
      {children}
    </div>
  )
}

//# I want another example that's a triple-splitter
//# This example is intended to be super simple.
//# If the 2 SplitterPanels are wrapped in Fragment when consumed, it
//# will break the implementation. That actually be an interesting fix.
//# See also:
//#
//` https://www.youtube.com/watch?v=VTOQpEvkO7I&t=24s
//` https://react-resizable-panels.vercel.app/
//` https://www.npmjs.com/package/react-resizable-panels
//

//#
//# https://www.npmjs.com/package/react-splitter-layout
//# https://primereact.org/splitter/
//# https://js.devexpress.com/React/Documentation/Guide/UI_Components/Splitter/Getting_Started_with_Splitter/

//# https://www.npmjs.com/package/react-split
//# https://split.js.org/#/?panes=3&minSize=0

//# https://www.npmjs.com/package/react-split-pane
