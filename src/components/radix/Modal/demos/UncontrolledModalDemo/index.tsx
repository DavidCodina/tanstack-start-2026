'use client'

import { UncontrolledModal } from './UncontrolledModal'
import { Button } from '@/components'

/* ========================================================================
                          UncontrolledModalDemo
======================================================================== */

export const UncontrolledModalDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <UncontrolledModal
      trigger={
        <Button
          className='mx-auto mb-6 flex'
          style={{ minWidth: 150 }}
          size='sm'
        >
          Open Uncontrolled Modal
        </Button>
      }
    />
  )
}
