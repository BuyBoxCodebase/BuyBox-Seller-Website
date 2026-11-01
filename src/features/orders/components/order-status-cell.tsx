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
import { Order, OrderStatus, getSellerActions, statusLabels } from '../data/schema'

const statusStyles: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  PROCESSING: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 hover:bg-green-200',
  CANCELED: 'bg-red-100 text-red-800 hover:bg-red-200',
  OUT_OF_STOCK: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  READY_FOR_PICKUP: 'bg-teal-100 text-teal-800 hover:bg-teal-200',
  DISPATCHED: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
}

const successToasts: Partial<Record<OrderStatus, { title: string; description: string }>> = {
  PROCESSING: {
    title: 'Order accepted',
    description: 'The customer can now see this order as accepted.',
  },
  OUT_OF_STOCK: {
    title: 'Marked as out of stock',
    description: 'The reserved stock has been returned to your inventory.',
  },
  READY_FOR_PICKUP: {
    title: 'Marked as ready for pickup',
    description: 'The customer can now see this order is ready to collect.',
  },
  DISPATCHED: {
    title: 'Marked as dispatched',
    description: 'The customer can now see this order has been dispatched.',
  },
  OUT_FOR_DELIVERY: {
    title: 'Marked as out for delivery',
    description: 'The customer can now see this order is on its way.',
  },
  COMPLETED: {
    title: 'Order completed',
    description: 'The customer can now see this order as completed.',
  },
}

interface OrderStatusCellProps {
  order: Order
  onStatusChange?: (orderId: string, status: OrderStatus) => void
}

export function OrderStatusCell({ order, onStatusChange }: OrderStatusCellProps) {
  const { updateStatus, updatingId } = useUpdateOrderStatus()
  const isUpdating = updatingId === order.id
  const actions = getSellerActions(order)

  // Statuses with no seller action left render as a plain badge.
  if (actions.length === 0) {
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
      toast(successToasts[status] ?? { title: 'Order updated' })
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
          <Badge className={`${statusStyles[order.status]} cursor-pointer gap-1`}>
            {isUpdating ? 'Updating...' : statusLabels[order.status]}
            <ChevronDownIcon className='h-3 w-3' />
          </Badge>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-[160px]'>
        {actions.map((action) => (
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
