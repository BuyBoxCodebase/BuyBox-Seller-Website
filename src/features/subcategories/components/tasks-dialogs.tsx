import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './tasks-import-dialog'
import { TasksMutateDrawer } from './tasks-mutate-drawer'
import { useCategory } from '../context/tasks-context'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategory()
  return (
    <>
      <TasksMutateDrawer
        key='task-create-subCategory'
        open={open === 'create-category'}
        onOpenChange={() => setOpen('create-category')}
      />
      {/* <TasksMutateDrawer
        key='task-create-subCategory'
        currentRow={currentRow!}
        open={open === 'create-subCategory'}
        onOpenChange={() => setOpen('create-subCategory')}
        isCategory={false}
      /> */}

      <TasksImportDialog
        key='tasks-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`task-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={async() => {2
              await fetch(
                `${import.meta.env.VITE_BASE_URL}/category/delete/sub-category`,
                {
                  method: 'DELETE',
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ subCategoryId: currentRow.id }),
                }
              
              )
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              toast({
                title: 'Sub category deleted',
                
              })
            }}
            className='max-w-md'
            title={`Delete this task: ${currentRow.name} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
                <strong>{currentRow.name}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
