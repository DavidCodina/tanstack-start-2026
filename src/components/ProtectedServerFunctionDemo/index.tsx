import { getProtectedData } from './server-function'
import { Button } from '@/components'

/* ========================================================================

======================================================================== */

export const ProtectedServerFunctionDemo = () => {
  return (
    <Button
      className='mx-auto mb-6 flex'
      onClick={() => {
        getProtectedData()
          .then((res) => {
            if (res.success) {
              console.log('Successfully got data from getProtectedData:', res)
            } else {
              console.log('Unable to get data from getProtectedData:', res)
            }
            return res
          })
          .catch((_err) => {
            console.log('Error!!!')
          })
      }}
      size='sm'
      variant='success'
    >
      Log Data From getProtectedData()
    </Button>
  )
}
