import { useEffect, useRef } from 'react'
import { SmartDiv } from './'
import type { SmartDivAPI } from './'

type SmartDivRef = (HTMLDivElement & { api: SmartDivAPI }) | null

/* ========================================================================
      
======================================================================== */

export const SmartDivDemo = () => {
  const smartDivRef = useRef<SmartDivRef>(null)

  useEffect(() => {
    const smartDiv = smartDivRef.current

    if (smartDiv) {
      console.log(smartDiv.api?.getInfo())
    }

    const domNode = document.getElementById('smart-div')

    console.log('domNode:')
    console.dir(domNode)
  }, [])

  return (
    <SmartDiv
      id='smart-div'
      className={`mb-6 rounded-lg border border-neutral-400 bg-white p-4 text-center font-bold shadow`}
      ref={smartDivRef}
    >
      I'm smart!!!
    </SmartDiv>
  )
}
