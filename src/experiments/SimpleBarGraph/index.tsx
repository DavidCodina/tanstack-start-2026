/* ========================================================================

======================================================================== */

export const SimpleBarGraph = () => {
  /* ======================
          return
  ====================== */

  return (
    <>
      {(() => {
        const winnersPercent = 75
        const losersPercent = 100 - winnersPercent
        return (
          <section className='mb-6 flex justify-center'>
            <div className='inline-flex h-[400px] items-end gap-4 rounded-xl border border-gray-400 bg-white px-4 pt-4 shadow-lg'>
              <div
                className='h-full rounded-t border border-green-700 bg-green-500'
                style={{ height: `${winnersPercent}%` }}
              >
                <div className='p-2 text-center font-bold text-white'>
                  Winners ({winnersPercent}%)
                </div>
              </div>
              <div
                className='h-full rounded-t border-red-700 bg-red-500'
                style={{ height: `${losersPercent}%` }}
              >
                <div className='p-2 text-center font-bold text-white'>
                  Losers ({losersPercent}%)
                </div>
              </div>
            </div>
          </section>
        )
      })()}
    </>
  )
}
