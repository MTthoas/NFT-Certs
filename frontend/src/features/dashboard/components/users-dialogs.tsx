import { useUsers } from '../context/users-context'
import { AcademicProgressDialog } from './academic-progress-dialog'
import { UsersActionDialog } from './users-action-dialog'
import { UsersInviteDialog } from './users-invite-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  return (
    <>
      <UsersActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        bigdata={currentRow}
      />

      <UsersInviteDialog
        key='user-invite'
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />

      <AcademicProgressDialog
        key='EditCertification'
        open={open === 'editCertification'}
        onOpenChange={() => setOpen('editCertification')}
        data={currentRow}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
