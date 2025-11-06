import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Videos } from '../data/schema'
import { useVideos } from '../context/videos-context'
import { VideosMutateDrawer } from './video-mutate-drawer'

export function VideosDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useVideos()

  const handleCloseDrawer = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
    }, 500)
  }

  const renderDialog = () => {
    // Dialogs that don't need currentRow
    if (open === "create-videos") {
      return (
        <VideosMutateDrawer
          key='create-videos'
          open={true}
          onOpenChange={handleCloseDrawer}
        />
      )
    }



    // Dialogs that need currentRow
    if (!currentRow) return null

    switch (open) {
      case 'update':
        return (
          {}
        )
      case 'delete':
        return (
          <ConfirmDialog
            key='task-delete'
            destructive
            open={true}
            onOpenChange={handleCloseDrawer}
            handleConfirm={async () => {
              await fetch(
                `${import.meta.env.VITE_BASE_URL}/product/delete/${currentRow.productId}`,
                {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                  },
                }
              )
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              toast({
                title: 'Product deleted',
              })
            }}
            className='max-w-md'
            title={`Delete this task: ${currentRow.productId} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
                <strong>{currentRow.productId}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        )
      default:
        return null
    }
  }

  return <>{renderDialog()}</>
}