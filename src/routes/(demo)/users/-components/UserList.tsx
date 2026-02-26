import { UserItem } from './UserItem'
import type { ResBody, SafeUser } from '@/types'
import { Alert, Button } from '@/components'

type UserListProps = {
  handleGetUsers: () => void
  invalidating: boolean
  loaderData: ResBody<Array<SafeUser> | null>
}

/* ========================================================================

======================================================================== */

export const UserList = ({
  handleGetUsers,
  invalidating,
  loaderData
}: UserListProps) => {
  const { data: users, success: usersSuccess } = loaderData

  /* ======================
        renderUsers()
  ====================== */

  const renderUsers = () => {
    if (usersSuccess !== true) {
      return (
        <Alert
          className='dark:bg-(--destructive-soft)/15'
          rightSection={
            <Button
              className='self-center'
              loading={invalidating}
              onClick={handleGetUsers}
              variant='destructive'
              size='sm'
            >
              {invalidating ? 'Loading...' : 'Retry'}
            </Button>
          }
          title='Error'
          variant='destructive'
        >
          <p>Unable to get users.</p>
        </Alert>
      )
    }

    if (!Array.isArray(users) || users.length === 0) {
      return null
    }

    return (
      <ul className='bg-card space-y-6 rounded-lg border p-6 shadow'>
        {users.map((item) => {
          return <UserItem key={item.id} item={item} />
        })}
      </ul>
    )
  }

  /* ======================
          return
  ====================== */

  return renderUsers()
}
