import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './order-data-table-view-options'
import { DataTableFacetedFilter } from './order-data-table-faceted-filter'

// Mirrors the OrderStatus / PaymentMode enums in the backend's schema.prisma.
const orderStatuses = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Accepted', value: 'PROCESSING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELED' },
  { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
]

const paymentModes = [
  { label: 'Cash on Delivery', value: 'CASH_ON_DELIVERY' },
  { label: 'Credit Card', value: 'CREDIT_CARD' },
  { label: 'Debit Card', value: 'DEBIT_CARD' },
  { label: 'UPI', value: 'UPI' },
  { label: 'Netbanking', value: 'NETBANKING' },
]

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter by Order ID...'
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('id')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={orderStatuses}
            />
          )}
          {table.getColumn('paymentMode') && (
            <DataTableFacetedFilter
              column={table.getColumn('paymentMode')}
              title='Payment Mode'
              options={paymentModes}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}