import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Order } from '../data/schema'
import { DataTableColumnHeader } from './order-data-table-column-header'
import { DataTableRowActions } from './order-data-table-row-actions'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import OrderProductsModal from './order-products-modal'

export const columns: ColumnDef<Order>[] = [
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
      <DataTableColumnHeader column={column} title='Order ID' />
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
    accessorKey: 'user.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{user.name}</span>
          <span className='text-xs text-muted-foreground'>{user.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge className={`
          ${status === 'DELIVERED' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
            status === 'CANCELLED' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
              status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                status === 'PROCESSING' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                  status === 'SHIPPED' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' :
                    'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }
        `}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'totalAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total Amount' />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'));
      return <div className='font-medium'>{formatCurrency(amount)}</div>
    },
  },
  {
    accessorKey: 'paymentMode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment Mode' />
    ),
    cell: ({ row }) => {
      const paymentMode = row.getValue('paymentMode') as string
      return (
        <div className='font-medium'>
          {paymentMode.replace(/_/g, ' ')}
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Order Date' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return <div>{formatDate(date)}</div>
    },
  },
  {
    accessorKey: 'products',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Products' />
    ),
    cell: ({ row }) => {
      const products = row.getValue('products') as Order['products']
      return (
        <div className='flex items-center space-x-2'>
          <OrderProductsModal products={products} orderId={row.original.id}>
            <Button variant={'ghost'}>View Products ({products.length})</Button>
          </OrderProductsModal>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]