import { TasksImportDialog } from './tasks-import-dialog'
import { useOrder } from '../context/tasks-context'

export function TasksDialogs() {
  const { open, setOpen } = useOrder()
  
  const renderDialog = () => {
    if (open === 'import') {
      return (
        <TasksImportDialog
          key='tasks-import'
          open={true}
          onOpenChange={() => setOpen(null)}
        />
      )
    }
  }

  return <>{renderDialog()}</>
}