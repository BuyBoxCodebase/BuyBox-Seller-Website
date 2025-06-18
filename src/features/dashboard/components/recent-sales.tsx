import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { RecentSales as RecentSalesTypes } from '../data/schema';

export function RecentSales({ customers }: RecentSalesTypes) {
  const customerData = customers || [];

  if (customerData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent sales to display
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {
        customerData.map((customer, index) => (
          <div key={index} className='flex items-center gap-4'>
            <Avatar className='h-9 w-9'>
              {/* We don't have image URLs in our data structure, so fallback to initials */}
              <AvatarFallback>{customer.initials}</AvatarFallback>
            </Avatar>
            <div className='flex flex-1 flex-wrap items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm font-medium leading-none'>{customer.name}</p>
                <p className='text-sm text-muted-foreground'>
                  {customer.email}
                </p>
              </div>
              <div className='font-medium'>{customer.amount}</div>
            </div>
          </div>
        ))
      }
    </div>
  )
}