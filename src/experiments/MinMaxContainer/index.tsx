/* ========================================================================

======================================================================== */
// What is the significance of this experiment?
// It sets a max width that is dynamic such that it is 1000px or 100vw - 50px.
// Thus it's always able to maintain some horizontal spacing.

//^ But why do we need clamp? How is this different from simply setting a width of 1000px
//^ and a max-width of calc(100vw - 50px)?

export const MinMaxContainer = () => {
  /* ======================
          return
  ====================== */

  return (
    <div
      // left-2/4 -translate-x-2/4
      className='fixed left-2/4 w-full max-w-[clamp(0px,_1000px,_calc(100vw_-_50px))] -translate-x-2/4 rounded border border-neutral-400 bg-white p-4'
      // style={{ maxWidth: 'clamp(0px, 1000px, calc(100vw - 50px))' }}
    >
      <h5 className='font-black text-blue-500'>MinMax Container:</h5>

      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui
        consectetur labore id ratione alias accusantium soluta facilis magni
        voluptates quos, quae, officia rem eos, suscipit sit laborum magnam
        voluptas assumenda beatae. Quo reiciendis excepturi tempora, incidunt
        eligendi animi vel assumenda illum nostrum. Mollitia maiores dolorum cum
        autem voluptatibus eius omnis temporibus harum quasi vel hic culpa,
        ratione numquam reprehenderit adipisci est tenetur illum porro
        similique! Ipsum necessitatibus vel at nam esse enim dignissimos, non
        quod illo. Aliquid praesentium ex animi fugit! Magni, minima. Incidunt,
        similique obcaecati nulla dolorum harum quia aliquid tempora qui esse
        culpa! Quos voluptatem tempora officiis ratione?
      </p>
    </div>
  )
}
