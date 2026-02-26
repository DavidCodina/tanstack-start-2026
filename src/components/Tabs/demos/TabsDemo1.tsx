import { CircleUserRound, FolderGit2, NotepadText } from 'lucide-react'
import { TabsIndicator, TabsList, TabsPanel, TabsRoot, TabsTab } from '../.'

/* ========================================================================

======================================================================== */

export const TabsDemo1 = () => {
  return (
    <section className='mx-auto max-w-[400px]'>
      <TabsRoot
        className='shadow'
        // defaultValue='overview'
      >
        <TabsList>
          <TabsTab value='overview'>Overview</TabsTab>
          <TabsTab value='projects'>Projects</TabsTab>
          <TabsTab value='account'>Account</TabsTab>
          <TabsIndicator />
        </TabsList>

        <TabsPanel className='flex h-24 flex-col p-2' value='overview'>
          <NotepadText className='text-primary m-auto size-10 shrink-0' />
        </TabsPanel>

        <TabsPanel className='flex h-24 flex-col p-2' value='projects'>
          <FolderGit2 className='text-primary m-auto size-10 shrink-0' />
        </TabsPanel>

        <TabsPanel className='flex h-24 flex-col p-2' value='account'>
          <CircleUserRound className='text-primary m-auto block size-10 shrink-0' />

          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit a
            similique, neque veniam rem saepe aspernatur. Veritatis nemo quo
            magni ducimus ipsam consequuntur optio earum officiis aliquid itaque
            sunt totam architecto, quos quidem libero blanditiis nisi possimus
            accusamus corrupti, eum error atque nulla. Reiciendis dolores
            adipisci iure aliquam tempore nobis?
          </p>
        </TabsPanel>
      </TabsRoot>
    </section>
  )
}
