import { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import useGetProductVariants from '@/hooks/variants/useGetProductVariants'
import { Variant } from '@/hooks/variants/schema'
import { useProduct } from '../context/products-context'

interface SubCategoryModalProps {
  children: ReactNode
  productId: string

}

// Define the types based on the example data


const ProductModal = ({
  children,
  productId,
}: SubCategoryModalProps) => {
  const { variants, loading } = useGetProductVariants(productId)
  const { setOpen, setCurrentRow } = useProduct()
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-4xl p-4">
        <DialogHeader>
          <DialogTitle>Variants</DialogTitle>
          <DialogDescription>
            Variants for {productId}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Variant Options</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && variants.map((variant: Variant) => (
                <TableRow key={variant.id}>
                  <TableCell className="font-mono text-xs">{variant.name}</TableCell>
                  <TableCell>${variant.price.toFixed(2)}</TableCell>
                  <TableCell>{variant.isDefault ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {variant.images && variant.images.length > 0 ? (
                      <div className="h-16 w-16 relative">
                        <img
                          src={variant.images[0]}
                          alt={`Variant ${variant.id}`}
                          className="object-cover rounded-md h-full w-full"
                        />
                      </div>
                    ) : (
                      'No image'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>Qty: {variant.inventory[0].quantity}</span>
                      {variant.inventory[0].restockDate && (
                        <span className="text-xs text-gray-500">
                          Restock: {new Date(variant.inventory[0].restockDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {variant?.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <span className="text-xs font-semibold">{option.optionValue.option.name}:</span>
                          <span className="text-xs">{option.optionValue.value}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className='flex items-center gap-2'>
                    <Button variant="link" onClick={() => {
                      setCurrentRow(variant)
                      setOpen('edit-variant')
                    }}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">Loading variants...</TableCell>
                </TableRow>
              )}
              {!loading && variants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No variants found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProductModal