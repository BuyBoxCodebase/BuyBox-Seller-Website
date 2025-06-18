import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Product } from '../data/schema'
import { DataTableColumnHeader } from './product-data-table-column-header'
import { DataTableRowActions } from './product-data-table-row-actions'
import ProductModal from './product-modal'
import { Button } from '@/components/ui/button'
// import ProductModal from './sub-category-modal'

export const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => {
      const id = row.getValue('id') as string
      const truncated = id.length > 8 ? `${id.substring(0, 8)}...` : id
      return <div className='w-[80px]'>{truncated}</div>
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'name', // Changed from "title" to "name"
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {row.getValue('name')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'images',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image Preview' />
    ),
    cell: ({ row }) => {
      const url = row.getValue('images') as string[]
      return (
        <div className='flex items-center space-x-2'>
          <img
            src={url[0] as string}
            alt='preview'
            className='h-8 w-8 rounded object-cover'
          />
          {/* <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {url}
          </span> */}
        </div>
      )
    },
  },
  {
    accessorKey: 'category.name', // Use dot notation to access nested property
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {category?.name || 'N/A'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'subCategories',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Varinats' />
    ),
    cell: ({ row }) => {
      const productId = row.getValue('id') as string
      //console.log('productId', productId)
      return (
        <div className='flex items-center space-x-2'>
          <ProductModal productId={productId}> 
            <Button variant={'ghost'}>View Variants</Button>
          </ProductModal>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
