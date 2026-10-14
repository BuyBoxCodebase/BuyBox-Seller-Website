import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderStatus, statusLabels } from '@/features/orders/data/schema'
import useGetAllOrders from '@/hooks/orders/useGetOrders'
import useUpdateOrderStatus from '@/hooks/orders/useUpdateOrderStatus'

// Where to come back to after signing in; read by the post-login handler in features/seller.
export const PENDING_ORDER_ACTION_KEY = 'pendingOrderAction'

export type OrderAction = 'confirm' | 'out-of-stock'

const ACTIONS: Record<OrderAction, { status: OrderStatus; title: string; button: string; done: string }> = {
  confirm: {
    status: 'PROCESSING',
    title: 'Confirm this order?',
    button: 'Yes, confirm order',
    done: 'Order confirmed. Thank you!',
  },
  'out-of-stock': {
    status: 'OUT_OF_STOCK',
    title: 'Mark this order as out of stock?',
    button: 'Yes, mark out of stock',
    done: 'Order marked as out of stock. The customer will be informed.',
  },
}

/** Landing page for the "Confirm order" / "Out of stock" buttons in the seller's WhatsApp message. */
export default function OrderActionPage({ action, orderId }: { action: string; orderId: string }) {
  const navigate = useNavigate()
  const signedIn = !!sessionStorage.getItem('token')

  useEffect(() => {
    if (signedIn) return
    try {
      localStorage.setItem(PENDING_ORDER_ACTION_KEY, window.location.pathname)
    } catch {
      // Storage unavailable: the seller lands on the dashboard after signing in instead.
    }
    navigate({ to: '/sign-in' })
  }, [signedIn, navigate])

  if (!signedIn) return <Centered><Loader2 className='h-6 w-6 animate-spin' /></Centered>
  if (action !== 'confirm' && action !== 'out-of-stock') {
    return <Centered><Message title='Link not recognised' text='Please open the order from your dashboard.' /></Centered>
  }
  return <OrderActionCard action={action} orderId={orderId} />
}

function OrderActionCard({ action, orderId }: { action: OrderAction; orderId: string }) {
  const navigate = useNavigate()
  const { orders, loading } = useGetAllOrders()
  const { updateStatus, updatingId } = useUpdateOrderStatus()
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)
  const config = ACTIONS[action]
  const order = orders.find((o) => o.id === orderId)

  async function apply() {
    try {
      await updateStatus(orderId, config.status)
      setResult({ ok: true, text: config.done })
    } catch (error) {
      setResult({ ok: false, text: error instanceof Error ? error.message : 'Something went wrong.' })
    }
  }

  if (loading) return <Centered><Loader2 className='h-6 w-6 animate-spin' /></Centered>
  if (!order) {
    return <Centered><Message title='Order not found' text='This order does not belong to your store, or it no longer exists.' /></Centered>
  }

  const alreadyHandled = order.status !== 'PENDING'

  return (
    <Centered>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>{result ? (result.ok ? 'Done' : 'Could not update order') : alreadyHandled ? 'Order already updated' : config.title}</CardTitle>
          <CardDescription>Order #{order.id}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          {order.products.map((item, index) => (
            <div key={index} className='rounded-md border p-3 text-sm'>
              <div className='font-medium'>{item.product.name}</div>
              {item.variant?.formattedOptions?.map((option) => (
                <div key={option.name} className='text-muted-foreground'>
                  {option.name}: {option.value}
                </div>
              ))}
              <div className='text-muted-foreground'>
                Quantity: {item.quantity} · ${item.totalPrice.toFixed(2)}
              </div>
            </div>
          ))}
          {result && <p className={result.ok ? 'text-sm' : 'text-sm text-destructive'}>{result.text}</p>}
          {!result && alreadyHandled && (
            <p className='text-sm'>This order is already <strong>{statusLabels[order.status]}</strong>. No action is needed.</p>
          )}
        </CardContent>
        <CardFooter className='flex flex-col gap-2'>
          {!result && !alreadyHandled && (
            <Button
              className='w-full'
              variant={action === 'out-of-stock' ? 'destructive' : 'default'}
              disabled={updatingId === orderId}
              onClick={apply}
            >
              {updatingId === orderId && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {config.button}
            </Button>
          )}
          <Button className='w-full' variant='outline' onClick={() => navigate({ to: '/orders' })}>
            Go to my orders
          </Button>
        </CardFooter>
      </Card>
    </Centered>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className='mx-auto flex min-h-svh w-full max-w-md items-center justify-center p-4'>{children}</div>
}

function Message({ title, text }: { title: string; text: string }) {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{text}</CardDescription>
      </CardHeader>
    </Card>
  )
}
