import './index.css'

/* ========================================================================
                              TextFlowDemo
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Getting text to flow around AND over a shape is kind of tricky.
// The two best resources I've seen so far are below:
//
//   1. https://olivierforget.net/css-shape-outside/
//   2. https://www.youtube.com/watch?v=rG2kGKZfKHM
//
// Basically, there's two main factors at play.
//
//   1. The styles applied to the shape, which is given position:absolute within the container.
//   2. The styles applied to .shape-container::before
//
// Beyond that are some other tutorials:
//
//   https://medium.com/@nicke920/wrapping-content-around-images-using-css-shapes-2fb17c8fde4e
//   https://blog.logrocket.com/creative-text-flows-using-css-shapes/
//   https://developer.mozilla.org/en-US/docs/Web/CSS/shape-outside
//   https://www.youtube.com/watch?v=sifXs4XVK7g
//   https://medium.com/@nicke920/wrapping-content-around-images-using-css-shapes-2fb17c8fde4e
//
///////////////////////////////////////////////////////////////////////////

export const TextFlowDemo = () => {
  /* ======================
          return
  ====================== */

  return (
    <>
      <section className='shape-container relative'>
        {/* <div
           
            style={{
              float: 'left',
              clipPath:
                'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
              shapeOutside:
                'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',

              // padding: 100,
              // clipPath: 'circle()',
              // shapeOutside: 'circle()',
              // marginRight: 10,
              // marginTop: 50,

              height: 300,
              width: 300,

              backgroundColor: '#409',
              shapeMargin: '0px 0px'
              // shapeMargin: -25
              // shapePadding: 10
            }}
          /> */}

        <div
          className='bg-linear-to-r from-violet-700 to-sky-400'
          style={{
            position: 'absolute',
            width: 350,
            height: 350,
            margin: '57px 0 0 -58px',
            clipPath: 'circle(120px at 160px 150px)'
          }}
        />

        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo eveniet
          necessitatibus quod ducimus expedita magnam itaque eum labore natus
          aliquam, quas similique cupiditate, culpa vero maxime totam ea
          consequatur neque numquam porro pariatur. Alias dolores tempore dolore
          neque ipsa distinctio, ea accusantium enim, ab minus est voluptates
          dignissimos id doloremque minima ad molestiae. Quos dolorum odit
          fugiat soluta earum nemo nostrum neque ex iure amet. Iure odio, quidem
          sint ab ipsa non voluptatum. Placeat, natus nihil. Soluta natus rerum
          at iste! Id blanditiis veritatis minus consequatur excepturi et
          voluptates cum accusamus? Nihil modi nesciunt omnis sequi velit
          voluptate facilis minima.
        </p>

        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo eveniet
          necessitatibus quod ducimus expedita magnam itaque eum labore natus
          aliquam, quas similique cupiditate, culpa vero maxime totam ea
          consequatur neque numquam porro pariatur. Alias dolores tempore dolore
          neque ipsa distinctio, ea accusantium enim, ab minus est voluptates
          dignissimos id doloremque minima ad molestiae. Quos dolorum odit
          fugiat soluta earum nemo nostrum neque ex iure amet. Iure odio, quidem
          sint ab ipsa non voluptatum. Placeat, natus nihil. Soluta natus rerum
          at iste! Id blanditiis veritatis minus consequatur excepturi et
          voluptates cum accusamus? Nihil modi nesciunt omnis sequi velit
          voluptate facilis minima.
        </p>

        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo eveniet
          necessitatibus quod ducimus expedita magnam itaque eum labore natus
          aliquam, quas similique cupiditate, culpa vero maxime totam ea
          consequatur neque numquam porro pariatur. Alias dolores tempore dolore
          neque ipsa distinctio, ea accusantium enim, ab minus est voluptates
          dignissimos id doloremque minima ad molestiae. Quos dolorum odit
          fugiat soluta earum nemo nostrum neque ex iure amet. Iure odio, quidem
          sint ab ipsa non voluptatum. Placeat, natus nihil. Soluta natus rerum
          at iste! Id blanditiis veritatis minus consequatur excepturi et
          voluptates cum accusamus? Nihil modi nesciunt omnis sequi velit
          voluptate facilis minima.
        </p>
      </section>
    </>
  )
}
