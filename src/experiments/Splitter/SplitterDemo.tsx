import { Splitter, SplitterPanel } from './'

/* ========================================================================
    
======================================================================== */

export const SplitterDemo = () => {
  const myPanels = (
    <>
      <SplitterPanel className=''>
        <div className='p-4 select-none'>
          <h3 className='mb-1 text-2xl leading-none font-black whitespace-nowrap text-blue-500'>
            Section 1
          </h3>

          <p className='m-0 min-w-[300px]'>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
            qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
            sed quia non numquam eius modi tempora incidunt ut labore et dolore
            magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
            nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
            aliquid ex ea commodi consequatur? Quis autem vel eum iure
            reprehenderit qui in ea voluptate velit esse quam nihil molestiae
            consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
            pariatur?
          </p>
        </div>
      </SplitterPanel>
      <SplitterPanel className=''>
        <div className='p-4 select-none'>
          <h3 className='mb-1 text-2xl leading-none font-black whitespace-nowrap text-blue-500'>
            Section 2
          </h3>
          <p className='m-0 min-w-[300px]'>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
            qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
            sed quia non numquam eius modi tempora incidunt ut labore et dolore
            magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
            nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
            aliquid ex ea commodi consequatur? Quis autem vel eum iure
            reprehenderit qui in ea voluptate velit esse quam nihil molestiae
            consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
            pariatur?
          </p>
        </div>
      </SplitterPanel>
    </>
  )
  return (
    <Splitter className='mb-6 flex aspect-3/1 rounded-lg border border-neutral-300 bg-white shadow-[rgba(0,0,0,0.2)_0px_60px_40px_-7px]'>
      {myPanels}
    </Splitter>
  )
}
