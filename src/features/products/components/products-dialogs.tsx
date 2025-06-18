import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ProductsMutateDrawer } from './products-mutate-drawer'
import { useProduct } from '../context/products-context'
import { ProductsImportDialog } from './products-import-dialog'
import { VariantOptionsMutateDrawer } from './product-option-mutate-drawer'
import { CreateVariantMutateDrawer } from './variant-mutate-drawer'
import { Variant } from '@/hooks/variants/schema'
import { Product } from '../data/schema'

export function ProductsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProduct()

  const handleCloseDrawer = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
    }, 500)
  }

  const renderDialog = () => {
    // Dialogs that don't need currentRow
    if (open === "create-product") {
      return (
        <ProductsMutateDrawer
          key='task-create-category'
          open={true}
          onOpenChange={() => setOpen(null)}
        />
      )
    }

    if (open === 'import') {
      return (
        <ProductsImportDialog
          key='Products-import'
          open={true}
          onOpenChange={() => setOpen(null)}
        />
      )
    }

    // Dialogs that need currentRow
    if (!currentRow) return null

    switch (open) {
      case 'update':
        return (
          <ProductsMutateDrawer
            key={`task-update-${currentRow.id}`}
            open={true}
            onOpenChange={handleCloseDrawer}
            currentRow={currentRow as Product}
          />
        )
      case 'variant-option':
        return (
          <VariantOptionsMutateDrawer
            key={`task-variant`}
            open={true}
            onOpenChange={handleCloseDrawer}
            currentRow={currentRow as Product}
          />
        )
      case 'variant-option-edit':
        return (
          <VariantOptionsMutateDrawer
            key={`task-variant-edit-${currentRow.id}`}
            open={true}
            onOpenChange={handleCloseDrawer}
            currentRow={currentRow as Product}
            isUpdate={true}
          />
        )
      case 'add-variant':
        return (
          <CreateVariantMutateDrawer
            key={`variant-edit-${currentRow.id}`}
            open={true}
            onOpenChange={handleCloseDrawer}
            currentRow={currentRow as Variant}
          />
        )
      case 'edit-variant':
        return (
          <CreateVariantMutateDrawer
            key={`update-variant-${currentRow.id}`}
            open={true}
            onOpenChange={handleCloseDrawer}
            currentRow={currentRow as Variant}
            isUpdate={true}
          />
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
                `${import.meta.env.VITE_BASE_URL}/product/delete/${currentRow.id}`,
                {
                  method: 'DELETE',
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
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
        )
      default:
        return null
    }
  }

  return <>{renderDialog()}</>
}