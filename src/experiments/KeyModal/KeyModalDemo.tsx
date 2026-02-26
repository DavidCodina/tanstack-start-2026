import { useState } from 'react'
import { Modal } from './'

import { Button } from '@/components'

/* ========================================================================

======================================================================== */

export const KeyModalDemo = () => {
  const [show, setShow] = useState(false)

  return (
    <>
      <Button
        className='mx-auto flex'
        onClick={() => {
          setShow(true)
        }}
        size='sm'
      >
        Open Modal
      </Button>
      <Modal
        onClose={() => {
          setShow(false)
        }}
        show={show}
      />
    </>
  )
}
