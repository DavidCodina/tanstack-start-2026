import { useLayoutEffect, useState } from 'react'
import { Button } from '@/components'

type ModalProps = {
  show: boolean
  onClose?: () => void
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The key prop can force a component to remount when the key changes. Here's why this works:
//
//   1. Unique Identification: The key prop provides React with a way to uniquely identify each component
//   instance. When the key changes, React treats it as a new component.
//
//   2. Component Unmounting and Remounting: When the key prop changes, React unmounts the existing component
//   and mounts a new instance. This effectively resets the component's state and lifecycle methods, as if it were freshly created.
//
//   3. State Reset: Any local state within the component (e.g., the input value) is reset because the component
//   is reinitialized. This ensures that the input field starts empty each time the modal is opened.
//
// See Web Dev Simplified for more info: https://www.youtube.com/watch?v=vXJkeZf-4-4
//
/////////////////////////
//
// Obviously, another way of dealing with this is simply to have a useEffect inside
// the modal that looks for a show prop of false, then simply resets all internal state.
//
///////////////////////////////////////////////////////////////////////////

const Modal = ({
  handleTransitionEnd,
  onClose,
  show = false
}: ModalProps & { handleTransitionEnd?: () => void }) => {
  const [value, setValue] = useState('')
  const [isVisible, setIsVisible] = useState(show)

  useLayoutEffect(() => {
    if (show === true) {
      setIsVisible(true) // eslint-disable-line
    }
  }, [show])

  return (
    <div
      aria-hidden={!show}
      className={` ${show ? 'z-9999 bg-black/50' : 'bg-transparent'} ${isVisible ? 'visible' : 'invisible'} fixed inset-0 transition-[background-color] duration-300 ease-linear`}
      onTransitionEnd={(e) => {
        // Prevent this from running when a child element transitions.
        if (e.target === e.currentTarget) {
          if (!show) {
            setIsVisible(false)
          }
          handleTransitionEnd?.()
        }
      }}
    >
      <div
        className={`${show ? '-translate-y-1/2 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]' : '-translate-y-[calc(50vh+100%)] shadow-none'} absolute top-1/2 left-1/2 flex min-h-[200px] w-[600px] max-w-[calc(100vw-48px)] -translate-x-1/2 flex-col rounded-lg border border-neutral-700 bg-[#fafafa] p-4 transition-[transform,box-shadow] duration-300 ease-linear`}
      >
        <h3 className='mb-2 flex justify-center gap-3 leading-none font-black text-blue-500 uppercase'>
          <span>User</span> <span> Data</span>
        </h3>
        <div className='flex-1'>
          <input
            className='form-control form-control-sm'
            onChange={(e) => {
              setValue(e.target.value)
            }}
            placeholder='Type something...'
            value={value}
            type='text'
          />
          <div className='form-text text-sm'>
            Type something to verify that the key prop interrupts the state
            persistence.
          </div>
        </div>

        <Button
          onClick={() => {
            onClose?.()
          }}
          size='sm'
        >
          Close
        </Button>
      </div>
    </div>
  )
}
/* ========================================================================

======================================================================== */
// Or use an HOC (i.e., withKeyChanger).

const ModalContainer = ({ onClose, show = false }: ModalProps) => {
  const [key, setKey] = useState(show)

  return (
    <>
      <Modal
        key={key.toString()}
        onClose={onClose}
        // The key should be changed only after the transition ends.
        // Otherwise, it breaks the transition/animation.
        handleTransitionEnd={() => {
          setKey(show)
        }}
        show={show}
      />
    </>
  )
}

export { ModalContainer as Modal }
