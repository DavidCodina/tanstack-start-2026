// https://base-ui.com/react/utils/use-render
import { useRender } from '@base-ui/react/use-render'
// https://base-ui.com/react/utils/merge-props
import { mergeProps } from '@base-ui/react/merge-props'

type ContainerProps = useRender.ComponentProps<'div'> & {}

const Container = ({ children, render, ...otherProps }: ContainerProps) => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // Not needed here:
  //
  //   const mergedProps = mergeProps<'div'>({}, otherProps)
  //
  // useRender already handles merging those props with whatever the render
  // prop element brings in.  So in the simple cases, you don't actually need
  // mergeProps(). mergeProps is only actually needed when one has multiple
  // sources of props.
  //
  //     props: mergeProps<'button'>(defaultProps, otherProps),
  //
  ///////////////////////////////////////////////////////////////////////////

  const mergedProps = mergeProps<'div'>(
    {
      ///////////////////////////////////////////////////////////////////////////
      //
      // This will only work when you do this: render={<section />}, or explicitly use
      // the callback version of render:
      //
      //   render={(props, _state) => {
      //     return (
      //       <section {...props}>
      //         {props.children}
      //         I'm the actual children
      //       </section>
      //     )
      //   }}
      //
      ///////////////////////////////////////////////////////////////////////////
      children: (
        <>
          <div className='text-center text-xl font-bold'>
            I'm Always Here (Sometimes...)
          </div>
          {children}
        </>
      ),

      onClick: () => {
        console.log("I'm the internal onClick")
      }
    },
    otherProps
  )

  const Component = useRender({
    defaultTagName: 'div',
    props: mergedProps,
    render,
    state: { test: 'Testing 123...' }
  })

  // Note: useRender is designed to be the root element, not something you nest
  // inside another element. So return <div><Component /></div> won't work.
  return Component
}

/* ========================================================================
      
======================================================================== */

export const UseRenderDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <>
      <Container
        className='mx-auto mb-12 max-w-[600px] rounded-lg border bg-neutral-100 p-2 shadow'
        render={<section />}
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio alias
        provident iure laborum. Repellendus ratione quis facere temporibus illo
        sapiente sit officiis, dolor voluptates quia assumenda impedit quam
        magni quidem dolore eligendi ipsam laboriosam dignissimos odit atque
        fuga. Accusamus ullam nulla quam ipsa explicabo porro dolor expedita
        odio eaque corrupti?
      </Container>

      <Container
        onClick={() => {
          console.log('Container clicked')
        }}
        className='mx-auto mb-12 max-w-[600px] rounded-lg border bg-neutral-100 p-2 shadow'
        render={
          <section
            className='bg-pink-100'
            onClick={() => {
              console.log('section clicked')
            }}
            style={{ border: '2px dashed deeppink' }}
          >
            <p className='mb-4'>
              I'm the actual children. If you pass children to section, the
              actual children of Container get ignored. In practice, props on
              the rendered element have precedence. For style objects, this
              means that certain properties may overwrite other properties. For
              classNames, they all get merged. All of this happens even without
              the explicit usage of mergeProps().
            </p>

            <p>
              For event handlers, they seem to both fire. The real need for{' '}
              <code>mergedProps()</code> is when the actual{' '}
              <code>Container</code> component has internal props of its own.
            </p>
          </section>
        }
        style={{ border: '2px dashed blue' }}
      >
        If you pass children to section, I get ignored. In practice, props on
      </Container>

      <Container
        className='mx-auto mb-12 max-w-[600px] rounded-lg border bg-neutral-100 p-2 shadow'
        render={(props, _state) => {
          return (
            <section {...props}>
              {props.children}
              I'm the actual children
            </section>
          )
        }}
      >
        If you pass children, I get ignored.
      </Container>
    </>
  )
}
