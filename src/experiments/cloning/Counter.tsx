// https://react.dev/reference/react/cloneElement
// https://react.dev/reference/react/isValidElement
import { cloneElement, isValidElement, useState } from 'react'
import type { ReactElement } from 'react'

/* ========================================================================
      
======================================================================== */
// This Counter component accepts a button prop (i.e., any ReactElement).
// The Counter then checks if it's a valid element. If so, it clones it and attaches
// the onClick handler to it. Otherwise it uses the FallbackButton.

export const Counter = ({ button }: { button?: ReactElement }) => {
  const [count, setCount] = useState(0)
  const isValid = isValidElement(button)

  let CustomButton: ReactElement | null = null

  if (isValid) {
    const props: any = {
      onClick: () => setCount((v) => v + 1),
      children: `Count: ${count}`
    }
    CustomButton = cloneElement(button, props)
  }

  const FallbackButton = (
    <button
      className='btn-neutral btn-sm mx-auto mb-6 block'
      onClick={() => setCount((v) => v + 1)}
      type='button'
    >
      Count: {count}
    </button>
  )

  return isValid ? CustomButton : FallbackButton
}

/* ========================================================================
                          CounterWithClonedButtonDemo1
======================================================================== */
// This example implements a JSX button.

export const CounterWithClonedButtonDemo1 = () => {
  return (
    <Counter
      button={
        <button className='btn-blue btn-sm mx-auto mb-6 block' type='button' />
      }
    />
  )
}

/* ========================================================================
                      CounterWithClonedButtonDemo2
======================================================================== */
// This example implements a Component button.

const MyButton = (props: any) => {
  return (
    <button
      className='btn-green btn-sm mx-auto mb-6 block'
      type='button'
      {...props}
    />
  )
}

export const CounterWithClonedButtonDemo2 = () => {
  return (
    <Counter button={<MyButton style={{ outline: '2px dashed gray' }} />} />
  )
}
