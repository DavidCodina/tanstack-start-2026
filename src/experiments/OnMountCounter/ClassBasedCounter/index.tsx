import { Component, forwardRef } from 'react'

type Props = {}

type State = {
  count: number
}

/* ========================================================================
      
======================================================================== */

class ClassBasedCounter extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      count: 0
    }
  }

  increment = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1
    }))
  }

  decrement = () => {
    this.setState((prevState) => ({
      count: prevState.count - 1
    }))
  }

  reset = () => {
    this.setState({
      count: 0
    })
  }

  /* ======================
          render()
  ====================== */

  render() {
    return (
      <div>
        <div className='btn-group mx-auto mb-6' style={{ display: 'table' }}>
          <button
            className='btn-blue btn-sm min-w-[100px]'
            onClick={this.decrement}
          >
            Decrement
          </button>

          <button
            className='btn-blue btn-sm min-w-[100px]'
            onClick={this.reset}
          >
            Reset
          </button>
          <button
            className='btn-blue btn-sm min-w-[100px]'
            onClick={this.increment}
          >
            Increment
          </button>
        </div>

        <div className='text-center text-2xl font-bold text-blue-500'>
          Count: {this.state.count}
        </div>
      </div>
    )
  }
}

export const ClassBasedCounterWithRef = forwardRef<ClassBasedCounter, Props>(
  (props, ref) => <ClassBasedCounter {...props} ref={ref} />
)

ClassBasedCounterWithRef.displayName = 'ClassBasedCounterWithRef'

export {
  ClassBasedCounterWithRef as ClassBasedCounter,
  ClassBasedCounter as CounterInstance
}
