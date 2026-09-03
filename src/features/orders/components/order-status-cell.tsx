import { ChevronDownIcon } from '@radix-ui/react-icons'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import useUpdateOrderStatus from '@/hooks/orders/useUpdateOrderStatus'
import { Order, OrderStatus, sellerActions, statusLabels } from '../data/schema'

const statusStyles: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  PROCESSING: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 hover:bg-green-200',
  CANCELED: 'bg-red-100 text-red-800 hover:bg-red-200',
  OUT_OF_STOCK: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
}

interface OrderStatusCellProps {
  order: Order
  onStatusChange?: (orderId: string, status: OrderStatus) => void
}

export function OrderStatusCell({ order, onStatusChange }: OrderStatusCellProps) {
  const { updateStatus, updatingId } = useUpdateOrderStatus()
  const isUpdating = updatingId === order.id

  // Only a pending order is actionable — every other status is terminal for the
  // seller, so it renders as a plain badge.
  if (order.status !== 'PENDING') {
    return (
      <Badge className={statusStyles[order.status]}>
        {statusLabels[order.status]}
      </Badge>
    )
  }

  const handleSelect = async (status: OrderStatus) => {
    try {
      await updateStatus(order.id, status)
      onStatusChange?.(order.id, status)
      toast({
        title:
          status === 'PROCESSING' ? 'Order accepted' : 'Marked as out of stock',
        description:
          status === 'PROCESSING'
            ? 'The customer can now see this order as accepted.'
            : 'The reserved stock has been returned to your inventory.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not update order',
        description:
          error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild disabled={isUpdating}>
        <button
          type='button'
          className='disabled:opacity-60'
          aria-label='Change order status'
        >
          <Badge className={`${statusStyles.PENDING} cursor-pointer gap-1`}>
            {isUpdating ? 'Updating...' : statusLabels.PENDING}
            <ChevronDownIcon className='h-3 w-3' />
          </Badge>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-[160px]'>
        {sellerActions.map((action) => (
          <DropdownMenuItem
            key={action.value}
            onClick={() => handleSelect(action.value)}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
