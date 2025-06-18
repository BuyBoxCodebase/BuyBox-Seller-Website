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


interface SubCategory {
  id: string
  name: string
  imageUrl: string
  categoryId: string
}

interface SubCategoryModalProps {
  children: ReactNode
  subCategories: SubCategory[]
  categoryName: string
}

const SubCategoryModal = ({
  children,
  subCategories,
  categoryName,
}: SubCategoryModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-lg p-4">
        <DialogHeader>
          <DialogTitle>Sub Categories</DialogTitle>
          <DialogDescription>
            Sub categories for {categoryName}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Category ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subCategories.map((subCategory) => {
                const truncatedId =
                  subCategory.id.length > 8
                    ? subCategory.id.substring(0, 8) + '...'
                    : subCategory.id
                const truncatedCategoryId =
                  subCategory.categoryId.length > 8
                    ? subCategory.categoryId.substring(0, 8) + '...'
                    : subCategory.categoryId
                return (
                  <TableRow key={subCategory.id}>
                    <TableCell>{truncatedId}</TableCell>
                    <TableCell>{subCategory.name}</TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-2'>
                        <img
                          src={subCategory.imageUrl}
                          alt="preview"
                          className='h-8 w-8 rounded object-cover'
                        />
                        {/* <span className='max-w-xs truncate'>
                          {subCategory.imageUrl}
                        </span> */}
                      </div>
                    </TableCell>
                    <TableCell>{truncatedCategoryId}</TableCell>
                  </TableRow>
                )
              })}
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

export default SubCategoryModal
