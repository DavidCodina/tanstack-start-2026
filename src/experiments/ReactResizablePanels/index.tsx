// import { useState } from 'react'
// ⚠️ This is a much older version.
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

const lipsum = (
  <div className='m-0'>
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
    veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
    ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
    consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque
    porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
    adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
    dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
    nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid
    ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea
    voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem
    eum fugiat quo voluptas nulla pariatur?
  </div>
)

/* ========================================================================
    
======================================================================== */
// For more examples, see here: https://react-resizable-panels.vercel.app/
// Also see shadcn/ui, which uses this package: https://ui.shadcn.com/docs/components/resizable

export const ReactResizablePanelsDemo = ({ direction = 'horizontal' }: any) => {
  /* ======================
          return
  ====================== */

  return (
    <>
      <PanelGroup
        // Omit autoSaveId, if you don't want to persist the arrangement in localStorage
        // react-resizable-panels:example :  {"{\"defaultSize\":25},{\"defaultSize\":25},{}":{"expandToSizes":{},"layout":[57.9449379281,17.0550620719,25]},"{\"defaultSize\":25},{\"defaultSize\":25},{\"minSize\":100}":{"expandToSizes":{},"layout":[0,100,0]},"{\"defaultSize\":25},{\"defaultSize\":25},{\"minSize\":10}":{"expandToSizes":{},"layout":[52.7600446428,14.2105654762,33.029389881]}}
        // autoSaveId='example'
        direction={direction}
        className='aspect-video rounded-lg border border-neutral-500 bg-white shadow-[rgba(0,0,0,0.2)_0px_60px_40px_-7px] xl:aspect-3/1'
        style={{ height: 'auto' }}
        tagName='div' // AKA 'as' prop
      >
        <Panel
          // react-resizable-panels hardcodes overflow:hidden on the style attribute.
          // This means you need to match it within style={{ overflowY: 'auto' }}, or
          // use '!overflow-auto'. But actually the better solution is to instead
          // put this directly on the content: 'h-full overflow-auto'
          defaultSize={25}
          //^ style={{ overflowY: 'auto' }}
        >
          <div
            className='h-full overflow-auto p-4'
            // If you set minWidth on the content, it will prevent it from being squished,
            // but still allow the panel to close completely. Conversely, if you set minSize
            // on the panel, it will prevent it from closing beyong that percentage.
            style={{ minWidth: 200 }}
          >
            <h3 className='mb-1 text-2xl leading-none font-black whitespace-nowrap text-blue-500'>
              Section 1
            </h3>

            {lipsum}
          </div>
        </Panel>

        <CustomResizeHandle direction={direction} />

        <Panel
        // Minimum allowable size of panel (numeric value between 1-100)
        // minSize={10}
        //^ style={{ overflowY: 'auto' }}
        >
          <div className='h-full overflow-auto p-4' style={{ minWidth: 200 }}>
            <h3 className='mb-1 text-2xl leading-none font-black whitespace-nowrap text-blue-500'>
              Section 2
            </h3>

            {lipsum}
          </div>
        </Panel>

        <CustomResizeHandle direction={direction} />

        <Panel
          defaultSize={25}
          //^ style={{ overflowY: 'auto' }}
        >
          <div className='h-full overflow-auto p-4' style={{ minWidth: 200 }}>
            <h3 className='mb-1 text-2xl leading-none font-black whitespace-nowrap text-blue-500'>
              Section 3
            </h3>

            {lipsum}
          </div>
        </Panel>
      </PanelGroup>
    </>
  )
}

/* ========================================================================
    
======================================================================== */

const CustomResizeHandle = ({
  direction = 'horizontal'
}: {
  direction?: 'horizontal' | 'vertical'
}) => {
  const horizontalHandle = (
    <PanelResizeHandle className='group my-4 flex w-1 flex-col gap-2 text-neutral-300 active:text-blue-400'>
      <div className='flex-1 rounded-full bg-neutral-300 group-active:bg-blue-400' />

      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='32'
        height='32'
        fill='currentColor'
        viewBox='0 0 16 16'
        style={{
          position: 'relative',
          transform: 'translateX(-50%)',
          left: 'calc(50% + 1px)'
        }}
      >
        <path d='M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0' />
      </svg>

      <div className='flex-1 rounded-full bg-neutral-300 group-active:bg-blue-400' />
    </PanelResizeHandle>
  )

  const verticalHandle = (
    <PanelResizeHandle className='group mx-4 flex h-1 gap-1 text-neutral-300 active:text-blue-400'>
      <div className='flex-1 rounded-full bg-neutral-300 group-active:bg-blue-400' />

      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='32'
        height='32'
        fill='currentColor'
        viewBox='0 0 16 16'
        style={{
          position: 'relative',
          transform: 'translateY(-50%)',
          top: 'calc(50% + 1px)'
        }}
      >
        <path d='M2 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2' />
      </svg>

      <div className='flex-1 rounded-full bg-neutral-300 group-active:bg-blue-400' />
    </PanelResizeHandle>
  )

  /* ======================
          return
  ====================== */

  return direction === 'horizontal' ? horizontalHandle : verticalHandle
}
